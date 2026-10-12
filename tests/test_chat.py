"""Test endpoint trợ lý AI."""

from __future__ import annotations

import json

import pytest

from app.genai.client import LLMError, OpenRouterClient
from app.genai.prompts import build_context, opening_question, system_prompt
from app.ml.labels import CLASS_NAMES


class FakeLLM:
    """Thay cho OpenRouterClient: không gọi mạng, ghi lại messages nhận được."""

    def __init__(self, pieces=("Lá ", "bị cháy ", "lá."), error: Exception | None = None,
                 configured: bool = True):
        self.model = "fake/model"
        self.configured = configured
        self._pieces = pieces
        self._error = error
        self.last_messages: list[dict] | None = None

    async def stream(self, messages):
        self.last_messages = list(messages)
        if self._error:
            raise self._error
        for p in self._pieces:
            yield p

    async def aclose(self):
        pass


def sse_events(text: str) -> list[tuple[str, dict]]:
    out = []
    for block in text.split("\n\n"):
        if not block.strip():
            continue
        evt = next((ln[6:].strip() for ln in block.splitlines() if ln.startswith("event:")), None)
        raw = next((ln[5:].strip() for ln in block.splitlines() if ln.startswith("data:")), None)
        if evt and raw:
            out.append((evt, json.loads(raw)))
    return out


def body(**kw):
    base = {"predicted_class": "LEAF_BLIGHT", "confidence": 0.98, "history": [], "lang": "vi"}
    base.update(kw)
    return base


# --- Khi chưa cấu hình khoá ---

def test_chat_is_503_without_api_key(client):
    client.app_state.llm = None
    r = client.post("/api/chat", json=body())
    assert r.status_code == 503
    assert r.json()["error"]["code"] == "model_unavailable"


def test_model_info_reports_chat_unavailable_without_key(client):
    assert client.get("/api/model-info").json()["chat_available"] is False


def test_model_info_reports_chat_available_with_key(client):
    client.app_state.settings.openrouter_api_key = "sk-test"
    assert client.get("/api/model-info").json()["chat_available"] is True


# --- Luồng SSE ---

def test_chat_streams_sse_events(client):
    client.app_state.llm = FakeLLM()
    r = client.post("/api/chat", json=body(message="Bệnh này có lây không?"))
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/event-stream")

    events = sse_events(r.text)
    deltas = [d["t"] for e, d in events if e == "delta"]
    assert "".join(deltas) == "Lá bị cháy lá."
    assert events[-1][0] == "done"


def test_empty_message_triggers_auto_explanation(client):
    """Không có câu hỏi = vừa chẩn đoán xong, trợ lý phải tự diễn giải."""
    llm = FakeLLM()
    client.app_state.llm = llm
    r = client.post("/api/chat", json=body(message=None))
    assert r.status_code == 200
    assert llm.last_messages[-1]["content"] == opening_question("vi")


def test_upstream_error_is_reported_as_sse_event(client):
    """Lỗi giữa luồng không đổi được mã HTTP nữa, phải báo qua sự kiện SSE."""
    client.app_state.llm = FakeLLM(error=LLMError("Hết hạn mức.", 429))
    r = client.post("/api/chat", json=body(message="x"))
    assert r.status_code == 200
    events = sse_events(r.text)
    assert events[-1][0] == "error"
    assert "hạn mức" in events[-1][1]["message"]


# --- Neo ngữ cảnh ---

def test_prompt_is_grounded_in_real_disease_data(client):
    """Prompt phải chứa triệu chứng và hướng xử lý thật, để LLM không bịa thuốc."""
    llm = FakeLLM()
    client.app_state.llm = llm
    client.post("/api/chat", json=body(message="Xử lý sao?"))

    system_blocks = [m["content"] for m in llm.last_messages if m["role"] == "system"]
    joined = "\n".join(system_blocks)
    assert "Validamycin" in joined, "thiếu hướng xử lý đã duyệt"
    assert "Rhizoctonia solani" in joined
    assert "không bịa" in joined.lower() or "không bịa tên thuốc" in joined


