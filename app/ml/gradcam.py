"""Grad-CAM thuần PyTorch, không phụ thuộc thư viện ngoài.

Tự hiện thực thay vì dùng `pytorch-grad-cam` để giảm phụ thuộc, kiểm soát được bố
cục tensor của từng backbone, và để tối ưu được bước backward (xem bên dưới).

Với CAFormer-S18, lớp đích `backbone.stages[3]` cho đầu ra (B, 512, 7, 7) — đã ở
dạng NCHW nên không cần biến đổi lại. Lớp này được chọn vì là tầng đặc trưng cuối
trước global pooling, tức gần nhất với quyết định phân loại.
"""

from __future__ import annotations

import logging

import torch
import torch.nn as nn
import torch.nn.functional as F

logger = logging.getLogger(__name__)


def _to_nchw(t: torch.Tensor) -> torch.Tensor:
    """Chuẩn hoá đầu ra của lớp đích về dạng (B, C, H, W).

    Hỗ trợ ba bố cục thường gặp ở các backbone trong timm:
      - (B, C, H, W): các tầng dạng tích chập, dùng luôn.
      - (B, H, W, C): Swin/MaxViT dạng channels-last, cần permute.
      - (B, N, C):    ViT/DeiT dạng chuỗi token, cần tách N thành lưới vuông.
    """
    if t.dim() == 4:
        # Phân biệt NHWC với NCHW: chỉ coi là NHWC khi hai chiều giữa bằng nhau
        # (lưới không gian vuông) và khác chiều cuối (số kênh).
        if t.shape[1] == t.shape[2] and t.shape[1] != t.shape[3]:
            return t.permute(0, 3, 1, 2).contiguous()
        return t
    if t.dim() == 3:
        b, n, c = t.shape
        side = int(round(n**0.5))
        if side * side != n:
            # Có token phân lớp (CLS) ở đầu — bỏ đi rồi thử lại.
            side = int(round((n - 1) ** 0.5))
            if side * side != n - 1:
                raise ValueError(f"Không suy ra được lưới không gian từ {n} token")
            t = t[:, 1:, :]
        return t.reshape(b, side, side, c).permute(0, 3, 1, 2).contiguous()
    raise ValueError(f"Bố cục tensor không hỗ trợ: {tuple(t.shape)}")


class GradCAM:
    """Sinh bản đồ nhiệt Grad-CAM cho lớp được dự đoán.

    Không an toàn khi dùng đồng thời từ nhiều luồng (hook ghi state vào instance).
    Phía gọi phải tuần tự hoá bằng lock — xem `predictor.py`.
    """

    def __init__(self, model: nn.Module, target_layer: nn.Module) -> None:
        self._model = model
        self._activations: torch.Tensor | None = None
        # Giữ nguyên đồ thị tính toán của activation (KHÔNG detach) để lát nữa còn
        # lấy gradient tới đúng tensor này.
        self._handle = target_layer.register_forward_hook(self._save_activation)

    def _save_activation(self, _module, _inputs, output) -> None:
        # Tham số mô hình đã bị đóng băng nên không có gì phía trên cần gradient;
        # activation này vì thế là "lá" và bật được requires_grad. Nhờ vậy
        # autograd chỉ dựng đồ thị TỪ ĐÂY trở đi (stage cuối -> head ->
        # classifier) thay vì cả backbone.
        if not output.requires_grad:
            output.requires_grad_(True)
        self._activations = output

    def close(self) -> None:
        self._handle.remove()
        self._activations = None

    def __call__(
        self,
        input_tensor: torch.Tensor,
        output_size: int,
        class_index: int | None = None,
    ) -> tuple[torch.Tensor, torch.Tensor, int]:
        """Tính Grad-CAM trong một lượt forward và một lượt backward cục bộ.

        Hai điểm tối ưu so với cách làm thông thường:

        1. `class_index=None` nghĩa là giải thích cho lớp mô hình dự đoán, và lớp đó
           lấy luôn từ logits của lượt forward này — không cần thêm một lượt no_grad
           riêng chỉ để biết lớp thắng.
        2. Dùng `torch.autograd.grad(score, activation)` thay vì `score.backward()`.
           Grad-CAM chỉ cần gradient tại lớp đích, nên autograd chỉ phải đi ngược
           đoạn đồ thị từ logits về lớp đích (ở đây là stage cuối -> head ->
           classifier). `backward()` sẽ lan ngược qua TOÀN BỘ backbone và tính cả
           gradient của mọi tham số — tốn gấp nhiều lần mà kết quả không dùng tới.

        Trả về (logits, cam, class_index); cam chuẩn hoá [0,1], shape
        (output_size, output_size).
        """
        self._activations = None

        with torch.enable_grad():
            logits = self._model(input_tensor)
            if class_index is None:
                class_index = int(logits.argmax(dim=1).item())

            activations = self._activations
            if activations is None:
                raise RuntimeError("Hook Grad-CAM không bắt được activation của lớp đích")
            if not activations.requires_grad:
                raise RuntimeError(
                    "Activation của lớp đích không nằm trong đồ thị tính toán; "
                    "không tính được Grad-CAM"
                )

            score = logits[0, class_index]
            (gradients,) = torch.autograd.grad(score, activations, retain_graph=False)

        acts = _to_nchw(activations.detach())
        grads = _to_nchw(gradients.detach())
        self._activations = None  # thả tham chiếu để giải phóng đồ thị

        # Trọng số mỗi kênh = gradient bình quân trên toàn bộ chiều không gian.
        weights = grads.mean(dim=(2, 3), keepdim=True)
        cam = F.relu((weights * acts).sum(dim=1, keepdim=True))

        cam = F.interpolate(
            cam, size=(output_size, output_size), mode="bilinear", align_corners=False
        )
        cam = cam[0, 0]

        # Chuẩn hoá về [0,1]. Nếu bản đồ phẳng (hiếm), trả toàn 0 thay vì chia cho 0.
        cam_min, cam_max = cam.min(), cam.max()
        cam = (cam - cam_min) / (cam_max - cam_min).clamp_min(1e-8)
        if not torch.isfinite(cam).all():
            cam = torch.zeros_like(cam)

        return logits.detach(), cam, class_index
