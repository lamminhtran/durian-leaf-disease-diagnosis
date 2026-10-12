"""Endpoint kiểm tra sức khoẻ, phục vụ load balancer và orchestrator."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status

from app.deps import AppState, get_state
from app.ml.labels import CLASS_NAMES, NUM_CLASSES
from app.ml.metrics import load_metrics  # noqa: F401  (dùng ở main khi khởi động)
from app.ml.predictor import LOW_CONFIDENCE_THRESHOLD
from app.schemas import HealthOut, ModelInfoOut, ReadyOut

router = APIRouter(tags=["system"])


@router.get("/healthz", response_model=HealthOut, summary="Liveness probe")
def healthz(state: AppState = Depends(get_state)) -> HealthOut:
    """Tiến trình còn sống. Luôn 200 nếu server còn phục vụ được request."""
    return HealthOut(
        status="ok",
        version=state.settings.app_version,
        environment=state.settings.environment,
    )


# Một số load balancer dò bằng HEAD. Để ngoài schema nên không trùng operation id
# với route GET ở trên.
@router.head("/healthz", include_in_schema=False)
def healthz_head(state: AppState = Depends(get_state)) -> HealthOut:
    return healthz(state)


@router.get("/readyz", response_model=ReadyOut, summary="Readiness probe")
def readyz(response: Response, state: AppState = Depends(get_state)) -> ReadyOut:
    """Mô hình đã nạp xong hay chưa. Trả 503 khi chưa, để LB không gửi traffic vào."""
    if not state.is_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return ReadyOut(status="not_ready", model_loaded=False, detail=state.load_error)
    return ReadyOut(
        status="ready", model_loaded=True, device=str(state.predictor.device)
    )


@router.get("/api/model-info", response_model=ModelInfoOut, summary="Thông tin mô hình")
def model_info(state: AppState = Depends(get_state)) -> ModelInfoOut:
    """Metadata và số liệu đánh giá của mô hình đang phục vụ.

    Gọi được cả khi mô hình chưa nạp, để giao diện vẫn hiển thị được thông tin tĩnh.
    """
    settings = state.settings
    return ModelInfoOut(
        model_name=settings.backbone_name,
        backbone=settings.backbone_name,
        num_classes=NUM_CLASSES,
        class_names=list(CLASS_NAMES),
        image_size=settings.image_size,
        device=str(state.predictor.device) if state.predictor else "unloaded",
        gradcam_available=bool(state.predictor and state.predictor.gradcam_available),
        wsol_available=bool(
            state.predictor and state.predictor.gradcam_available and state.predictor.enable_wsol
        ),
        chat_available=state.settings.llm_configured,
        low_confidence_threshold=LOW_CONFIDENCE_THRESHOLD,
        metrics=state.metrics,
    )
