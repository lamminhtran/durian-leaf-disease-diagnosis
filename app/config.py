"""Cấu hình ứng dụng — đọc từ biến môi trường / tệp .env.

Mọi hằng số ảnh hưởng tới hành vi production đều phải đi qua đây, không hard-code
rải rác trong code, để triển khai được nhiều môi trường từ cùng một image.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # --- Thông tin dịch vụ ---
    app_name: str = "Durian Leaf Disease Diagnosis"
    app_version: str = "1.0.0"
    environment: str = Field(default="production")
    debug: bool = False

    # --- Mô hình ---
    # Kiến trúc backbone timm; phải khớp với trọng số đã huấn luyện.
    backbone_name: str = "caformer_s18.sail_in22k_ft_in1k"
    model_path: Path = BASE_DIR / "models" / "caformer_s18_best.pth"
    # Thư mục chứa số liệu đánh giá đã lưu, và tiền tố tên tệp trong đó.
    # Tách riêng khỏi model_path vì trọng số và kết quả không nằm cùng chỗ.
    results_dir: Path = BASE_DIR / "results"
    metrics_prefix: str = "caformer_s18"
    # 'auto' -> cuda nếu có, ngược lại cpu. Có thể ép 'cpu' / 'cuda' / 'mps'.
    device: str = "auto"
    image_size: int = 224
    # Số luồng torch dùng cho mỗi tiến trình. 0 = để torch tự quyết định.
    torch_num_threads: int = 0

    # --- Giới hạn đầu vào ---
    # Ảnh lớn hơn ngưỡng này bị từ chối trước khi giải mã, tránh tốn RAM.
    max_upload_bytes: int = 10 * 1024 * 1024  # 10 MB
    # Chặn "decompression bomb": ảnh có tổng số điểm ảnh vượt ngưỡng bị từ chối.
    max_image_pixels: int = 50_000_000

    # --- Grad-CAM ---
    enable_gradcam: bool = True
    gradcam_alpha: float = 0.5
    # Lớp đích của Grad-CAM, dạng đường dẫn thuộc tính tính từ `backbone`.
    # Để trống thì tự dò (xem DurianPredictor._resolve_target_layer).
    gradcam_target_layer: str = ""
    # Bật/tắt khoanh vùng WSOL suy ra từ bản đồ nhiệt.
    enable_wsol: bool = True

    # --- Trợ lý AI qua OpenRouter ---
    # Để trống thì toàn bộ tính năng trò chuyện tự tắt; phần còn lại vẫn chạy.
    openrouter_api_key: str | None = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "google/gemini-2.5-flash"
    llm_timeout_seconds: float = 60.0
    llm_max_tokens: int = 700
    llm_temperature: float = 0.3
    # Số lượt hội thoại gần nhất được gửi lại cho LLM (kiểm soát chi phí token).
    llm_max_history_messages: int = 12
    # Gửi kèm làm HTTP-Referer để OpenRouter thống kê theo ứng dụng.
    public_url: str | None = None

    # --- Giới hạn tần suất (in-memory, cho mỗi tiến trình) ---
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 30
    rate_limit_window_seconds: int = 60
    # Hạn mức riêng cho chat: mỗi lượt gọi LLM đều tốn tiền, nên siết chặt hơn
    # so với endpoint chẩn đoán vốn chỉ tốn CPU của chính máy chủ.
    chat_rate_limit_requests: int = 12
    chat_rate_limit_window_seconds: int = 60

    # --- HTTP ---
    # Danh sách origin được phép, phân tách bằng dấu phẩy. '*' chỉ nên dùng khi dev.
    cors_allow_origins: str = "*"
    # Số lớp proxy tin cậy phía trước (nginx...) để lấy đúng IP client từ X-Forwarded-For.
    trusted_proxy_count: int = 0

    # --- Log ---
    log_level: str = "INFO"
    # 'json' cho môi trường thu log tập trung, 'console' cho lúc phát triển.
    log_format: str = "json"

    @field_validator("model_path", "results_dir")
    @classmethod
    def _resolve_model_path(cls, v: Path) -> Path:
        """Neo đường dẫn tương đối vào gốc dự án, không vào thư mục làm việc.

        Nếu để phụ thuộc CWD thì dịch vụ chạy được khi gọi từ gốc dự án nhưng chết
        khi chạy qua systemd hoặc từ thư mục khác — một lỗi chỉ xuất hiện lúc deploy.
        """
        return v if v.is_absolute() else (BASE_DIR / v)

    @field_validator("environment")
    @classmethod
    def _check_env(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"environment phải thuộc {sorted(allowed)}")
        return v

    @property
    def cors_origins(self) -> list[str]:
        raw = self.cors_allow_origins.strip()
        if raw == "*":
            return ["*"]
        return [o.strip() for o in raw.split(",") if o.strip()]

    @property
    def llm_configured(self) -> bool:
        return bool(self.openrouter_api_key)

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
