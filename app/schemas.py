"""Hợp đồng dữ liệu của API (Pydantic v2). Đây là phần công khai, đổi là breaking change."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Lang = Literal["vi", "en"]


class ClassScoreOut(BaseModel):
    class_name: str = Field(description="Mã lớp, trùng tên thư mục khi huấn luyện")
    label: str = Field(description="Tên bệnh đã bản địa hoá theo tham số lang")
    probability: float = Field(ge=0.0, le=1.0, description="Xác suất softmax")


class DiseaseInfoOut(BaseModel):
    class_name: str
    name: str
    severity: Literal["none", "moderate", "high"]
    pathogen: str | None = Field(description="Tên khoa học tác nhân, null nếu lá khoẻ")
    pathogen_label: str
    summary: str
    symptoms: list[str]
    actions: list[str]


class BoundingBoxOut(BaseModel):
    """Khung bao WSOL, toạ độ chuẩn hoá [0,1] so với chiều rộng/cao của ảnh.

    Dùng toạ độ tương đối để client vẽ lại được ở bất kỳ kích thước hiển thị nào.
    Khung này suy ra từ bản đồ Grad-CAM chứ không từ nhãn vị trí — mô hình chỉ
    được huấn luyện bằng nhãn mức ảnh.
    """

    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)
    width: float = Field(gt=0.0, le=1.0)
    height: float = Field(gt=0.0, le=1.0)
    area_ratio: float = Field(ge=0.0, le=1.0, description="Tỉ lệ diện tích vùng nóng trên toàn ảnh")


class PredictionOut(BaseModel):
    request_id: str
    predicted_class: str
    confidence: float = Field(ge=0.0, le=1.0)
    is_healthy: bool
    is_confident: bool = Field(
        description="False khi độ tin cậy dưới ngưỡng; kết quả cần người kiểm tra lại"
    )
    scores: list[ClassScoreOut] = Field(description="Xác suất của cả 5 lớp, giảm dần")
    info: DiseaseInfoOut
    inference_ms: float
    gradcam_png_b64: str | None = Field(
        default=None, description="Ảnh PNG phủ bản đồ nhiệt, mã hoá base64"
    )
    bbox: BoundingBoxOut | None = Field(
        default=None, description="Khung bao WSOL; null khi không có vùng nào đủ lớn"
    )
    warnings: list[str] = Field(default_factory=list)
    model_name: str
    disclaimer: str


class ModelMetricsOut(BaseModel):
    test_accuracy: float
    macro_f1: float
    total_params_m: float
    inference_ms_mean: float
    inference_ms_std: float
    train_time_min: float
    test_set_size: int
    per_class: dict[str, dict[str, float]]
    epochs: int | None = None
    distilled_from: str | None = Field(
        default=None,
        description="Tên mô hình giáo viên, nếu đây là mô hình chưng cất tri thức",
    )


class ModelInfoOut(BaseModel):
    model_name: str
    backbone: str
    num_classes: int
    class_names: list[str]
    image_size: int
    device: str
    gradcam_available: bool
    wsol_available: bool
    chat_available: bool
    low_confidence_threshold: float
    metrics: ModelMetricsOut | None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatIn(BaseModel):
    """Yêu cầu trò chuyện. Server không lưu trạng thái: lịch sử do client giữ."""

    message: str | None = Field(
        default=None,
        max_length=2000,
        description="Câu hỏi của người dùng. Bỏ trống để yêu cầu diễn giải kết quả lần đầu.",
    )
    predicted_class: str = Field(description="Mã lớp mô hình đã chẩn đoán")
    confidence: float = Field(ge=0.0, le=1.0)
    history: list[ChatMessage] = Field(default_factory=list, max_length=40)
    lang: Lang = "vi"


class HealthOut(BaseModel):
    status: Literal["ok"]
    version: str
    environment: str


class ReadyOut(BaseModel):
    status: Literal["ready", "not_ready"]
    model_loaded: bool
    device: str | None = None
    detail: str | None = None
