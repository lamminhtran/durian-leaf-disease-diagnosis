"""Client gọi LLM qua OpenRouter (API tương thích chuẩn OpenAI Chat Completions).

Dùng chế độ streaming: nông dân thấy chữ hiện dần ngay sau khoảng một giây thay
vì nhìn màn hình trống chờ cả câu trả lời. Với kết nối di động chập chờn ở vùng
trồng, khác biệt này quyết định việc người dùng có kiên nhẫn chờ hay không.
"""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator, Iterable

import httpx

logger = logging.getLogger(__name__)

# Mã lỗi OpenRouter -> (mã HTTP trả cho client, thông báo tiếng Việt).
# Chi tiết lỗi gốc chỉ ghi log, không trả ra ngoài để tránh lộ cấu hình nội bộ.
_UPSTREAM_ERRORS: dict[int, tuple[int, str]] = {
    400: (502, "Yêu cầu gửi tới dịch vụ AI không hợp lệ."),
    401: (503, "Khoá OPENROUTER_API_KEY không hợp lệ hoặc đã bị thu hồi."),
    402: (503, "Tài khoản OpenRouter đã hết hạn mức sử dụng."),
    403: (503, "Khoá API không có quyền dùng mô hình đã cấu hình."),
    404: (503, "Mô hình đã cấu hình không tồn tại trên OpenRouter."),
    408: (504, "Dịch vụ AI phản hồi quá chậm, vui lòng thử lại."),
    429: (429, "Trợ lý AI đang quá tải hoặc đã vượt hạn mức. Vui lòng chờ ít phút."),
}


class LLMError(Exception):
    """Lỗi khi gọi LLM, kèm mã HTTP phù hợp để tầng API trả về cho client."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class LLMNotConfiguredError(LLMError):
    def __init__(self) -> None:
        super().__init__(
            "Trợ lý AI chưa được cấu hình: thiếu OPENROUTER_API_KEY.", status_code=503
        )


class OpenRouterClient:
    """Dùng một AsyncClient duy nhất cho cả tiến trình để tái dùng kết nối TCP/TLS."""

    def __init__(
        self,
        api_key: str | None,
        model: str,
        base_url: str = "https://openrouter.ai/api/v1",
        timeout: float = 60.0,
        max_tokens: int = 700,
        temperature: float = 0.3,
        referer: str | None = None,
        title: str = "Durian Leaf Disease Diagnosis",
    ) -> None:
        self._api_key = api_key
        self._model = model
        self._max_tokens = max_tokens
        self._temperature = temperature

        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        # Hai header này là tuỳ chọn của OpenRouter, dùng để nhận diện ứng dụng.
        if referer:
            headers["HTTP-Referer"] = referer
        headers["X-Title"] = title

        self._client = httpx.AsyncClient(
            base_url=base_url.rstrip("/"),
            headers=headers,
            # connect ngắn để phát hiện mất mạng sớm; read dài vì LLM sinh chữ dần.
            timeout=httpx.Timeout(timeout, connect=10.0),
        )

    @property
    def model(self) -> str:
        return self._model

    @property
    def configured(self) -> bool:
        return bool(self._api_key)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def stream(self, messages: Iterable[dict[str, str]]) -> AsyncIterator[str]:
        """Sinh từng mẩu văn bản khi LLM trả về. Ném LLMError nếu gọi thất bại."""
        if not self.configured:
            raise LLMNotConfiguredError

        payload = {
            "model": self._model,
            "messages": list(messages),
            "max_tokens": self._max_tokens,
            "temperature": self._temperature,
            "stream": True,
        }

        try:
            async with self._client.stream("POST", "/chat/completions", json=payload) as response:
                if response.status_code >= 400:
                    body = (await response.aread()).decode("utf-8", "replace")
                    logger.error(
                        "OpenRouter trả về HTTP %s: %s", response.status_code, body[:500]
                    )
                    status, message = _UPSTREAM_ERRORS.get(
                        response.status_code, (502, "Dịch vụ AI gặp sự cố, vui lòng thử lại sau.")
                    )
                    raise LLMError(message, status)

                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data = line[6:].strip()
                    if data == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data)
                    except json.JSONDecodeError:
                        # OpenRouter chèn comment giữ kết nối; bỏ qua dòng không phải JSON.
                        continue
                    choices = chunk.get("choices") or []
                    if not choices:
                        continue
                    piece = (choices[0].get("delta") or {}).get("content")
                    if piece:
                        yield piece

        except httpx.TimeoutException as exc:
            logger.warning("Hết thời gian chờ khi gọi OpenRouter: %s", exc)
            raise LLMError("Dịch vụ AI phản hồi quá chậm, vui lòng thử lại.", 504) from exc
        except httpx.HTTPError as exc:
            logger.warning("Lỗi kết nối tới OpenRouter: %s", exc)
            raise LLMError("Không kết nối được tới dịch vụ AI.", 502) from exc
