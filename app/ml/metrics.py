"""Đọc số liệu đánh giá đã lưu từ thư mục results/ để hiển thị trên giao diện.

Số liệu là kết quả thật của quá trình huấn luyện, không tính lại lúc chạy. Thiếu
tệp thì trả về None và giao diện chỉ đơn giản không hiện phần số liệu — không
được làm sập dịch vụ vì lý do hiển thị.

Nguồn chính là `{prefix}_logs.json`: cả mô hình huấn luyện thường lẫn mô hình
chưng cất đều ghi ra tệp này, nên một đường đọc duy nhất phục vụ được cả hai.
Hai tệp chỉ khác nhau vài khoá ở phần đầu (`model_name` so với `student_model`),
phần số liệu bên dưới có cấu trúc giống hệt.
"""

from __future__ import annotations

import csv
import json
import logging
from pathlib import Path

from app.ml.labels import CLASS_NAMES

logger = logging.getLogger(__name__)


def _load_per_class(report: Path) -> dict[str, dict[str, float]]:
    """Đọc precision/recall/f1/support theo từng lớp từ báo cáo CSV."""
    per_class: dict[str, dict[str, float]] = {}
    if not report.is_file():
        return per_class
    try:
        with report.open(encoding="utf-8") as fh:
            for record in csv.DictReader(fh):
                label = (record.get("") or "").strip()
                if label in CLASS_NAMES:
                    per_class[label] = {
                        "precision": float(record["precision"]),
                        "recall": float(record["recall"]),
                        "f1_score": float(record["f1-score"]),
                        "support": float(record["support"]),
                    }
    except (OSError, csv.Error, KeyError, ValueError) as exc:
        logger.warning("Không đọc được %s: %s", report.name, exc)
    return per_class


def load_metrics(results_dir: Path, model_name: str, prefix: str) -> dict | None:
    """Số liệu của mô hình đang phục vụ.

    `model_name` là tên đầy đủ trong timm (chỉ dùng để ghi log); `prefix` là tên
    ngắn đặt cho tệp trên đĩa.
    """
    logs = results_dir / f"{prefix}_logs.json"
    if not logs.is_file():
        logger.warning("Không tìm thấy %s; bỏ qua số liệu", logs)
        return None

    try:
        data = json.loads(logs.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        logger.warning("Không đọc được %s: %s", logs.name, exc)
        return None

    try:
        inference = data.get("inference_time_ms") or {}
        params = data.get("parameters") or {}
        metrics: dict = {
            "test_accuracy": float(data["test_accuracy"]),
            "macro_f1": float(data["macro_f1"]),
            "total_params_m": float(params.get("total_M", 0.0)),
            "inference_ms_mean": float(inference.get("mean", 0.0)),
            "inference_ms_std": float(inference.get("std", 0.0)),
            # "70.38 mins" -> 70.38
            "train_time_min": float(str(data.get("training_time", "0")).split()[0]),
            "test_set_size": 0,
            "per_class": {},
        }
    except (KeyError, ValueError, IndexError) as exc:
        logger.warning("%s thiếu trường bắt buộc: %s", logs.name, exc)
        return None

    metrics["per_class"] = _load_per_class(results_dir / f"{prefix}_report.csv")
    if metrics["per_class"]:
        metrics["test_set_size"] = int(sum(v["support"] for v in metrics["per_class"].values()))

    history = data.get("history") or {}
    if isinstance(history.get("train_loss"), list):
        metrics["epochs"] = len(history["train_loss"])

    # Mô hình chưng cất ghi thêm tên giáo viên; giao diện dùng để nói rõ xuất xứ.
    teacher = data.get("teacher_model")
    if teacher:
        metrics["distilled_from"] = teacher

    logger.info(
        "Đã nạp số liệu đánh giá",
        extra={"model": model_name, "prefix": prefix, "accuracy": metrics["test_accuracy"]},
    )
    return metrics
