"""Endpoint trò chuyện với trợ lý AI, có tiêm ngữ cảnh chẩn đoán.

Trả về Server-Sent Events để chữ hiện dần thay vì chờ trọn câu trả lời.
Endpoint không lưu trạng thái: lịch sử hội thoại do client giữ và gửi kèm, server
chỉ cắt bớt cho vừa hạn mức token rồi ghép prompt hệ thống và dữ liệu chẩn đoán.
"""

from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from app.deps import AppState, client_ip, get_state
from app.errors import RateLimitExceeded, ServiceUnavailableError
from app.genai.client import LLMError
from app.genai.prompts import (
    build_context,
    follow_up_rule,
    opening_question,
    system_prompt,
)
from app.ml.labels import CLASS_NAMES
from app.schemas import ChatIn

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@router.post(
    "/chat",
    summary="Hỏi trợ lý AI về kết quả chẩn đoán (trả về SSE)",
    responses={
        200: {"content": {"text/event-stream": {}}, "description": "Luồng SSE"},
        422: {"description": "Dữ liệu không hợp lệ"},
        429: {"description": "Vượt hạn mức"},
        503: {"description": "Trợ lý AI chưa được cấu hình"},
    },
)
async def chat(
    payload: ChatIn,
    request: Request,
    state: AppState = Depends(get_state),
) -> StreamingResponse:
    settings = state.settings
    request_id = getattr(request.state, "request_id", "-")

    if state.llm is None or not state.llm.configured:
        raise ServiceUnavailableError(
            "Trợ lý AI chưa được cấu hình. Đặt OPENROUTER_API_KEY trong tệp .env."
        )

    if payload.predicted_class not in CLASS_NAMES:
        raise ServiceUnavailableError(f"Lớp không hợp lệ: {payload.predicted_class!r}")

    # Hạn mức riêng cho chat vì mỗi lượt đều phát sinh chi phí ở nhà cung cấp.
    if settings.rate_limit_enabled and state.chat_limiter is not None:
        allowed, retry_after = state.chat_limiter.check(
            client_ip(request, settings.trusted_proxy_count)
        )
        if not allowed:
            raise RateLimitExceeded(retry_after)

    lang = payload.lang
    # Không có câu hỏi nghĩa là người dùng vừa nhận kết quả: tự diễn giải trước.
    question = (payload.message or "").strip() or opening_question(lang)

    messages = [
        {"role": "system", "content": system_prompt(lang)},
        {"role": "system", "content": build_context(payload.predicted_class, payload.confidence, lang)},
    ]
    limit = settings.llm_max_history_messages
    history = payload.history[-limit:] if limit > 0 else []
    if history:
        # Từ lượt thứ hai trở đi: cấm diễn giải lại chẩn đoán đã nói.
        messages.append({"role": "system", "content": follow_up_rule(lang)})
    messages += [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": question})

    async def generate():
        pieces = 0
        try:
            async for piece in state.llm.stream(messages):
                pieces += 1
                yield _sse("delta", {"t": piece})
            yield _sse("done", {"ok": True})
        except LLMError as exc:
            # Lỗi xảy ra giữa luồng thì không đổi được mã HTTP nữa (header đã gửi),
            # nên báo qua một sự kiện SSE để giao diện hiển thị tử tế.
            logger.warning(
                "Trợ lý AI lỗi", extra={"request_id": request_id, "detail": exc.message}
            )
            yield _sse("error", {"message": exc.message})
        except Exception:
            logger.exception("Lỗi không lường trước khi gọi trợ lý AI",
                             extra={"request_id": request_id})
            yield _sse("error", {"message": "Trợ lý AI gặp sự cố, vui lòng thử lại."})
        finally:
            logger.info(
                "Chat xong",
                extra={
                    "request_id": request_id,
                    "predicted_class": payload.predicted_class,
                    "history_len": len(history),
                    "chunks": pieces,
                    "model": state.llm.model if state.llm else None,
                },
            )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            # Báo nginx đừng đệm, nếu không SSE sẽ bị gom lại rồi đẩy một lần.
            "X-Accel-Buffering": "no",
        },
    )
