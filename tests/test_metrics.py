"""Test đọc số liệu đánh giá từ thư mục results/."""

from __future__ import annotations

import json

import pytest

from app.ml.metrics import load_metrics

TEACHER = "caformer_s18.sail_in22k_ft_in1k"


def write_logs(d, prefix, **over):
    payload = {
        "test_accuracy": 0.9854,
        "macro_f1": 0.9848,
        "parameters": {"total_M": 23.5},
        "inference_time_ms": {"mean": 10.084, "std": 0.257},
        "training_time": "70.38 mins",
        "history": {"train_loss": [0.1] * 30},
    }
    payload.update(over)
    (d / f"{prefix}_logs.json").write_text(json.dumps(payload), encoding="utf-8")


def test_returns_none_when_logs_missing(tmp_path):
    assert load_metrics(tmp_path, TEACHER, "caformer_s18") is None


def test_returns_none_on_malformed_logs(tmp_path):
    (tmp_path / "x_logs.json").write_text("{khong-phai-json}", encoding="utf-8")
    assert load_metrics(tmp_path, TEACHER, "x") is None


def test_returns_none_when_required_field_missing(tmp_path):
    (tmp_path / "x_logs.json").write_text(json.dumps({"macro_f1": 0.9}), encoding="utf-8")
    assert load_metrics(tmp_path, TEACHER, "x") is None


def test_parses_training_time_string(tmp_path):
    write_logs(tmp_path, "x", training_time="70.38 mins")
    assert load_metrics(tmp_path, TEACHER, "x")["train_time_min"] == 70.38


def test_works_without_report_csv(tmp_path):
    """Thiếu báo cáo theo lớp thì vẫn trả số liệu tổng, không được sập."""
    write_logs(tmp_path, "x")
    m = load_metrics(tmp_path, TEACHER, "x")
    assert m["per_class"] == {} and m["test_set_size"] == 0
    assert m["epochs"] == 30


def test_distilled_from_only_when_teacher_recorded(tmp_path):
    write_logs(tmp_path, "a")
    assert "distilled_from" not in load_metrics(tmp_path, TEACHER, "a")
    write_logs(tmp_path, "b", teacher_model=TEACHER)
    assert load_metrics(tmp_path, TEACHER, "b")["distilled_from"] == TEACHER


# --- Trên tệp kết quả thật trong kho ---

def real_results():
    from app.config import BASE_DIR

    d = BASE_DIR / "results"
    if not (d / "caformer_s18_logs.json").is_file():
        pytest.skip("không có thư mục results/ trong môi trường này")
    return d


def test_teacher_metrics_from_real_files():
    m = load_metrics(real_results(), TEACHER, "caformer_s18")
    assert abs(m["test_accuracy"] - 0.9853932584269663) < 1e-9
    assert abs(m["macro_f1"] - 0.9847537271630864) < 1e-9
    assert m["test_set_size"] == 890
    assert len(m["per_class"]) == 5
    assert m["epochs"] == 30
    assert "distilled_from" not in m


def test_student_metrics_from_real_files():
    d = real_results()
    if not (d / "mobilenetv3_small_kd_logs.json").is_file():
        pytest.skip("không có số liệu student")
    m = load_metrics(d, "mobilenetv3_small_100", "mobilenetv3_small_kd")
    assert abs(m["test_accuracy"] - 0.9674157303370786) < 1e-9
    assert m["total_params_m"] == 2.05
    assert m["test_set_size"] == 890
    assert m["distilled_from"] == TEACHER
