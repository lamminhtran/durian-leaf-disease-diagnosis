"""Điểm khởi động ứng dụng FastAPI.

Mô hình được nạp một lần duy nhất trong lifespan, không nạp theo từng request:
nạp CAFormer-S18 mất vài giây và tốn ~400MB RAM, làm việc đó mỗi request thì dịch
vụ không dùng được. Nếu nạp thất bại, ứng dụng vẫn khởi động để /healthz và trang
web trả lời được kèm lý do, thay vì để container chết trong vòng lặp restart.
"""

from __future__ import annotations

import logging
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import Response
from starlette.types import Scope

from app.config import BASE_DIR, get_settings
from app.deps import AppState
from app.errors import register_exception_handlers
from app.genai.client import OpenRouterClient
from app.logging_config import configure_logging
from app.ml.metrics import load_metrics
from app.ml.predictor import DurianPredictor
from app.ratelimit import SlidingWindowRateLimiter
from app.routes import chat, health, predict

logger = logging.getLogger(__name__)

WEB_DIR = BASE_DIR / "web"


class VersionedStaticFiles(StaticFiles):
    """Tệp tĩnh với chính sách cache phụ thuộc có dấu vân tay phiên bản hay không.

    Vì sao cần: StaticFiles mặc định chỉ gửi ETag/Last-Modified mà KHÔNG gửi
    Cache-Control. Thiếu header đó, trình duyệt được phép tự suy đoán thời gian
    cache và dùng lại bản cũ mà không hỏi lại server. Hậu quả là sau khi deploy,
    người dùng nhận HTML mới nhưng JS/CSS cũ — trang hỏng theo kiểu rất khó hiểu.

    Cách xử lý:
      - URL có '?v=<hash nội dung>'  -> cache vĩnh viễn (nội dung đổi thì hash đổi).
      - URL không có dấu vân tay     -> 'no-cache', buộc kiểm lại bằng ETag mỗi lần
        (phản hồi 304 rất nhẹ, nhưng không bao giờ phục vụ nội dung cũ).
    """

    async def get_response(self, path: str, scope: Scope) -> Response:
        # Override ở get_response chứ không phải file_response: nó bao cả nhánh trả
        # 304 Not Modified, và chữ ký ổn định giữa các phiên bản Starlette.
        response = await super().get_response(path, scope)
        has_fingerprint = b"v=" in scope.get("query_string", b"")
        response.headers["Cache-Control"] = (
            "public, max-age=31536000, immutable" if has_fingerprint else "no-cache"
        )
        return response


