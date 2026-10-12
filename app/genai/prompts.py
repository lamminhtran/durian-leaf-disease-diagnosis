"""Prompt hệ thống và ngữ cảnh chẩn đoán tiêm vào hội thoại.

Nguyên tắc: LLM KHÔNG được tự nghĩ ra biện pháp xử lý. Toàn bộ triệu chứng và
hướng xử lý đã nằm trong `app/ml/labels.py` (nội dung đã được rà soát), nên ta
tiêm nguyên văn vào ngữ cảnh và yêu cầu mô hình diễn giải lại cho dễ hiểu thay
vì sáng tác. Đây là khác biệt quan trọng: nông dân có thể làm theo lời khuyên
này ngoài vườn thật, nên một cái tên thuốc hay liều lượng bịa ra là gây hại thật.
"""

from __future__ import annotations

from app.ml.labels import HEALTHY_CLASS, info_for

SYSTEM_PROMPT_VI = """Bạn là kỹ sư nông nghiệp chuyên về cây sầu riêng, đang tư vấn trực tiếp cho nông dân Việt Nam.

CÁCH NÓI:
- Tiếng Việt đời thường, như đang đứng nói chuyện ngoài vườn. Xưng "tôi", gọi người hỏi là "anh/chị".
- Câu ngắn. Tránh từ chuyên ngành; nếu buộc phải dùng thì giải thích ngay bằng lời thường.
- KHÔNG chào hỏi. Không mở đầu bằng "Chào anh/chị". Vào thẳng nội dung.
- Mỗi câu trả lời tối đa khoảng 150 từ, trừ khi người hỏi muốn nói kỹ hơn.

GIỚI HẠN BẮT BUỘC:
- Chỉ dùng thông tin trong phần "DỮ LIỆU HỆ THỐNG" bên dưới làm căn cứ về bệnh và cách xử lý.
- TUYỆT ĐỐI không bịa tên thuốc thương mại, không bịa liều lượng, không bịa nồng độ pha.
  Khi được hỏi về liều, hãy nói: đọc kỹ nhãn thuốc và hỏi cán bộ khuyến nông địa phương.
- Không khẳng định chắc chắn về bệnh. Đây là kết quả từ ảnh, cần kiểm tra thực tế ngoài vườn.
- Nếu người hỏi hỏi chuyện ngoài phạm vi cây sầu riêng và bệnh lá, hãy nói ngắn gọn rằng
  bạn chỉ hỗ trợ về bệnh trên lá sầu riêng.

ĐỊNH DẠNG:
- Dùng gạch đầu dòng khi liệt kê các bước.
- Dùng **in đậm** cho ý quan trọng. Không dùng tiêu đề markdown (#).
"""

SYSTEM_PROMPT_EN = """You are an agronomist specialising in durian, advising smallholder farmers.

HOW TO SPEAK:
- Plain, everyday English, as if standing in the orchard with them. Short sentences.
- Avoid jargon; if you must use a term, explain it immediately.
- NO greetings. Do not open with "Hello". Start with the substance.
- Keep each answer under about 150 words unless asked for more detail.

HARD LIMITS:
- Use only the "SYSTEM DATA" below as your source about the disease and its treatment.
- NEVER invent product brand names, dosages or mixing concentrations.
  If asked about dosage, say: read the product label and consult your local extension officer.
- Never state the diagnosis as certain. It comes from a photo and needs field confirmation.
- If asked about anything beyond durian leaf disease, briefly say that is outside your scope.

FORMAT:
- Use bullet points for steps.
- Use **bold** for key points. Do not use markdown headings (#).
"""

# Dưới ngưỡng này, nhắc LLM nói rõ là kết quả chưa chắc chắn.
LOW_CONFIDENCE_THRESHOLD = 0.60


def system_prompt(lang: str) -> str:
    return SYSTEM_PROMPT_EN if lang == "en" else SYSTEM_PROMPT_VI


