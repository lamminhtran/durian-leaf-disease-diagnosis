"""Trạng thái dùng chung toàn ứng dụng và các dependency của FastAPI."""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import Request

from app.config import Settings
from app.errors import ServiceUnavailableError
from app.genai.client import OpenRouterClient
from app.ml.predictor import DurianPredictor
from app.ratelimit import SlidingWindowRateLimiter


@dataclass
class AppState:
    """Đối tượng sống suốt vòng đời tiến trình, gắn vào app.state."""

    settings: Settings
    predictor: DurianPredictor | None = None
    load_error: str | None = None
    metrics: dict | None = None
    limiter: SlidingWindowRateLimiter | None = None
    llm: OpenRouterClient | None = None
    chat_limiter: SlidingWindowRateLimiter | None = None

    @property
    def is_ready(self) -> bool:
        return self.predictor is not None


def get_state(request: Request) -> AppState:
    return request.app.state.app_state


def get_settings_dep(request: Request) -> Settings:
    return request.app.state.app_state.settings


def get_predictor(request: Request) -> DurianPredictor:
    """Trả về predictor, hoặc 503 nếu mô hình chưa nạp được.

    Dịch vụ vẫn khởi động được khi nạp mô hình thất bại, để /healthz và trang web
    còn phản hồi và nêu rõ nguyên nhân thay vì container chết trong vòng lặp restart.
    """
    state: AppState = request.app.state.app_state
    if state.predictor is None:
        detail = state.load_error or "Mô hình chưa được nạp"
        raise ServiceUnavailableError(f"Dịch vụ chưa sẵn sàng: {detail}")
    return state.predictor


def client_ip(request: Request, trusted_proxy_count: int = 0) -> str:
    """Lấy IP client, có tính tới proxy phía trước.

    Chỉ đọc X-Forwarded-For khi đã khai báo số lớp proxy tin cậy: nếu tin tưởng vô
    điều kiện, client có thể tự đặt header này để vượt giới hạn tần suất.
    """
    if trusted_proxy_count > 0:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            parts = [p.strip() for p in forwarded.split(",") if p.strip()]
            # Lấy phần tử cách phải đúng số lớp proxy ta kiểm soát.
            index = len(parts) - trusted_proxy_count
            if 0 <= index < len(parts):
                return parts[index]
            if parts:
                return parts[0]
    return request.client.host if request.client else "unknown"