def test_confidence_is_never_reported_as_100_percent():
    """Nói với LLM là 'chắc 100%' sẽ khiến nó khẳng định quá mức."""
    ctx = build_context("LEAF_BLIGHT", 0.99999, "vi")
    assert "100.0%" not in ctx
    assert "99.9%" in ctx


def test_low_confidence_adds_warning_to_prompt():
    assert "THẤP" in build_context("LEAF_BLIGHT", 0.35, "vi")
    assert "THẤP" not in build_context("LEAF_BLIGHT", 0.95, "vi")


@pytest.mark.parametrize("lang", ["vi", "en"])
@pytest.mark.parametrize("class_name", CLASS_NAMES)
def test_context_builds_for_every_class_and_language(class_name, lang):
    ctx = build_context(class_name, 0.9, lang)
    assert len(ctx) > 100
    assert class_name in ctx


def test_system_prompt_switches_language():
    assert "nông dân Việt Nam" in system_prompt("vi")
    assert "agronomist" in system_prompt("en")


# --- Kiểm tra đầu vào ---

def test_rejects_unknown_class(client):
    client.app_state.llm = FakeLLM()
    assert client.post("/api/chat", json=body(predicted_class="KHONG_CO")).status_code == 503


def test_rejects_overlong_message(client):
    client.app_state.llm = FakeLLM()
    assert client.post("/api/chat", json=body(message="x" * 3000)).status_code == 422


def test_history_is_truncated_to_configured_limit(client):
    llm = FakeLLM()
    client.app_state.llm = llm
    client.app_state.settings.llm_max_history_messages = 4
    history = [{"role": "user" if i % 2 == 0 else "assistant", "content": f"m{i}"}
               for i in range(20)]
    client.post("/api/chat", json=body(message="hỏi", history=history))

    sent = [m for m in llm.last_messages if m["role"] != "system"]
    # 4 lượt gần nhất + câu hỏi hiện tại
    assert len(sent) == 5
    assert sent[0]["content"] == "m16"


def test_chat_rate_limit(client):
    from app.ratelimit import SlidingWindowRateLimiter

    client.app_state.llm = FakeLLM()
    client.app_state.settings.rate_limit_enabled = True
    client.app_state.chat_limiter = SlidingWindowRateLimiter(2, 60)

    assert client.post("/api/chat", json=body(message="a")).status_code == 200
    assert client.post("/api/chat", json=body(message="b")).status_code == 200
    r = client.post("/api/chat", json=body(message="c"))
    assert r.status_code == 429


# --- Khoá API không được rò ra ngoài ---

def test_api_key_is_never_exposed_to_client(client):
    client.app_state.settings.openrouter_api_key = "sk-super-secret-value"
    for path in ("/api/model-info", "/healthz", "/readyz"):
        assert "sk-super-secret" not in client.get(path).text

    client.app_state.llm = FakeLLM()
    assert "sk-super-secret" not in client.post("/api/chat", json=body(message="x")).text


def test_client_sends_auth_header_only_when_key_present():
    with_key = OpenRouterClient(api_key="sk-x", model="m")
    without = OpenRouterClient(api_key=None, model="m")
    assert with_key._client.headers.get("authorization") == "Bearer sk-x"
    assert "authorization" not in without._client.headers
    assert with_key.configured and not without.configured


# --- Bóc tách luồng SSE của OpenRouter ---

class _MockTransport:
    """Giả lập OpenRouter ở tầng HTTP để kiểm tra việc bóc tách luồng thật."""

    def __init__(self, status: int, chunks: list[bytes]):
        self.status = status
        self.chunks = chunks

    def handler(self, request):
        import httpx

        return httpx.Response(self.status, stream=httpx.ByteStream(b"".join(self.chunks)))