def build_context(class_name: str, confidence: float, lang: str = "vi") -> str:
    """Dựng khối dữ liệu neo cho LLM từ chính kết quả mô hình và kho tri thức nội bộ."""
    info = info_for(class_name, lang)
    vi = lang != "en"

    head = "DỮ LIỆU HỆ THỐNG (không phải lời người dùng):" if vi else "SYSTEM DATA (not user input):"
    lines = [
        head,
        f"- {'Kết quả phân loại ảnh' if vi else 'Image classification result'}: {info['name']} ({class_name})",
        # Không làm tròn lên 100%: nói với mô hình là "chắc 100%" sẽ khiến nó
        # khẳng định chắc nịch, trong khi đây chỉ là kết quả đọc từ một tấm ảnh.
        f"- {'Độ tin cậy' if vi else 'Confidence'}: {min(confidence * 100, 99.9):.1f}%",
        f"- {'Tác nhân' if vi else 'Cause'}: {info['pathogen_label']}",
        f"- {'Mô tả' if vi else 'Description'}: {info['summary']}",
    ]

    lines.append("- " + ("Dấu hiệu nhận biết" if vi else "Signs to look for") + ":")
    lines += [f"    · {s}" for s in info["symptoms"]]

    lines.append("- " + ("Hướng xử lý đã được duyệt" if vi else "Approved actions") + ":")
    lines += [f"    · {a}" for a in info["actions"]]

    if confidence < LOW_CONFIDENCE_THRESHOLD:
        lines.append(
            "- CẢNH BÁO: độ tin cậy THẤP. Hãy nói rõ kết quả chưa chắc chắn và khuyên "
            "chụp lại ảnh rõ hơn." if vi else
            "- WARNING: confidence is LOW. Say clearly that this is uncertain and advise "
            "retaking a clearer photo."
        )

    if class_name == HEALTHY_CLASS:
        lines.append(
            "- Lá được đánh giá là khoẻ: tư vấn cách chăm sóc và phòng bệnh chủ động." if vi else
            "- The leaf looks healthy: advise on care and preventive management."
        )

    return "\n".join(lines)


FOLLOW_UP_RULE_VI = """LƯU Ý CHO LƯỢT NÀY:
Người hỏi ĐÃ đọc phần chẩn đoán và các bước xử lý ở lượt trước. Vì vậy:
- KHÔNG nhắc lại tên bệnh, tác nhân, hay mức độ nặng nhẹ.
- KHÔNG liệt kê lại các bước đã nói rồi.
- Chỉ trả lời đúng câu hỏi mới, thêm thông tin mới. Nếu câu trả lời đã nằm trong
  phần đã nói, hãy nói ngắn gọn là việc đó đã nêu ở trên và bổ sung điều chưa nói.
"""

FOLLOW_UP_RULE_EN = """NOTE FOR THIS TURN:
The person has ALREADY read the diagnosis and the treatment steps. Therefore:
- Do NOT restate the disease name, the cause, or how severe it is.
- Do NOT repeat steps you already listed.
- Answer only the new question, adding new information. If the answer was already
  covered, say so briefly and add what has not been said yet.
"""


def follow_up_rule(lang: str) -> str:
    """Quy tắc chỉ áp cho lượt thứ hai trở đi.

    Không có nó, mô hình diễn giải lại toàn bộ chẩn đoán ở mỗi lượt vì khối dữ
    liệu hệ thống luôn được tiêm lại — người dùng phải đọc lại y nguyên đoạn vừa
    đọc rồi mới tới phần trả lời câu hỏi của mình.
    """
    return FOLLOW_UP_RULE_EN if lang == "en" else FOLLOW_UP_RULE_VI


def opening_question(lang: str) -> str:
    """Câu hỏi mồi để LLM tự diễn giải kết quả ngay khi vừa chẩn đoán xong.

    Gửi như một lượt 'user' thay vì nhồi vào prompt hệ thống, để mô hình hiểu đây
    là việc cần trả lời chứ không phải chỉ dẫn hành vi.
    """
    if lang == "en":
        return (
            "Explain this result to me in plain language: what is wrong with my leaf, "
            "how serious is it, and what should I do first?"
        )
    return (
        "Giải thích giúp tôi kết quả này bằng lời dễ hiểu: lá của tôi bị gì, "
        "nặng hay nhẹ, và trước mắt tôi nên làm gì?"
    )
