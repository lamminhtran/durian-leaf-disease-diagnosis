"""Giới hạn tần suất theo IP bằng thuật toán sliding window, lưu trong bộ nhớ.

Giới hạn cần biết: bộ đếm nằm trong RAM của từng tiến trình, nên khi chạy nhiều
worker thì hạn mức thực tế = rate_limit_requests x số worker. Đây là lớp phòng vệ
cơ bản chống lạm dụng; khi triển khai công khai nên đặt giới hạn ở nginx hoặc
dùng Redis để các worker dùng chung bộ đếm (xem deploy/nginx.conf).
"""

from __future__ import annotations

import threading
import time
from collections import defaultdict, deque


class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self._max = max_requests
        self._window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()
        self._last_cleanup = 0.0

    def check(self, key: str) -> tuple[bool, int]:
        """Trả về (được phép, số giây nên chờ nếu bị chặn)."""
        now = time.monotonic()
        cutoff = now - self._window
        with self._lock:
            self._cleanup(now, cutoff)
            bucket = self._hits[key]
            while bucket and bucket[0] <= cutoff:
                bucket.popleft()
            if len(bucket) >= self._max:
                retry_after = max(1, int(bucket[0] + self._window - now) + 1)
                return False, retry_after
            bucket.append(now)
            return True, 0

    def _cleanup(self, now: float, cutoff: float) -> None:
        """Xoá định kỳ các IP đã hết hạn để bộ đếm không phình ra vô hạn."""
        if now - self._last_cleanup < self._window:
            return
        self._last_cleanup = now
        for key in [k for k, v in self._hits.items() if not v or v[-1] <= cutoff]:
            del self._hits[key]
