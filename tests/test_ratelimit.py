"""Test bộ giới hạn tần suất."""

from __future__ import annotations

from app.ratelimit import SlidingWindowRateLimiter


def test_allows_up_to_quota(limiter):
    for _ in range(3):
        allowed, retry = limiter.check("1.2.3.4")
        assert allowed and retry == 0


def test_blocks_past_quota_and_suggests_retry(limiter):
    for _ in range(3):
        limiter.check("1.2.3.4")
    allowed, retry = limiter.check("1.2.3.4")
    assert not allowed
    assert retry >= 1


def test_quota_is_per_client(limiter):
    for _ in range(3):
        limiter.check("1.1.1.1")
    assert limiter.check("1.1.1.1")[0] is False
    assert limiter.check("2.2.2.2")[0] is True


def test_window_expiry_frees_quota(monkeypatch):
    now = [1000.0]
    monkeypatch.setattr("app.ratelimit.time.monotonic", lambda: now[0])
    lim = SlidingWindowRateLimiter(max_requests=2, window_seconds=60)

    assert lim.check("ip")[0] is True
    assert lim.check("ip")[0] is True
    assert lim.check("ip")[0] is False

    now[0] += 61  # cửa sổ trôi qua
    assert lim.check("ip")[0] is True
