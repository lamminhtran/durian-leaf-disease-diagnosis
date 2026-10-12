"""Nạp mô hình, tiền xử lý ảnh, suy luận và sinh ảnh giải thích Grad-CAM."""

from __future__ import annotations

import base64
import io
import logging
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image, ImageOps, UnidentifiedImageError
from torchvision import transforms

from app.ml.gradcam import GradCAM
from app.ml.labels import CLASS_NAMES, HEALTHY_CLASS, info_for
from app.ml.model import DurianClassifier, ModelLoadError, load_model, resolve_device
from app.ml.wsol import BoundingBox, localize

logger = logging.getLogger(__name__)

# Phải khớp tuyệt đối với mã huấn luyện (val/test transform):
#   Resize((224,224)) -> ToTensor() -> Normalize(ImageNet mean/std)
# Lưu ý: huấn luyện dùng Resize về đúng hình vuông (làm méo tỉ lệ), KHÔNG phải
# resize cạnh ngắn rồi center-crop. Giữ nguyên để suy luận trùng phân phối huấn luyện.
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)

# Dưới ngưỡng này, kết quả bị đánh dấu là "không chắc chắn" trên giao diện.
LOW_CONFIDENCE_THRESHOLD = 0.60

# Kích thước ảnh giải thích trả về (phóng to từ 224 cho dễ xem).
OVERLAY_RENDER_SIZE = 448

# Lớp đích Grad-CAM cho từng backbone, lấy đúng theo notebook huấn luyện.
#
# Vì sao phải ghim thay vì tự dò: hai lớp khác nhau trong cùng một tầng có thể
# cho bản đồ nhiệt rất giống nhau nhưng KHUNG BAO lệch hẳn. Đã đo:
#   - CAFormer : stages[-1] so với stages[-1].blocks[-1].norm2
#                tương quan heatmap 0.98 nhưng IoU khung bao chỉ 0.79
#   - MobileNet: blocks[-1] so với blocks[5][0].conv
#                tương quan 0.95 nhưng IoU 0.74, có 13/40 ảnh dưới 0.5
# Không ghim thì ảnh trên web lệch khỏi hình trong báo cáo.
NOTEBOOK_TARGET_LAYERS: dict[str, str] = {
    "caformer_s18.sail_in22k_ft_in1k": "stages.3.blocks.-1.norm2",
    "mobilenetv3_small_100": "blocks.5.0.conv",
}


class InvalidImageError(ValueError):
    """Dữ liệu tải lên không phải ảnh đọc được, hoặc vượt giới hạn cho phép."""


@dataclass(frozen=True)
class ClassScore:
    class_name: str
    probability: float
    label: str


@dataclass
class PredictionResult:
    predicted_class: str
    confidence: float
    is_healthy: bool
    is_confident: bool
    scores: list[ClassScore]
    info: dict
    inference_ms: float
    gradcam_png_b64: str | None = None
    # Khung bao WSOL suy ra từ bản đồ nhiệt; None khi không có vùng nào đủ lớn.
    bbox: BoundingBox | None = None
    warnings: list[str] = field(default_factory=list)


def _jet_colormap(values: np.ndarray) -> np.ndarray:
    """Áp bảng màu JET cho mảng [0,1] -> float32 RGB trong [0,1].

    Tự hiện thực để không phải phụ thuộc OpenCV chỉ vì một bảng màu. Đã đối chiếu
    với `cv2.COLORMAP_JET`: sai lệch tối đa 1/255 trên toàn thang 256 mức, tức
    bằng mắt không phân biệt được.
    """
    v = np.clip(values, 0.0, 1.0)
    r = np.clip(1.5 - np.abs(4.0 * v - 3.0), 0.0, 1.0)
    g = np.clip(1.5 - np.abs(4.0 * v - 2.0), 0.0, 1.0)
    b = np.clip(1.5 - np.abs(4.0 * v - 1.0), 0.0, 1.0)
    return np.stack([r, g, b], axis=-1).astype(np.float32)


