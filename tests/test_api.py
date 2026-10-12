"""Test hợp đồng HTTP của API, dùng predictor giả."""

from __future__ import annotations

import pytest

from app.deps import AppState
from app.ml.labels import CLASS_NAMES
from tests.conftest import FakePredictor, make_image_bytes


def post_image(client, data=None, params="", content_type="image/jpeg", name="leaf.jpg"):
    data = make_image_bytes() if data is None else data
    return client.post(f"/api/predict{params}", files={"file": (name, data, content_type)})


def test_healthz_is_ok(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_readyz_reports_ready_when_model_loaded(client):
    r = client.get("/readyz")
    assert r.status_code == 200
    assert r.json() == {"status": "ready", "model_loaded": True, "device": "cpu", "detail": None}


def test_readyz_is_503_when_model_failed_to_load(client, settings):
    client.app_state.predictor = None
    client.app_state.load_error = "tệp trọng số hỏng"
    r = client.get("/readyz")
    assert r.status_code == 503
    assert r.json()["model_loaded"] is False
    assert "hỏng" in r.json()["detail"]


def test_predict_returns_full_contract(client):
    r = post_image(client)
    assert r.status_code == 200, r.text
    body = r.json()

    assert body["predicted_class"] == "LEAF_BLIGHT"
    assert 0.0 <= body["confidence"] <= 1.0
    assert body["is_healthy"] is False
    assert body["is_confident"] is True
    assert body["gradcam_png_b64"]
    assert body["disclaimer"]
    assert body["request_id"]

    # Phải trả đủ 5 lớp, sắp xếp giảm dần, tổng xấp xỉ 1.
    assert len(body["scores"]) == len(CLASS_NAMES)
    probs = [s["probability"] for s in body["scores"]]
    assert probs == sorted(probs, reverse=True)
    assert abs(sum(probs) - 1.0) < 1e-6
    assert {s["class_name"] for s in body["scores"]} == set(CLASS_NAMES)


def test_request_id_header_is_returned_and_echoed(client):
    r = post_image(client)
    assert r.headers["X-Request-ID"] == r.json()["request_id"]

    r2 = client.get("/healthz", headers={"X-Request-ID": "trace-me-123"})
    assert r2.headers["X-Request-ID"] == "trace-me-123"


@pytest.mark.parametrize("lang,expected", [("vi", "Bệnh cháy lá"), ("en", "Leaf blight")])
def test_language_switches_localized_content(client, lang, expected):
    body = post_image(client, params=f"?lang={lang}").json()
    assert body["info"]["name"] == expected


def test_invalid_language_is_rejected(client):
    assert post_image(client, params="?lang=fr").status_code == 422


def test_prediction_includes_wsol_bbox(client):
    body = post_image(client).json()
    b = body["bbox"]
    assert b is not None
    for key in ("x", "y", "width", "height", "area_ratio"):
        assert 0.0 <= b[key] <= 1.0
    assert b["x"] + b["width"] <= 1.0
    assert b["y"] + b["height"] <= 1.0


def test_bbox_is_absent_when_gradcam_disabled(client):
    """Khung bao suy ra từ bản đồ nhiệt, nên tắt Grad-CAM thì cũng không có hộp."""
    assert post_image(client, params="?gradcam=false").json()["bbox"] is None


def test_bbox_is_null_when_no_region_found(client):
    client.app_state.predictor = FakePredictor(wsol=False)
    assert post_image(client).json()["bbox"] is None


def test_model_info_reports_wsol_availability(client):
    assert client.get("/api/model-info").json()["wsol_available"] is True
    client.app_state.predictor = FakePredictor(wsol=False)
    assert client.get("/api/model-info").json()["wsol_available"] is False


def test_gradcam_can_be_disabled(client):
    body = post_image(client, params="?gradcam=false").json()
    assert body["gradcam_png_b64"] is None


def test_rejects_unsupported_content_type(client):
    r = client.post("/api/predict", files={"file": ("notes.txt", b"hello", "text/plain")})
    assert r.status_code == 422
    assert r.json()["error"]["code"] == "invalid_image"


def test_rejects_corrupt_image(client):
    r = post_image(client, data=b"this is not an image")
    assert r.status_code == 422
    assert r.json()["error"]["code"] == "invalid_image"


def test_rejects_oversized_upload(client):
    client.app_state.settings.max_upload_bytes = 1024
    r = post_image(client, data=make_image_bytes(size=(900, 900)))
    assert r.status_code == 422
    assert "MB" in r.json()["error"]["message"]


def test_missing_file_is_validation_error(client):
    r = client.post("/api/predict")
    assert r.status_code == 422
    assert r.json()["error"]["code"] == "validation_error"


def test_predict_is_503_when_model_unavailable(client):
    client.app_state.predictor = None
    client.app_state.load_error = "không tìm thấy trọng số"
    r = post_image(client)
    assert r.status_code == 503
    assert r.json()["error"]["code"] == "model_unavailable"


def test_low_confidence_is_flagged(client):
    client.app_state.predictor = FakePredictor(confidence=0.41)
    body = post_image(client).json()
    assert body["is_confident"] is False
    assert "low_confidence" in body["warnings"]


def test_rate_limit_blocks_after_quota(client):
    from app.ratelimit import SlidingWindowRateLimiter

    client.app_state.settings.rate_limit_enabled = True
    client.app_state.limiter = SlidingWindowRateLimiter(max_requests=2, window_seconds=60)

    assert post_image(client).status_code == 200
    assert post_image(client).status_code == 200
    blocked = post_image(client)
    assert blocked.status_code == 429
    assert blocked.json()["error"]["code"] == "rate_limit_exceeded"
    assert int(blocked.headers["Retry-After"]) >= 1


def test_model_info_exposes_metrics(client):
    client.app_state.metrics = {
        "test_accuracy": 0.9854, "macro_f1": 0.9848, "total_params_m": 23.5,
        "inference_ms_mean": 10.084, "inference_ms_std": 0.257, "train_time_min": 70.4,
        "test_set_size": 890, "per_class": {}, "epochs": 30,
    }
    body = client.get("/api/model-info").json()
    assert body["class_names"] == list(CLASS_NAMES)
    assert body["num_classes"] == 5
    assert body["image_size"] == 224
    assert body["metrics"]["test_accuracy"] == 0.9854
    assert body["gradcam_available"] is True


def test_model_info_works_without_metrics_file(client):
    client.app_state.metrics = None
    body = client.get("/api/model-info").json()
    assert body["metrics"] is None


def test_security_headers_present(client):
    h = client.get("/healthz").headers
    assert h["X-Content-Type-Options"] == "nosniff"
    assert h["X-Frame-Options"] == "DENY"
    assert "default-src 'self'" in h["Content-Security-Policy"]
    assert "script-src 'self'" in h["Content-Security-Policy"]


def test_docs_are_hidden_in_production(monkeypatch):
    """Ở production phải ẩn /docs, /redoc và /openapi.json để giảm bề mặt tiếp xúc.

    Phải vá `app.main.get_settings` chứ không phải `app.config.get_settings`:
    main.py đã import tên này vào namespace của nó, nên vá ở config là vá hụt.
    """
    from fastapi.testclient import TestClient

    import app.main as main_module
    from app.config import Settings

    prod = Settings(environment="production", _env_file=None)
    monkeypatch.setattr(main_module, "get_settings", lambda: prod)

    app = main_module.create_app()
    app.router.lifespan_context = _noop
    app.state.app_state = AppState(settings=prod, predictor=FakePredictor())

    with TestClient(app) as c:
        assert c.get("/docs").status_code == 404
        assert c.get("/redoc").status_code == 404
        assert c.get("/openapi.json").status_code == 404
        # Nhưng dịch vụ vẫn phải hoạt động bình thường.
        assert c.get("/healthz").status_code == 200
        assert post_image(c).status_code == 200


def test_docs_are_available_outside_production(client):
    assert client.get("/docs").status_code == 200
    assert client.get("/openapi.json").status_code == 200


from contextlib import asynccontextmanager  # noqa: E402


@asynccontextmanager
async def _noop(app):
    yield


def test_static_assets_get_fingerprinted_urls(client):
    """HTML phải trỏ tới CSS/JS kèm ?v=<hash nội dung>.

    Thiếu dấu vân tay này, trình duyệt sẽ dùng lại JS/CSS cũ sau khi deploy và
    trang hỏng theo kiểu rất khó lần ra.
    """
    import re

    html = client.get("/").text
    assert re.search(r'/static/css/app\.css\?v=[0-9a-f]{10}', html)
    assert re.search(r'/static/js/app\.js\?v=[0-9a-f]{10}', html)
    assert client.get("/").headers["Cache-Control"] == "no-cache"


def test_fingerprinted_assets_are_cached_forever(client):
    r = client.get("/static/js/app.js?v=deadbeef12")
    assert r.status_code == 200
    assert r.headers["Cache-Control"] == "public, max-age=31536000, immutable"


def test_unfingerprinted_assets_must_revalidate(client):
    r = client.get("/static/js/i18n.js")
    assert r.status_code == 200
    assert r.headers["Cache-Control"] == "no-cache"
    # ETag vẫn phải hoạt động để lần sau trả 304 cho nhẹ.
    r304 = client.get("/static/js/i18n.js", headers={"If-None-Match": r.headers["etag"]})
    assert r304.status_code == 304
    assert r304.headers["Cache-Control"] == "no-cache"
