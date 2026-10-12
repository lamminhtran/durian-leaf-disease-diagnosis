"""Test đọc số liệu từ thư mục results/."""

from __future__ import annotations

from app.ml.metrics import _parse_mean_std, _parse_percent, load_metrics

MODEL = "caformer_s18.sail_in22k_ft_in1k"


def test_parse_helpers():
    assert _parse_percent("98.54%") == 0.9854
    assert _parse_mean_std("10.084 ± 0.257") == (10.084, 0.257)
    assert _parse_mean_std("5.5") == (5.5, 0.0)


def test_returns_none_when_directory_missing(tmp_path):
    assert load_metrics(tmp_path / "nope", MODEL, "caformer_s18") is None


def test_returns_none_for_unknown_model(tmp_path):
    (tmp_path / "summary_table.csv").write_text(
        "Model,Total Params (M),Trainable (M),Test Accuracy,Macro F1,Inference (ms),Train Time (min)\n"
        "other_model,1.0,1.0,90.00%,0.9,1.0 ± 0.1,5.0\n",
        encoding="utf-8",
    )
    assert load_metrics(tmp_path, MODEL, "caformer_s18") is None


def test_parses_real_results_directory():
    """Chạy trên tệp kết quả thật trong kho, nếu có."""
    from app.config import BASE_DIR

    results = BASE_DIR / "results"
    if not (results / "summary_table.csv").is_file():
        import pytest

        pytest.skip("không có thư mục results/ trong môi trường này")

    m = load_metrics(results, MODEL, "caformer_s18")
    assert m is not None
    assert abs(m["test_accuracy"] - 0.9854) < 1e-9
    assert abs(m["macro_f1"] - 0.9848) < 1e-9
    assert m["test_set_size"] == 890
    assert len(m["per_class"]) == 5
    assert m["epochs"] == 30
