"""Endpoint chẩn đoán: nhận ảnh lá, trả nhãn bệnh, xác suất và ảnh giải thích."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, File, Query, Request, UploadFile

from app.deps import AppState, client_ip, get_predictor, get_state
from app.errors import RateLimitExceeded
from app.ml.predictor import DurianPredictor, InvalidImageError
from app.schemas import Lang, PredictionOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["inference"])

# Chỉ nhận các định dạng ảnh mà Pillow đọc chắc chắn và người dùng thực tế hay có.
ALLOWED_CONTENT_TYPES = frozenset(
    {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp", "image/tiff"}
)

DISCLAIMER = {
    "vi": (
        "Kết quả chỉ mang tính tham khảo, dựa trên 5 nhóm được mô hình huấn luyện. "
        "Vui lòng đối chiếu thực địa hoặc hỏi ý kiến cán bộ khuyến nông trước khi xử lý."
    ),
    "en": (
        "This result is for reference only and is limited to the 5 trained classes. "
        "Confirm in the field or consult an agricultural extension officer before acting."
    ),
}


@router.post(
    "/predict",
    response_model=PredictionOut,
    summary="Chẩn đoán bệnh từ ảnh lá sầu riêng",
    responses={
        422: {"description": "Ảnh không hợp lệ hoặc vượt giới hạn"},
        429: {"description": "Vượt giới hạn số request"},
        503: {"description": "Mô hình chưa sẵn sàng"},
    },
)
async def predict(
    request: Request,
    file: UploadFile = File(..., description="Tệp ảnh lá sầu riêng"),
    lang: Lang = Query("vi", description="Ngôn ngữ cho tên bệnh và lời khuyên"),
    gradcam: bool = Query(True, description="Có sinh ảnh giải thích Grad-CAM hay không"),
    predictor: DurianPredictor = Depends(get_predictor),
    state: AppState = Depends(get_state),
) -> PredictionOut:
    settings = state.settings
    request_id = getattr(request.state, "request_id", "-")

    if settings.rate_limit_enabled and state.limiter is not None:
        ip = client_ip(request, settings.trusted_proxy_count)
        allowed, retry_after = state.limiter.check(ip)
        if not allowed:
            logger.warning("Chặn do vượt giới hạn tần suất", extra={"client_ip": ip, "request_id": request_id})
            raise RateLimitExceeded(retry_after)

    if file.content_type and file.content_type.lower() not in ALLOWED_CONTENT_TYPES:
        raise InvalidImageError(
            f"Định dạng {file.content_type!r} không được hỗ trợ. "
            f"Chấp nhận: JPEG, PNG, WebP, BMP, TIFF."
        )

    # Đọc có chặn trên: không tin vào Content-Length vì client có thể khai sai.
    limit = settings.max_upload_bytes
    data = await file.read(limit + 1)
    if len(data) > limit:
        raise InvalidImageError(
            f"Ảnh vượt giới hạn {limit // (1024 * 1024)} MB. Vui lòng giảm kích thước ảnh."
        )
    await file.close()

    image = predictor.decode_image(data)

    # Suy luận là tác vụ nặng CPU và có lock; đẩy sang threadpool để không chẹn event loop.
    import anyio

    result = await anyio.to_thread.run_sync(
        lambda: predictor.predict(image, want_gradcam=gradcam, lang=lang)
    )

    logger.info(
        "Chẩn đoán xong",
        extra={
            "request_id": request_id,
            "predicted_class": result.predicted_class,
            "confidence": round(result.confidence, 4),
            "inference_ms": result.inference_ms,
            "bytes": len(data),
            "gradcam": result.gradcam_png_b64 is not None,
            "bbox": result.bbox is not None,
        },
    )

    return PredictionOut(
        request_id=request_id,
        predicted_class=result.predicted_class,
        confidence=result.confidence,
        is_healthy=result.is_healthy,
        is_confident=result.is_confident,
        scores=[
            {"class_name": s.class_name, "label": s.label, "probability": s.probability}
            for s in result.scores
        ],
        info=result.info,
        inference_ms=result.inference_ms,
        gradcam_png_b64=result.gradcam_png_b64,
        bbox=(
            {
                "x": result.bbox.x, "y": result.bbox.y,
                "width": result.bbox.width, "height": result.bbox.height,
                "area_ratio": result.bbox.area_ratio,
            }
            if result.bbox
            else None
        ),
        warnings=result.warnings,
        model_name=settings.backbone_name,
        disclaimer=DISCLAIMER[lang],
    )
