/**
 * Chuỗi hiển thị cho hai ngôn ngữ.
 *
 * Chỉ chứa phần vỏ giao diện. Tên bệnh, triệu chứng và hướng xử lý do API trả về
 * theo tham số `lang`, nên nội dung chuyên môn chỉ tồn tại một nơi duy nhất
 * (app/ml/labels.py) thay vì bị nhân đôi giữa server và client.
 */
export const STRINGS = {
  vi: {
    htmlLang: "vi",
    tagline: "Chẩn đoán bệnh lá sầu riêng",
    introTitle: "Lá sầu riêng của bạn bị bệnh gì?",
    introBody: "Chụp hoặc tải lên ảnh một chiếc lá. Kết quả có ngay trong vài giây.",

    dropTitle: "Chọn ảnh lá",
    dropHint: "hoặc kéo thả ảnh vào đây",
    dropMeta: "JPEG · PNG · tối đa 10 MB",

    analysing: "Đang phân tích…",

    severityNone: "Lá khoẻ",
    severityModerate: "Cần theo dõi",
    severityHigh: "Cần xử lý sớm",
    confidence: "chắc chắn",

    verdictEyebrow: "Chẩn đoán",
    capOriginal: "Ảnh gốc",
    capHeatmap: "Bản đồ nhiệt",
    capBox: "Khoanh vùng",

    exportBtn: "Tải ảnh kết quả",
    exportBusy: "Đang tạo ảnh…",
    exportFail: "Không tạo được ảnh. Thử lại giúp bạn nhé.",
    probsTitle: "Các khả năng khác",
    techTitle: "Thông tin kỹ thuật",

    techModel: "Mô hình",
    techDistilled: "chưng cất từ",
    techAccuracy: "Độ chính xác",
    techTime: "Thời gian xử lý",
    techPathogen: "Tác nhân",
    techFile: "Tệp ảnh",
    techArea: "Diện tích vùng nghi ngờ",

    analyseAnother: "Chẩn đoán ảnh khác",

    chatTitle: "Hỏi kỹ sư AI",
    chatClose: "Đóng",
    chatYou: "Bạn",
    chatBot: "Kỹ sư AI",
    chatPlaceholder: "Hỏi thêm về cách xử lý…",
    chatNote: "Trợ lý AI có thể trả lời sai. Đừng dùng thay cho việc kiểm tra thực tế.",
    chatError: "Trợ lý AI đang bận. Thử lại sau ít phút.",
    chatSuggestions: [
      "Bệnh này có lây sang cây khác không?",
      "Tôi nên xử lý trong bao lâu?",
      "Có cách nào không dùng thuốc hoá học không?",
    ],

    lowConfidence: "Mô hình chưa chắc chắn. Hãy thử ảnh rõ hơn, chụp gần vùng có dấu hiệu lạ.",

    errTitle: "Không chẩn đoán được",
    errNetwork: "Mất kết nối tới máy chủ. Thử lại giúp bạn nhé.",
    errTooLarge: "Ảnh quá lớn. Chọn tệp dưới 10 MB.",
    errType: "Tệp không phải ảnh. Dùng JPEG hoặc PNG.",
    errRate: "Bạn gửi hơi nhanh. Chờ một lát rồi thử lại.",
    errUnavailable: "Hệ thống đang khởi động. Thử lại sau ít phút.",
    errGeneric: "Có lỗi khi xử lý ảnh. Thử lại giúp bạn nhé.",

    themeToggle: "Đổi chế độ sáng/tối",

    footerDisclaimer:
      "Kết quả chỉ mang tính tham khảo. Hãy kiểm tra thực tế hoặc hỏi cán bộ khuyến nông trước khi xử lý.",
  },

  en: {
    htmlLang: "en",
    tagline: "Durian leaf disease diagnosis",
    introTitle: "What is wrong with your durian leaf?",
    introBody: "Take or upload a photo of a single leaf. You get an answer in seconds.",

    dropTitle: "Choose a leaf photo",
    dropHint: "or drag and drop it here",
    dropMeta: "JPEG · PNG · up to 10 MB",

    analysing: "Analysing…",

    severityNone: "Healthy leaf",
    severityModerate: "Keep an eye on it",
    severityHigh: "Act soon",
    confidence: "confident",

    verdictEyebrow: "Diagnosis",
    capOriginal: "Original",
    capHeatmap: "Heatmap",
    capBox: "Localization",

    exportBtn: "Download result image",
    exportBusy: "Creating image…",
    exportFail: "Could not create the image. Please try again.",
    probsTitle: "Other possibilities",
    techTitle: "Technical details",

    techModel: "Model",
    techDistilled: "distilled from",
    techAccuracy: "Accuracy",
    techTime: "Processing time",
    techPathogen: "Cause",
    techFile: "Image file",
    techArea: "Suspect area size",

    analyseAnother: "Analyse another photo",

    chatTitle: "Ask the AI agronomist",
    chatClose: "Close",
    chatYou: "You",
    chatBot: "AI agronomist",
    chatPlaceholder: "Ask about treatment…",
    chatNote: "The AI assistant can be wrong. Do not rely on it instead of checking in the field.",
    chatError: "The AI assistant is busy. Please try again shortly.",
    chatSuggestions: [
      "Can this spread to my other trees?",
      "How quickly do I need to act?",
      "Is there a way to treat it without chemicals?",
    ],

    lowConfidence: "The model is unsure. Try a sharper photo taken close to the affected area.",

    errTitle: "Diagnosis failed",
    errNetwork: "Lost connection to the server. Please try again.",
    errTooLarge: "Image too large. Choose a file under 10 MB.",
    errType: "That is not an image. Use JPEG or PNG.",
    errRate: "That was a bit fast. Wait a moment and try again.",
    errUnavailable: "The system is starting up. Try again shortly.",
    errGeneric: "Something went wrong. Please try again.",

    themeToggle: "Toggle light/dark mode",

    footerDisclaimer:
      "For reference only. Check in the field or ask an extension officer before acting.",
  },
};

export const SEVERITY_LABEL = {
  none: "severityNone",
  moderate: "severityModerate",
  high: "severityHigh",
};
