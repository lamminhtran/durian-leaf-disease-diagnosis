# Lệnh tắt cho các thao tác hay dùng. Chạy `make` để xem danh sách.
.DEFAULT_GOAL := help
.PHONY: help setup dev serve test test-all lint fmt eval docker docker-run clean

PY := .venv/bin/python
DATA ?= /Users/kiettran/Documents/graduation_thesis/Dataset/DLD_FinalDataset_224_spit/test

help:  ## Hiện danh sách lệnh
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup:  ## Tạo .venv và cài phụ thuộc (gồm cả gói cho phát triển)
	python3 -m venv .venv
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements-dev.txt
	@test -f .env || cp .env.example .env
	@echo "Xong. Chạy: make dev"

dev:  ## Chạy server phát triển (tự nạp lại khi sửa mã)
	./scripts/dev.sh

serve:  ## Chạy server kiểu production
	./scripts/serve.sh

test:  ## Chạy test nhanh (không cần tệp trọng số)
	$(PY) -m pytest -m "not integration"

test-all:  ## Chạy toàn bộ test, gồm cả test cần mô hình thật
	$(PY) -m pytest

lint:  ## Kiểm tra style
	$(PY) -m ruff check app tests scripts

fmt:  ## Tự sửa style
	$(PY) -m ruff check --fix app tests scripts
	$(PY) -m ruff format app tests scripts

eval:  ## Đánh giá lại mô hình trên tập test (DATA=/đường/dẫn)
	$(PY) scripts/evaluate.py --data-dir "$(DATA)"

docker:  ## Build image Docker
	docker build -t durian-leaf-diagnosis:latest .

docker-run:  ## Chạy bằng docker compose
	docker compose up --build

clean:  ## Xoá tệp tạm
	find . -type d -name __pycache__ -prune -exec rm -rf {} +
	rm -rf .pytest_cache .ruff_cache
