"""Bảo vệ bất biến quan trọng nhất của dự án: thứ tự nhãn lớp."""

from __future__ import annotations

import pytest

from app.ml.labels import CLASS_NAMES, DISEASE_INFO, HEALTHY_CLASS, NUM_CLASSES, info_for


def test_class_order_is_frozen():
    """Thứ tự này do ImageFolder sinh ra lúc huấn luyện và quyết định ý nghĩa của
    từng chỉ số đầu ra. Đổi thứ tự sẽ làm mọi dự đoán bị gán sai nhãn một cách
    âm thầm, nên khoá cứng bằng test."""
    assert CLASS_NAMES == (
        "ALGAL_LEAF_SPOT",
        "ALLOCARIDARA_ATTACK",
        "HEALTHY_LEAF",
        "LEAF_BLIGHT",
        "PHOMOPSIS_LEAF_SPOT",
    )
    assert tuple(sorted(CLASS_NAMES)) == CLASS_NAMES, "phải trùng thứ tự sắp xếp của ImageFolder"
    assert NUM_CLASSES == 5


def test_every_class_has_info_in_both_languages():
    assert set(DISEASE_INFO) == set(CLASS_NAMES)
    for name in CLASS_NAMES:
        for lang in ("vi", "en"):
            info = info_for(name, lang)
            assert info["name"]
            assert info["summary"]
            assert info["symptoms"], f"{name}/{lang} thiếu triệu chứng"
            assert info["actions"], f"{name}/{lang} thiếu hướng xử lý"
            assert info["severity"] in {"none", "moderate", "high"}


def test_healthy_class_is_the_only_one_without_pathogen():
    assert HEALTHY_CLASS in CLASS_NAMES
    for name in CLASS_NAMES:
        has_pathogen = DISEASE_INFO[name]["pathogen"] is not None
        assert has_pathogen == (name != HEALTHY_CLASS)
    assert DISEASE_INFO[HEALTHY_CLASS]["severity"] == "none"


@pytest.mark.parametrize("bad", ["fr", "", "VI", None])
def test_unknown_language_falls_back_to_vietnamese(bad):
    assert info_for("LEAF_BLIGHT", bad) == info_for("LEAF_BLIGHT", "vi")