def _asset_fingerprints() -> dict[str, str]:
    """Hash ngắn theo nội dung cho các tệp tĩnh được nhúng thẳng vào HTML."""
    import hashlib

    prints: dict[str, str] = {}
    for rel in ("static/css/app.css", "static/js/app.js"):
        path = WEB_DIR / rel
        if path.is_file():
            prints[rel] = hashlib.sha256(path.read_bytes()).hexdigest()[:10]
    return prints


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings.log_level, settings.log_format)

    # Giới hạn số luồng torch: mặc định torch chiếm hết số core, khi chạy nhiều
    # worker uvicorn thì các worker tranh CPU và chậm hơn là chạy một luồng mỗi worker.
    if settings.torch_num_threads > 0:
        torch.set_num_threads(settings.torch_num_threads)

    state = AppState(settings=settings)
    if settings.rate_limit_enabled:
        state.limiter = SlidingWindowRateLimiter(
            settings.rate_limit_requests, settings.rate_limit_window_seconds
        )
        state.chat_limiter = SlidingWindowRateLimiter(
            settings.chat_rate_limit_requests, settings.chat_rate_limit_window_seconds
        )

    # Trợ lý AI là tuỳ chọn: thiếu khoá thì phần còn lại của dịch vụ vẫn chạy
    # bình thường, giao diện chỉ đơn giản không hiện khung trò chuyện.
    state.llm = OpenRouterClient(
        api_key=settings.openrouter_api_key,
        model=settings.openrouter_model,
        base_url=settings.openrouter_base_url,
        timeout=settings.llm_timeout_seconds,
        max_tokens=settings.llm_max_tokens,
        temperature=settings.llm_temperature,
        referer=settings.public_url,
    )
    logger.info(
        "Trợ lý AI",
        extra={
            "configured": state.llm.configured,
            "model": settings.openrouter_model if state.llm.configured else None,
        },
    )

    logger.info(
        "Đang khởi động dịch vụ",
        extra={
            "version": settings.app_version,
            "environment": settings.environment,
            "backbone": settings.backbone_name,
        },
    )

    started = time.perf_counter()
    try:
        state.predictor = DurianPredictor(
            backbone_name=settings.backbone_name,
            weights_path=Path(settings.model_path),
            device_preference=settings.device,
            image_size=settings.image_size,
            enable_gradcam=settings.enable_gradcam,
            gradcam_alpha=settings.gradcam_alpha,
            max_image_pixels=settings.max_image_pixels,
            gradcam_target_layer=settings.gradcam_target_layer,
            enable_wsol=settings.enable_wsol,
        )
        logger.info(
            "Mô hình sẵn sàng",
            extra={
                "load_seconds": round(time.perf_counter() - started, 2),
                "device": str(state.predictor.device),
                "gradcam": state.predictor.gradcam_available,
            },
        )
    except Exception as exc:
        state.load_error = str(exc)
        logger.exception("Nạp mô hình thất bại — dịch vụ chạy ở trạng thái chưa sẵn sàng")

    state.metrics = load_metrics(
        Path(settings.results_dir), settings.backbone_name, settings.metrics_prefix
    )

    # Cảnh báo khi METRICS_PREFIX trỏ nhầm sang mô hình khác.
    #
    # Đây là lỗi cấu hình âm thầm nguy hiểm: đổi BACKBONE_NAME và MODEL_PATH mà
    # quên METRICS_PREFIX thì dịch vụ vẫn chạy ngon lành, chỉ có điều giao diện
    # khoe số liệu của mô hình KHÁC. So số tham số là cách phát hiện rẻ nhất.
    if state.metrics and state.predictor is not None:
        actual_m = sum(p.numel() for p in state.predictor._model.parameters()) / 1e6
        claimed_m = state.metrics.get("total_params_m", 0.0)
        if claimed_m and abs(actual_m - claimed_m) > 0.5:
            logger.warning(
                "METRICS_PREFIX có vẻ trỏ nhầm mô hình: số liệu đã lưu ghi "
                "%.2fM tham số nhưng mô hình đang nạp có %.2fM. "
                "Kiểm tra lại BACKBONE_NAME / MODEL_PATH / METRICS_PREFIX trong .env.",
                claimed_m, actual_m,
                extra={"metrics_prefix": settings.metrics_prefix,
                       "backbone": settings.backbone_name},
            )

    app.state.app_state = state
    try:
        yield
    finally:
        if state.llm is not None:
            await state.llm.aclose()
        logger.info("Đang tắt dịch vụ")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "API chẩn đoán bệnh trên lá sầu riêng bằng CAFormer-S18. "
            "Tải lên ảnh lá, nhận nhãn bệnh, xác suất 5 lớp và bản đồ nhiệt Grad-CAM."
        ),
        lifespan=lifespan,
        # Ẩn tài liệu tương tác ở production để giảm bề mặt tiếp xúc.
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None if settings.is_production else "/redoc",
        openapi_url=None if settings.is_production else "/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    # Nén phản hồi JSON: ảnh Grad-CAM base64 chiếm phần lớn kích thước và nén rất tốt.
    app.add_middleware(GZipMiddleware, minimum_size=1024)

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        """Gắn request id cho mọi request để đối chiếu log với lỗi người dùng báo."""
        request_id = request.headers.get("x-request-id") or uuid.uuid4().hex[:16]
        request.state.request_id = request_id
        started = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            # Handler toàn cục sẽ dựng phản hồi; ở đây chỉ ghi lại thời gian và re-raise.
            logger.exception(
                "Request thất bại",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "duration_ms": round((time.perf_counter() - started) * 1000, 2),
                },
            )
            raise
        response.headers["X-Request-ID"] = request_id
        duration_ms = round((time.perf_counter() - started) * 1000, 2)
        response.headers["X-Process-Time-Ms"] = str(duration_ms)
        if request.url.path.startswith("/api"):
            logger.info(
                "Request",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status": response.status_code,
                    "duration_ms": duration_ms,
                },
            )
        return response

    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        """Các header bảo mật cơ bản.

        CSP cho phép 'unsafe-inline' cho style vì giao diện có vài style tính động;
        script thì chỉ cho phép tệp cùng origin (không dùng CDN nào).
        """
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data: blob:; "
            "style-src 'self' 'unsafe-inline'; script-src 'self'; "
            "connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
        )
        return response

    register_exception_handlers(app)
    app.include_router(health.router)
    app.include_router(predict.router)
    app.include_router(chat.router)

    # --- Giao diện web ---
    static_dir = WEB_DIR / "static"
    if static_dir.is_dir():
        app.mount("/static", VersionedStaticFiles(directory=static_dir), name="static")

    @app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
    async def index():
        index_file = WEB_DIR / "index.html"
        if not index_file.is_file():
            return JSONResponse(
                status_code=404,
                content={"error": {"code": "ui_missing", "message": "Không tìm thấy web/index.html"}},
            )

        html = index_file.read_text(encoding="utf-8")
        # Gắn dấu vân tay nội dung vào URL của CSS/JS. HTML luôn tải mới, nên URL
        # mới có hiệu lực ngay sau khi deploy — không còn cảnh JS cũ lẫn HTML mới.
        for rel, digest in _asset_fingerprints().items():
            html = html.replace(f'"/{rel}"', f'"/{rel}?v={digest}"')

        # Không cache HTML để người dùng luôn nhận bản mới sau khi deploy.
        return HTMLResponse(html, headers={"Cache-Control": "no-cache"})

    @app.get("/favicon.ico", include_in_schema=False)
    async def favicon():
        # Trình duyệt cũ vẫn dò /favicon.ico dù HTML đã khai báo <link rel="icon">.
        icon = WEB_DIR / "static" / "img" / "favicon-32.png"
        if icon.is_file():
            return FileResponse(icon, media_type="image/png")
        return JSONResponse(status_code=404, content={})

    return app


app = create_app()
