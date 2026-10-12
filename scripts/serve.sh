#!/usr/bin/env bash
# Chạy server ở chế độ production (không reload, nhiều worker).
#
# Mỗi worker nạp một bản mô hình riêng (~500MB), nên số worker bị giới hạn bởi
# RAM chứ không phải số core. Trên máy 4GB thì 2 worker là hợp lý.
set -euo pipefail
cd "$(dirname "$0")/.."

export ENVIRONMENT="${ENVIRONMENT:-production}"
export LOG_FORMAT="${LOG_FORMAT:-json}"
# Nhiều worker mà mỗi worker lại dùng hết core thì chúng tranh CPU của nhau.
export TORCH_NUM_THREADS="${TORCH_NUM_THREADS:-1}"

exec .venv/bin/python -m uvicorn app.main:app \
  --host "${HOST:-0.0.0.0}" \
  --port "${PORT:-8000}" \
  --workers "${WORKERS:-2}" \
  --timeout-keep-alive 30