class DurianPredictor:
    """Bọc mô hình đã nạp. Dùng được từ nhiều luồng: mọi lần suy luận đều qua lock.

    Lý do cần lock: Grad-CAM gắn hook ghi state vào instance và chạy backward trên
    mô hình dùng chung, nên hai request song song sẽ ghi đè lẫn nhau. Lock giữ cho
    mỗi lần suy luận là nguyên tử; muốn tăng thông lượng thì chạy thêm worker.
    """

    def __init__(
        self,
        backbone_name: str,
        weights_path: Path,
        device_preference: str = "auto",
        image_size: int = 224,
        enable_gradcam: bool = True,
        gradcam_alpha: float = 0.5,
        max_image_pixels: int = 50_000_000,
        gradcam_target_layer: str = "",
        enable_wsol: bool = True,
    ) -> None:
        self.backbone_name = backbone_name
        self.image_size = image_size
        self.gradcam_alpha = gradcam_alpha
        self.max_image_pixels = max_image_pixels
        self.enable_wsol = enable_wsol
        self._target_layer_path = gradcam_target_layer
        self.device = resolve_device(device_preference)

        self._model: DurianClassifier = load_model(
            backbone_name, weights_path, self.device, image_size
        )
        self._lock = threading.Lock()

        self._transform = transforms.Compose(
            [
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
            ]
        )

        self._gradcam: GradCAM | None = None
        if enable_gradcam:
            try:
                layer, layer_name = self._resolve_target_layer()
                self._gradcam = GradCAM(self._model, layer)
                logger.info("Lớp đích Grad-CAM", extra={"target_layer": layer_name})
            except Exception:
                # Thiếu ảnh giải thích thì vẫn chẩn đoán được; không để chết dịch vụ.
                logger.exception("Không khởi tạo được Grad-CAM; sẽ chạy mà không có ảnh giải thích")
                self._gradcam = None

    # --- Khởi tạo ---

    def _resolve_target_layer(self) -> tuple[torch.nn.Module, str]:
        """Chọn lớp đích cho Grad-CAM, trả về (module, tên để ghi log).

        Thứ tự ưu tiên:
          1. Đường dẫn do cấu hình chỉ định (GRADCAM_TARGET_LAYER).
          2. NOTEBOOK_TARGET_LAYERS — lớp đúng theo notebook cho backbone đã biết.
          3. `stages[-1].blocks[-1].norm2`, rồi `stages[-1]`, cho backbone phân tầng.
          4. `blocks[-1]` cho ViT/DeiT (không có 'stages').
        Ba bước sau chỉ là dự phòng cho backbone chưa có trong bảng; với mô hình
        đang phục vụ thì luôn rơi vào bước 1 hoặc 2.
        """
        backbone = self._model.backbone

        path = self._target_layer_path or NOTEBOOK_TARGET_LAYERS.get(self.backbone_name)
        if path:
            module = backbone
            for part in path.split("."):
                # Chấp nhận cả chỉ số âm ("-1") để viết được "blocks.-1".
                is_index = part.lstrip("-").isdigit()
                module = module[int(part)] if is_index else getattr(module, part)
            source = "cấu hình" if self._target_layer_path else "notebook"
            return module, f"backbone.{path} ({source})"

        stages = getattr(backbone, "stages", None)
        if stages is not None and len(stages) > 0:
            blocks = getattr(stages[-1], "blocks", None)
            if blocks is not None and len(blocks) > 0:
                norm2 = getattr(blocks[-1], "norm2", None)
                if norm2 is not None:
                    return norm2, "backbone.stages[-1].blocks[-1].norm2"
            return stages[-1], "backbone.stages[-1]"

        blocks = getattr(backbone, "blocks", None)
        if blocks is not None and len(blocks) > 0:
            norm2 = getattr(blocks[-1], "norm2", None)
            if norm2 is not None:
                return norm2, "backbone.blocks[-1].norm2"
            return blocks[-1], "backbone.blocks[-1]"

        raise RuntimeError(f"Không xác định được lớp đích Grad-CAM cho {self.backbone_name!r}")

    @property
    def gradcam_available(self) -> bool:
        return self._gradcam is not None

    # --- Tiền xử lý ---

    def decode_image(self, data: bytes) -> Image.Image:
        """Giải mã bytes thành ảnh RGB, có kiểm tra an toàn.

        Xử lý xoay theo EXIF: ảnh chụp từ điện thoại thường có cờ orientation, nếu
        bỏ qua thì mô hình nhận ảnh nằm ngang so với lúc người dùng nhìn thấy.
        """
        if not data:
            raise InvalidImageError("Tệp rỗng")
        try:
            # Mở hai lần: lần đầu để kiểm tra kích thước trước khi nạp toàn bộ pixel.
            with Image.open(io.BytesIO(data)) as probe:
                width, height = probe.size
                if width * height > self.max_image_pixels:
                    raise InvalidImageError(
                        f"Ảnh quá lớn ({width}x{height} điểm ảnh), "
                        f"vượt giới hạn {self.max_image_pixels:,} điểm ảnh"
                    )
            with Image.open(io.BytesIO(data)) as img:
                img = ImageOps.exif_transpose(img)
                return img.convert("RGB")
        except InvalidImageError:
            raise
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            raise InvalidImageError(f"Không đọc được ảnh: {exc}") from exc

    # --- Suy luận ---

    def predict(
        self, image: Image.Image, want_gradcam: bool = True, lang: str = "vi"
    ) -> PredictionResult:
        tensor = self._transform(image).unsqueeze(0).to(self.device)
        use_cam = want_gradcam and self._gradcam is not None

        started = time.perf_counter()
        with self._lock:
            if use_cam:
                try:
                    # Một lượt forward + một lượt backward; lớp được giải thích
                    # chính là lớp mô hình dự đoán.
                    logits, cam, _ = self._gradcam(tensor, self.image_size)
                except Exception:
                    logger.exception("Grad-CAM thất bại; trả kết quả không kèm ảnh giải thích")
                    with torch.no_grad():
                        logits = self._model(tensor)
                    cam = None
            else:
                with torch.no_grad():
                    logits = self._model(tensor)
                cam = None
            probs = F.softmax(logits, dim=1)[0].cpu()
        inference_ms = (time.perf_counter() - started) * 1000.0

        top_index = int(probs.argmax().item())
        predicted_class = CLASS_NAMES[top_index]
        confidence = float(probs[top_index])

        scores = sorted(
            (
                ClassScore(
                    class_name=name,
                    probability=float(probs[i]),
                    label=info_for(name, lang)["name"],
                )
                for i, name in enumerate(CLASS_NAMES)
            ),
            key=lambda s: s.probability,
            reverse=True,
        )

        warnings: list[str] = []
        is_confident = confidence >= LOW_CONFIDENCE_THRESHOLD
        if not is_confident:
            warnings.append("low_confidence")

        overlay_b64 = None
        bbox = None
        if cam is not None:
            cam_np = cam.cpu().numpy()
            try:
                overlay_b64 = self._render_overlay(image, cam)
            except Exception:
                logger.exception("Không dựng được ảnh overlay Grad-CAM")
            if self.enable_wsol:
                try:
                    # Khoanh vùng WSOL: khung bao suy ra từ chính bản đồ nhiệt,
                    # không dùng bất kỳ nhãn vị trí nào.
                    bbox = localize(cam_np)
                except Exception:
                    logger.exception("Không tính được khung bao WSOL")

        return PredictionResult(
            predicted_class=predicted_class,
            confidence=confidence,
            is_healthy=predicted_class == HEALTHY_CLASS,
            is_confident=is_confident,
            scores=scores,
            info=info_for(predicted_class, lang),
            inference_ms=round(inference_ms, 2),
            gradcam_png_b64=overlay_b64,
            bbox=bbox,
            warnings=warnings,
        )

    # --- Ảnh giải thích ---

    def _render_overlay(self, image: Image.Image, cam: torch.Tensor) -> str:
        """Phủ bản đồ nhiệt lên ảnh, trả về PNG đã mã hoá base64.

        Dựng lại đúng `show_cam_on_image` của thư viện `pytorch-grad-cam` mà
        notebook huấn luyện dùng, để ảnh trên web trùng với hình trong báo cáo:

            cam = (1 - image_weight) * heatmap + image_weight * img
            cam = cam / max(cam)

        Mấu chốt là trộn ĐỀU theo tỉ lệ cố định trên toàn ảnh rồi chuẩn hoá lại
        theo giá trị lớn nhất — nhờ vậy màu lên rực và đậm. Bản trước trộn theo
        cường độ CAM nên vùng nguội gần như giữ nguyên ảnh gốc, nhìn nhạt hẳn so
        với hình trên Kaggle.

        Overlay dựng trên ảnh đã resize về đúng hình học mô hình nhìn thấy
        (224x224) để bản đồ nhiệt khớp pixel, sau đó mới phóng to cho dễ xem.
        """
        base = image.resize((self.image_size, self.image_size), Image.BILINEAR)
        img = np.asarray(base, dtype=np.float32) / 255.0

        heat = _jet_colormap(cam.cpu().numpy())

        image_weight = float(np.clip(self.gradcam_alpha, 0.0, 1.0))
        blended = (1.0 - image_weight) * heat + image_weight * img
        peak = float(blended.max())
        if peak > 0:
            blended = blended / peak

        out = Image.fromarray(np.clip(blended * 255.0, 0, 255).astype(np.uint8))
        if self.image_size != OVERLAY_RENDER_SIZE:
            out = out.resize((OVERLAY_RENDER_SIZE, OVERLAY_RENDER_SIZE), Image.LANCZOS)

        buf = io.BytesIO()
        out.save(buf, format="PNG", optimize=True)
        return base64.b64encode(buf.getvalue()).decode("ascii")


__all__ = [
    "BoundingBox",
    "DurianPredictor",
    "InvalidImageError",
    "ModelLoadError",
    "PredictionResult",
    "ClassScore",
    "LOW_CONFIDENCE_THRESHOLD",
]
