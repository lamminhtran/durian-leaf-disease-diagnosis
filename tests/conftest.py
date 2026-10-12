"""Đồ gá dùng chung cho test.

Phần lớn test chạy với một predictor giả: nạp CAFormer thật tốn vài giây và 94MB
trọng số, khiến bộ test không chạy được trên CI nếu thiếu tệp. Các test cần mô
hình thật được đánh dấu `@pytest.mark.integration` và tự bỏ qua khi không có tệp.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

import pytest
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import Settings  # noqa: E402
from app.deps import AppState  # noqa: E402
from app.ml.labels import CLASS_NAMES, info_for  # noqa: E402
from app.ml.predictor import ClassScore, PredictionResult  # noqa: E402
from app.ml.wsol import BoundingBox  # noqa: E402
from app.ratelimit import SlidingWindowRateLimiter  # noqa: E402


def make_image_bytes(size=(320, 240), colour=(40, 120, 60), fmt="JPEG") -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, colour).save(buf, format=fmt)
    return buf.getvalue()


class FakePredictor:
    """Thay cho DurianPredictor: giữ nguyên giao diện, bỏ phần suy luận thật."""

    def __init__(self, predicted="LEAF_BLIGHT", confidence=0.97, gradcam=True, wsol=True):
        self.device = "cpu"
        self.gradcam_available = gradcam
        self.enable_wsol = wsol
        self._predicted = predicted
        self._confidence = confidence
        self.calls = 0

    def decode_image(self, data: bytes):
        from app.ml.predictor import InvalidImageError

        if not data:
            raise InvalidImageError("Tệp rỗng")
        try:
            with Image.open(io.BytesIO(data)) as img:
                return img.convert("RGB")
        except Exception as exc:
            raise InvalidImageError(f"Không đọc được ảnh: {exc}") from exc

    def predict(self, image, want_gradcam=True, lang="vi") -> PredictionResult:
        self.calls += 1
        rest = (1.0 - self._confidence) / (len(CLASS_NAMES) - 1)
        scores = sorted(
            (
                ClassScore(
                    class_name=name,
                    probability=self._confidence if name == self._predicted else rest,
                    label=info_for(name, lang)["name"],
                )
                for name in CLASS_NAMES
            ),
            key=lambda s: s.probability,
            reverse=True,
        )
        return PredictionResult(
            predicted_class=self._predicted,
            confidence=self._confidence,
            is_healthy=self._predicted == "HEALTHY_LEAF",
            is_confident=self._confidence >= 0.60,
            scores=scores,
            info=info_for(self._predicted, lang),
            inference_ms=12.34,
            gradcam_png_b64="aGVsbG8=" if (want_gradcam and self.gradcam_available) else None,
            bbox=(
                BoundingBox(x=0.25, y=0.3, width=0.4, height=0.35, area_ratio=0.14)
                if (want_gradcam and self.gradcam_available and self.enable_wsol)
                else None
            ),
            warnings=[] if self._confidence >= 0.60 else ["low_confidence"],
        )


@pytest.fixture
def settings() -> Settings:
    return Settings(
        environment="development",
        rate_limit_enabled=False,
        log_format="console",
        _env_file=None,
    )


@pytest.fixture
def client(settings):
    """TestClient với predictor giả, bỏ qua lifespan nạp mô hình thật."""
    from fastapi.testclient import TestClient

    from app.main import create_app

    app = create_app()
    app.router.lifespan_context = _noop_lifespan
    state = AppState(settings=settings, predictor=FakePredictor())
    app.state.app_state = state

    with TestClient(app) as c:
        c.app_state = state
        yield c


from contextlib import asynccontextmanager  # noqa: E402


@asynccontextmanager
async def _noop_lifespan(app):
    yield


@pytest.fixture
def limiter():
    return SlidingWindowRateLimiter(max_requests=3, window_seconds=60)
