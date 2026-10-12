"""Đọc kết quả đánh giá đã lưu từ thư mục results/ để hiển thị trên giao diện.

Các số liệu này là kết quả thật của quá trình huấn luyện/đánh giá, không tính lại
lúc chạy. Nếu thiếu tệp thì trả về None và giao diện chỉ đơn giản không hiện phần
số liệu — không được làm sập dịch vụ vì lý do hiển thị.
"""

from __future__ import annotations

import csv
import json
import logging
from pathlib import Path

from app.ml.labels import CLASS_NAMES

logger = logging.getLogger(__name__)


def _parse_percent(value: str) -> float:
    return float(value.strip().rstrip("%")) / 100.0


def _parse_mean_std(value: str) -> tuple[float, float]:
    """Phân tích chuỗi dạng '10.084 ± 0.257' thành (mean, std)."""
    for sep in ("±", "+/-"):
        if sep in value:
            mean, std = value.split(sep, 1)
            return float(mean.strip()), float(std.strip())
    return float(value.strip()), 0.0


def load_metrics(results_dir: Path, model_name: str, prefix: str) -> dict | None:
    summary = results_dir / "summary_table.csv"
    # `model_name` là tên đầy đủ trong timm, dùng để dò đúng dòng trong
    # summary_table.csv; `prefix` là tên ngắn đặt cho tệp trên đĩa.
    report = results_dir / f"{prefix}_report.csv"
    logs = results_dir / f"{prefix}_logs.json"

    if not summary.is_file():
        logger.warning("Không tìm thấy summary_table.csv; bỏ qua số liệu", extra={"path": str(summary)})
        return None

    row = None
    try:
        with summary.open(encoding="utf-8") as fh:
            for record in csv.DictReader(fh):
                if record.get("Model", "").strip() == model_name:
                    row = record
                    break
    except (OSError, csv.Error) as exc:
        logger.warning("Không đọc được summary_table.csv: %s", exc)
        return None

    if row is None:
        logger.warning("Không có dòng nào cho %r trong summary_table.csv", model_name)
        return None

    try:
        mean_ms, std_ms = _parse_mean_std(row["Inference (ms)"])
        metrics: dict = {
            "test_accuracy": _parse_percent(row["Test Accuracy"]),
            "macro_f1": float(row["Macro F1"]),
            "total_params_m": float(row["Total Params (M)"]),
            "inference_ms_mean": mean_ms,
            "inference_ms_std": std_ms,
            "train_time_min": float(row["Train Time (min)"]),
            "test_set_size": 0,
            "per_class": {},
        }
    except (KeyError, ValueError) as exc:
        logger.warning("summary_table.csv sai định dạng: %s", exc)
        return None

    # Báo cáo chi tiết theo lớp (precision/recall/f1/support).
    if report.is_file():
        try:
            with report.open(encoding="utf-8") as fh:
                for record in csv.DictReader(fh):
                    label = (record.get("") or "").strip()
                    if label in CLASS_NAMES:
                        metrics["per_class"][label] = {
                            "precision": float(record["precision"]),
                            "recall": float(record["recall"]),
                            "f1_score": float(record["f1-score"]),
                            "support": float(record["support"]),
                        }
            metrics["test_set_size"] = int(
                sum(v["support"] for v in metrics["per_class"].values())
            )
        except (OSError, csv.Error, KeyError, ValueError) as exc:
            logger.warning("Không đọc được %s: %s", report.name, exc)

    # Số epoch lấy từ lịch sử huấn luyện, dùng để ghi chú trên giao diện.
    if logs.is_file():
        try:
            data = json.loads(logs.read_text(encoding="utf-8"))
            history = data.get("history", {})
            if isinstance(history.get("train_loss"), list):
                metrics["epochs"] = len(history["train_loss"])
        except (OSError, json.JSONDecodeError) as exc:
            logger.warning("Không đọc được %s: %s", logs.name, exc)

    return metrics
