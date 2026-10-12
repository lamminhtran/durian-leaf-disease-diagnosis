"""Test phần biến đổi bố cục tensor của Grad-CAM — nơi dễ sai thầm lặng nhất."""

from __future__ import annotations

import pytest
import torch

from app.ml.gradcam import _to_nchw


def test_nchw_passes_through_unchanged():
    t = torch.randn(1, 512, 7, 7)
    assert _to_nchw(t).shape == (1, 512, 7, 7)


def test_nhwc_is_permuted():
    """Bố cục channels-last của Swin/MaxViT: (B, H, W, C) -> (B, C, H, W)."""
    t = torch.randn(1, 7, 7, 512)
    assert _to_nchw(t).shape == (1, 512, 7, 7)


def test_token_sequence_is_reshaped_to_grid():
    t = torch.randn(1, 49, 384)
    assert _to_nchw(t).shape == (1, 384, 7, 7)


def test_token_sequence_with_cls_token_drops_it():
    """ViT có thêm token phân lớp ở đầu; 197 = 1 + 14x14."""
    t = torch.randn(1, 197, 384)
    assert _to_nchw(t).shape == (1, 384, 14, 14)


def test_cls_token_layout_is_accepted():
    """50 token = 1 CLS + 7x7 ô, là bố cục hợp lệ nên phải xử lý được."""
    assert _to_nchw(torch.randn(1, 50, 384)).shape == (1, 384, 7, 7)


def test_non_square_token_count_is_rejected():
    """51 không phải số chính phương, và 50 (sau khi bỏ CLS) cũng không."""
    with pytest.raises(ValueError, match="lưới không gian"):
        _to_nchw(torch.randn(1, 51, 384))


def test_unsupported_rank_is_rejected():
    with pytest.raises(ValueError, match="không hỗ trợ"):
        _to_nchw(torch.randn(1, 512))


def test_gradcam_is_class_discriminative():
    """Bản đồ nhiệt của hai lớp khác nhau phải khác nhau.

    Nếu giống hệt thì gradient không chảy tới lớp đích và ảnh giải thích vô nghĩa
    — một lỗi trông vẫn 'chạy được' nên chỉ test mới phát hiện ra.
    """
    import torch.nn as nn

    from app.ml.gradcam import GradCAM

    target = nn.Conv2d(3, 8, 3, padding=1)
    model = nn.Sequential(target, nn.ReLU(), nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(8, 5))
    cam = GradCAM(model, target)
    x = torch.randn(1, 3, 32, 32)

    _, cam_a, idx_a = cam(x, 32, class_index=0)
    _, cam_b, _ = cam(x, 32, class_index=1)

    assert idx_a == 0
    assert cam_a.shape == (32, 32)
    assert float(cam_a.min()) >= 0.0 and float(cam_a.max()) <= 1.0
    assert not torch.allclose(cam_a, cam_b), "CAM không phụ thuộc lớp đích"


def test_gradcam_picks_predicted_class_when_index_omitted():
    import torch.nn as nn

    from app.ml.gradcam import GradCAM

    target = nn.Conv2d(3, 8, 3, padding=1)
    head = nn.Linear(8, 5)
    model = nn.Sequential(target, nn.ReLU(), nn.AdaptiveAvgPool2d(1), nn.Flatten(), head)
    cam = GradCAM(model, target)
    x = torch.randn(1, 3, 32, 32)

    logits, _, idx = cam(x, 32)
    assert idx == int(logits.argmax(dim=1).item())
