"""Lỗi cấp ứng dụng và bộ chuyển lỗi thành phản hồi JSON thống nhất."""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.ml.predictor import InvalidImageError

logger = logging.getLogger(__name__)

# Dùng số trực tiếp: tên hằng của Starlette cho mã này đã đổi giữa các phiên bản.
HTTP_422 = 422


class ServiceUnavailableError(RuntimeError):
    """Mô hình chưa sẵn sàng (đang nạp hoặc nạp thất bại)."""


class RateLimitExceeded(RuntimeError):
    def __init__(self, retry_after: int) -> None:
        super().__init__("Vượt giới hạn số request")
        self.retry_after = retry_after


def _error(
    request: Request, status_code: int, code: str, message: str, **extra
) -> JSONResponse:
    """Mọi lỗi đều trả về cùng một hình dạng JSON để client xử lý nhất quán."""
    body = {
        "error": {
            "code": code,
            "message": message,
            "request_id": getattr(request.state, "request_id", None),
            **extra,
        }
    }
    return JSONResponse(status_code=status_code, content=body)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(InvalidImageError)
    async def _invalid_image(request: Request, exc: InvalidImageError) -> JSONResponse:
        return _error(request, HTTP_422, "invalid_image", str(exc))

    @app.exception_handler(ServiceUnavailableError)
    async def _unavailable(request: Request, exc: ServiceUnavailableError) -> JSONResponse:
        return _error(request, status.HTTP_503_SERVICE_UNAVAILABLE, "model_unavailable", str(exc))

    @app.exception_handler(RateLimitExceeded)
    async def _rate_limited(request: Request, exc: RateLimitExceeded) -> JSONResponse:
        response = _error(
            request,
            status.HTTP_429_TOO_MANY_REQUESTS,
            "rate_limit_exceeded",
            "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
            retry_after=exc.retry_after,
        )
        response.headers["Retry-After"] = str(exc.retry_after)
        return response

    @app.exception_handler(RequestValidationError)
    async def _validation(request: Request, exc: RequestValidationError) -> JSONResponse:
        return _error(
            request,
            HTTP_422,
            "validation_error",
            "Dữ liệu gửi lên không hợp lệ.",
            details=exc.errors(),
        )

    @app.exception_handler(StarletteHTTPException)
    async def _http(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return _error(request, exc.status_code, "http_error", str(exc.detail))

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception) -> JSONResponse:
        # Ghi log đầy đủ phía server nhưng không rò rỉ chi tiết nội bộ ra client.
        logger.exception(
            "Lỗi không mong đợi",
            extra={"path": request.url.path, "request_id": getattr(request.state, "request_id", None)},
        )
        return _error(
            request,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "internal_error",
            "Đã xảy ra lỗi nội bộ. Vui lòng thử lại.",
        )