async def _collect(client: OpenRouterClient, messages):
    return [p async for p in client.stream(messages)]


def _client_with(status: int, chunks: list[bytes]) -> OpenRouterClient:
    import httpx

    c = OpenRouterClient(api_key="sk-test", model="m")
    c._client = httpx.AsyncClient(
        base_url="https://example.invalid",
        transport=httpx.MockTransport(_MockTransport(status, chunks).handler),
    )
    return c


def _sse_line(content: str) -> bytes:
    payload = {"choices": [{"delta": {"content": content}}]}
    return f"data: {json.dumps(payload)}\n\n".encode()


@pytest.mark.asyncio
async def test_parses_real_openrouter_wire_format():
    chunks = [_sse_line("Lá "), _sse_line("bị "), _sse_line("cháy."), b"data: [DONE]\n\n"]
    c = _client_with(200, chunks)
    assert "".join(await _collect(c, [{"role": "user", "content": "x"}])) == "Lá bị cháy."
    await c.aclose()


@pytest.mark.asyncio
async def test_ignores_keepalive_and_malformed_lines():
    """OpenRouter chèn dòng comment giữ kết nối; không được làm hỏng luồng."""
    chunks = [
        b": OPENROUTER PROCESSING\n\n",
        _sse_line("A"),
        b"data: {khong-phai-json}\n\n",
        b'data: {"choices": []}\n\n',
        _sse_line("B"),
        b"data: [DONE]\n\n",
    ]
    c = _client_with(200, chunks)
    assert "".join(await _collect(c, [{"role": "user", "content": "x"}])) == "AB"
    await c.aclose()


@pytest.mark.asyncio
async def test_upstream_401_maps_to_friendly_message():
    c = _client_with(401, [b'{"error":"invalid key"}'])
    with pytest.raises(LLMError) as exc:
        await _collect(c, [{"role": "user", "content": "x"}])
    assert exc.value.status_code == 503
    assert "OPENROUTER_API_KEY" in exc.value.message
    # Không được rò nội dung lỗi gốc của nhà cung cấp ra ngoài.
    assert "invalid key" not in exc.value.message
    await c.aclose()


@pytest.mark.asyncio
async def test_upstream_429_is_passed_through_as_429():
    c = _client_with(429, [b"rate limited"])
    with pytest.raises(LLMError) as exc:
        await _collect(c, [{"role": "user", "content": "x"}])
    assert exc.value.status_code == 429
    await c.aclose()


@pytest.mark.asyncio
async def test_missing_key_raises_before_any_network_call():
    c = OpenRouterClient(api_key=None, model="m")
    with pytest.raises(LLMError) as exc:
        await _collect(c, [{"role": "user", "content": "x"}])
    assert exc.value.status_code == 503
    await c.aclose()


# --- Chống lặp lại chẩn đoán ở các lượt sau ---

def test_follow_up_rule_absent_on_first_turn(client):
    llm = FakeLLM()
    client.app_state.llm = llm
    client.post("/api/chat", json=body(message=None, history=[]))
    joined = "\n".join(m["content"] for m in llm.last_messages if m["role"] == "system")
    assert "LƯU Ý CHO LƯỢT NÀY" not in joined


def test_follow_up_rule_present_once_history_exists(client):
    """Không có quy tắc này, mô hình diễn giải lại toàn bộ chẩn đoán mỗi lượt."""
    llm = FakeLLM()
    client.app_state.llm = llm
    client.post("/api/chat", json=body(
        message="Có lây không?",
        history=[{"role": "user", "content": "a"}, {"role": "assistant", "content": "b"}],
    ))
    joined = "\n".join(m["content"] for m in llm.last_messages if m["role"] == "system")
    assert "KHÔNG nhắc lại tên bệnh" in joined


def test_system_prompt_forbids_greetings():
    assert "KHÔNG chào hỏi" in system_prompt("vi")
    assert "NO greetings" in system_prompt("en")
