# syntax=docker/dockerfile:1

# =============================================================================
# Giai đoạn build: dựng virtualenv riêng rồi chỉ chép venv sang image chạy, nhờ
# vậy image cuối không mang theo trình biên dịch và cache của pip.
# =============================================================================
FROM python:3.12-slim AS builder

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /build

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

# Cài bản torch CHỈ CPU: bản mặc định kéo theo toàn bộ runtime CUDA (~2.5GB) mà
# máy chủ không có GPU thì không dùng tới. Riêng thay đổi này giảm image vài GB.
# --retries/--timeout: wheel của torch nặng vài trăm MB, mạng chập chờn là pip
# bỏ cuộc giữa chừng và hỏng cả lần build. Cho phép thử lại thay vì fail ngay.
RUN pip install --no-cache-dir \
        --retries 10 \
        --timeout 120 \
        --extra-index-url https://download.pytorch.org/whl/cpu \
        -r requirements.txt

# =============================================================================
# Giai đoạn chạy
# =============================================================================
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    # timm/HuggingFace ghi cache vào HOME; trỏ vào thư mục ghi được của app user.
    HF_HOME=/home/app/.cache/huggingface \
    # Mỗi worker một luồng torch: khi chạy nhiều worker, để torch chiếm hết core
    # sẽ khiến các worker tranh CPU và tổng thông lượng còn thấp hơn.
    TORCH_NUM_THREADS=1

# curl cho HEALTHCHECK; libgomp1 là runtime OpenMP mà torch cần.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Chạy bằng người dùng thường, không phải root.
RUN useradd --create-home --uid 10001 app

COPY --from=builder /opt/venv /opt/venv

WORKDIR /app

COPY --chown=app:app app/ ./app/
COPY --chown=app:app web/ ./web/

# Trọng số đang phục vụ và các tệp số liệu hiển thị trên giao diện.
COPY --chown=app:app models/caformer_s18_best.pth ./models/
COPY --chown=app:app results/ ./results/

USER app

EXPOSE 8000

# /readyz chỉ trả 200 khi mô hình đã nạp xong; start-period cho thời gian nạp.
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8000/readyz || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
