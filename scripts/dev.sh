#!/usr/bin/env bash
# Chạy server ở chế độ phát triển, tự nạp lại khi sửa mã.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -d .venv ]]; then
  echo "Chưa có .venv. Chạy: make setup" >&2
  exit 1
fi

export ENVIRONMENT="${ENVIRONMENT:-development}"
export LOG_FORMAT="${LOG_FORMAT:-console}"

exec .venv/bin/python -m uvicorn app.main:app \
  --host "${HOST:-127.0.0.1}" \
  --port "${PORT:-8000}" \
  --reload \
  --reload-dir app \
  --reload-dir web
