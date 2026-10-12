"""Test khoanh vùng WSOL."""

from __future__ import annotations

import numpy as np

from app.ml.wsol import MIN_COMPONENT_AREA, localize


def _cam(spots):
    cam = np.zeros((224, 224), dtype=np.float32)
    for y0, y1, x0, x1, v in spots:
        cam[y0:y1, x0:x1] = v
    return cam


def test_empty_cam_has_no_box():
    assert localize(np.zeros((224, 224), dtype=np.float32)) is None


def test_below_threshold_has_no_box():
    """Giá trị 0.4 -> uint8 102, không vượt ngưỡng 120 nên không có vùng nào."""
    assert localize(_cam([(10, 60, 10, 60, 0.4)])) is None


def test_picks_largest_component_not_the_first():
    """Có hai đốm; phải chọn đốm LỚN HƠN, kể cả khi nó nằm sau."""
    cam = _cam([(10, 18, 10, 18, 0.9), (100, 160, 100, 180, 0.9)])
    b = localize(cam)
    assert b is not None
    assert abs(b.x - 100 / 224) < 1e-3
    assert abs(b.y - 100 / 224) < 1e-3
    assert abs(b.width - 80 / 224) < 1e-3
    assert abs(b.height - 60 / 224) < 1e-3


def test_component_at_or_below_min_area_is_rejected():
    side = int(MIN_COMPONENT_AREA**0.5)  # 6x6 = 36 <= 40
    assert localize(_cam([(10, 10 + side, 10, 10 + side, 0.9)])) is None


def test_diagonally_touching_pixels_are_one_component():
    """8-liên thông: hai khối chạm nhau ở góc phải tính là MỘT vùng, giống OpenCV."""
    cam = _cam([(10, 20, 10, 20, 0.9), (20, 30, 20, 30, 0.9)])
    b = localize(cam)
    assert b is not None
    # Khung bao phải trùm cả hai khối.
    assert abs(b.width - 20 / 224) < 1e-3
    assert abs(b.height - 20 / 224) < 1e-3


def test_coordinates_are_normalised_and_in_range():
    b = localize(_cam([(50, 120, 60, 150, 1.0)]))
    assert b is not None
    for v in (b.x, b.y, b.width, b.height, b.area_ratio):
        assert 0.0 <= v <= 1.0
    assert b.x + b.width <= 1.0
    assert b.y + b.height <= 1.0


def test_area_ratio_matches_pixel_count():
    cam = _cam([(0, 40, 0, 50, 0.9)])  # 40x50 = 2000 px trên 224x224
    b = localize(cam)
    assert abs(b.area_ratio - 2000 / (224 * 224)) < 1e-4


def test_full_cam_covers_whole_image():
    b = localize(np.ones((224, 224), dtype=np.float32))
    assert (b.x, b.y, b.width, b.height) == (0.0, 0.0, 1.0, 1.0)


def test_invalid_shapes_return_none():
    assert localize(np.zeros((0, 0), dtype=np.float32)) is None
    assert localize(np.zeros((5, 5, 3), dtype=np.float32)) is None
