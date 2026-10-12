"""Định nghĩa kiến trúc mô hình.

Kiến trúc ở đây phải khớp CHÍNH XÁC với mã huấn luyện, vì trọng số được nạp bằng
`strict=True`. Cấu trúc gốc khi huấn luyện:

    backbone   = timm.create_model(name, pretrained=False, num_classes=0, global_pool='avg')
    classifier = Linear(num_features, 512) -> ReLU -> BatchNorm1d(512) -> Dropout(0.4) -> Linear(512, 5)

Đã đối chiếu với tệp trọng số: khoá `classifier.2.running_mean` (BatchNorm1d) và
`classifier.4.weight` có shape (5, 512) xác nhận đúng thứ tự các lớp trên.
"""

from __future__ import annotations

import logging
from pathlib import Path

import timm
import torch
import torch.nn as nn

from app.ml.labels import NUM_CLASSES

logger = logging.getLogger(__name__)


class ModelLoadError(RuntimeError):
    """Không nạp được trọng số — dịch vụ không thể chẩn đoán."""


class DurianClassifier(nn.Module):
    """Backbone timm (bỏ đầu phân loại gốc) + đầu phân loại tuỳ chỉnh."""

    def __init__(
        self,
        backbone_name: str,
        num_classes: int = NUM_CLASSES,
        image_size: int = 224,
    ) -> None:
        super().__init__()
        self.backbone = timm.create_model(
            backbone_name, pretrained=False, num_classes=0, global_pool="avg"
        )
        # Suy ra số chiều đặc trưng bằng một lần chạy thử, giống mã huấn luyện,
        # thay vì tin vào thuộc tính num_features (không đúng với mọi backbone).
        with torch.no_grad():
            num_features = self.backbone(torch.zeros(1, 3, image_size, image_size)).shape[1]

        self.classifier = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.4),
            nn.Linear(512, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.backbone(x))


def resolve_device(preference: str = "auto") -> torch.device:
    """'auto' -> cuda nếu có, ngược lại cpu.

    Không tự chọn 'mps': một số toán tử của backbone và bước backward của Grad-CAM
    chưa ổn định trên backend này. Người dùng vẫn ép được bằng DEVICE=mps.
    """
    preference = (preference or "auto").lower()
    if preference == "auto":
        return torch.device("cuda" if torch.cuda.is_available() else "cpu")
    if preference not in ("cpu", "cuda", "mps"):
        raise ValueError(f"device không hợp lệ: {preference!r}")
    if preference == "cuda" and not torch.cuda.is_available():
        raise ModelLoadError("DEVICE=cuda nhưng máy không có CUDA khả dụng")
    return torch.device(preference)


def load_model(
    backbone_name: str,
    weights_path: Path,
    device: torch.device,
    image_size: int = 224,
) -> DurianClassifier:
    """Dựng mô hình và nạp trọng số. Mọi sai khác khoá đều coi là lỗi nghiêm trọng."""
    if not weights_path.is_file():
        raise ModelLoadError(f"Không tìm thấy tệp trọng số: {weights_path}")

    model = DurianClassifier(backbone_name, image_size=image_size)

    try:
        # weights_only=True: không cho phép tệp trọng số thực thi mã khi giải tuần tự.
        state_dict = torch.load(weights_path, map_location="cpu", weights_only=True)
    except Exception as exc:  # pragma: no cover - phụ thuộc tệp cụ thể
        raise ModelLoadError(f"Không đọc được tệp trọng số {weights_path}: {exc}") from exc

    # Mã huấn luyện lưu trực tiếp state_dict; vẫn hỗ trợ dạng checkpoint có bọc.
    if isinstance(state_dict, dict) and "state_dict" in state_dict:
        state_dict = state_dict["state_dict"]

    try:
        model.load_state_dict(state_dict, strict=True)
    except RuntimeError as exc:
        raise ModelLoadError(
            f"Trọng số không khớp kiến trúc {backbone_name!r}. "
            f"Kiểm tra BACKBONE_NAME và MODEL_PATH. Chi tiết: {exc}"
        ) from exc

    # Đóng băng toàn bộ tham số. Mô hình chỉ dùng để suy luận, và Grad-CAM cũng
    # không cần gradient của THAM SỐ — nó chỉ cần gradient tại activation của lớp
    # đích. Để tham số còn requires_grad khiến autograd dựng đồ thị cho cả
    # backbone ở mỗi lần suy luận, giữ lại toàn bộ activation trung gian: tốn
    # hàng trăm MB và là thứ làm container 512MB bị OOM.
    model.requires_grad_(False)
    model.to(device).eval()
    logger.info(
        "Đã nạp mô hình",
        extra={"backbone": backbone_name, "weights": str(weights_path), "device": str(device)},
    )
    return model
