/**
 * Logic giao diện: tải ảnh lên, gọi API, hiển thị kết quả.
 *
 * JavaScript thuần theo module ES, không framework, không CDN — nhờ vậy
 * Content-Security-Policy giữ được `script-src 'self'`.
 *
 * Nguyên tắc trình bày: người dùng cuối chỉ cần biết BỆNH GÌ, Ở ĐÂU và LÀM GÌ.
 * Ba thứ đó hiện ngay; mọi thứ còn lại (triệu chứng, xác suất các lớp, thông số
 * kỹ thuật) nằm trong các mục gập lại, mở ra khi cần.
 */
import { createWorkingAvatar, destroyAllAvatars } from "./avatar.js";
import { SEVERITY_LABEL, STRINGS } from "./i18n.js";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp", "image/tiff",
]);
// Tên timm khó đọc với người dùng cuối; ánh xạ sang tên quen thuộc.
// Backbone chưa có trong bảng thì hiện nguyên tên timm, vẫn đúng hơn là ghim cứng.
const MODEL_DISPLAY_NAMES = {
  "caformer_s18.sail_in22k_ft_in1k": "CAFormer-S18",
  "mobilenetv3_small_100": "MobileNetV3-Small",
  "maxvit_tiny_tf_224": "MaxViT-Tiny",
  "deit_small_patch16_224": "DeiT-Small",
  "swin_tiny_patch4_window7_224": "Swin-Tiny",
  "vit_small_patch16_224": "ViT-Small",
};

const modelLabel = (name) => MODEL_DISPLAY_NAMES[name] || name || "—";

const STORAGE_LANG = "dld.lang";
const STORAGE_THEME = "dld.theme";

const ICONS = {
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M3 15v3a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-3"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4.5M12 16h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3-.5L3.5 21l1.3-4.3A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0 4-4m-4 4-4-4"/><path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.5"/><path d="M20 20v-4.5h-4.5"/></svg>',
};

/* --- Tiện ích --- */
const fmtPercent = (v, digits = 1) => `${(v * 100).toFixed(digits)}%`;

/**
 * Độ chắc chắn không bao giờ được làm tròn lên thành "100%": mô hình gần như
 * không khi nào chắc tuyệt đối, và con số 100% khiến người dùng tin hơn mức mô
 * hình thực sự bảo đảm. Chỉ đúng 1.0 mới là 100%.
 */
function fmtConfidence(v) {
  const pct = v * 100;
  if (v < 1 && pct >= 99.9) return "99.9%";
  return `${pct.toFixed(1)}%`;
}

const setText = (el, value) => { if (el) el.textContent = value; };

function readStored(key, allowed, fallback) {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;  // chế độ riêng tư / site data bị chặn
  }
}
function writeStored(key, value) {
  try { localStorage.setItem(key, value); } catch { /* không quan trọng */ }
}

/* --- Trạng thái --- */
const state = {
  lang: readStored(STORAGE_LANG, ["vi", "en"], "vi"),
  theme: readStored(STORAGE_THEME, ["light", "dark"], null),
  result: null,
  lastFile: null,
  objectUrl: null,
  fileName: "",
  modelInfo: null,
  busy: false,
};
const t = () => STRINGS[state.lang];

/* --- DOM --- */
const el = {};
function cacheElements() {
  const ids = [
    "brandTitle", "langVi", "langEn", "themeToggle",
    "intro", "introTitle", "introBody",
    "dropzone", "fileInput", "dropIcon", "dropTitle", "dropHint", "dropMeta",
    "stage", "notice", "progress", "progressTitle",
    "results", "plates", "plateHeatmap", "plateBox",
    "imgOriginal", "imgHeatmap", "imgBoxed", "bboxOverlay", "bboxLabel",
    "capOriginal", "capHeatmap", "capBox",
    "verdict", "verdictEyebrow", "verdictPathogen",
    "severityBadge", "verdictName", "confFill", "confValue", "confLabel",
    "lowConfidence", "lowConfBody",
    "resetBtn", "exportBtn",
    "probsTitle", "probs", "techTitle", "tech",
    "assistant", "chatFab", "chatDot", "chatPanel", "chatClose",
    "chatTitle", "chatLog", "chatSuggest", "chatForm", "chatInput", "chatSend", "chatNote",
    "footerDisclaimer",
  ];
  for (const id of ids) el[id] = document.getElementById(id);
}

/* --- Chủ đề --- */
function isDark() {
  return state.theme === "dark"
    || (!state.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
}
function applyTheme() {
  if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
  else document.documentElement.removeAttribute("data-theme");
  el.themeToggle.innerHTML = isDark() ? ICONS.sun : ICONS.moon;
  el.themeToggle.setAttribute("aria-label", t().themeToggle);
  el.themeToggle.title = t().themeToggle;
}
function toggleTheme() {
  state.theme = isDark() ? "light" : "dark";
  writeStored(STORAGE_THEME, state.theme);
  applyTheme();
}

/* --- Ngôn ngữ --- */
function applyLanguage() {
  const s = t();
  document.documentElement.lang = s.htmlLang;

  setText(el.brandTitle, s.tagline);
  setText(el.introTitle, s.introTitle);
  setText(el.introBody, s.introBody);
  setText(el.dropTitle, s.dropTitle);
  setText(el.dropHint, s.dropHint);
  setText(el.dropMeta, s.dropMeta);
  setText(el.progressTitle, s.analysing);

  setText(el.capOriginal, s.capOriginal);
  setText(el.capHeatmap, s.capHeatmap);
  setText(el.capBox, s.capBox);
  setText(el.verdictEyebrow, s.verdictEyebrow);
  setText(el.confLabel, s.confidence);

  setText(el.probsTitle, s.probsTitle);
  setText(el.techTitle, s.techTitle);
  setText(el.lowConfBody, s.lowConfidence);
  setText(el.chatTitle, s.chatTitle);
  setText(el.chatNote, s.chatNote);
  el.chatInput.placeholder = s.chatPlaceholder;
  el.chatFab.setAttribute("aria-label", s.chatTitle);
  el.chatClose.setAttribute("aria-label", s.chatClose);
  setText(el.footerDisclaimer, s.footerDisclaimer);

  el.resetBtn.innerHTML = ICONS.refresh;
  el.resetBtn.appendChild(document.createTextNode(` ${s.analyseAnother}`));

  // Nhãn nút xuất nằm trong <span> riêng để đổi chữ "Đang tạo ảnh…" mà không
  // phải dựng lại cả biểu tượng.
  el.exportBtn.innerHTML = ICONS.download;
  const exportLabel = document.createElement("span");
  exportLabel.textContent = s.exportBtn;
  el.exportBtn.append(exportLabel);

  el.langVi.setAttribute("aria-pressed", String(state.lang === "vi"));
  el.langEn.setAttribute("aria-pressed", String(state.lang === "en"));

  applyTheme();
  renderSuggestions();
  // Nội dung chuyên môn do server bản địa hoá, nên phải gọi lại API để dịch.
  // Hội thoại cũ bằng ngôn ngữ trước không còn hợp nên bỏ và diễn giải lại.
  if (state.result) refetchForLanguage();
}

/* --- Thông tin mô hình (chỉ dùng cho mục kỹ thuật) --- */
async function loadModelInfo() {
  try {
    const res = await fetch("/api/model-info");
    state.modelInfo = res.ok ? await res.json() : null;
  } catch {
    state.modelInfo = null;
  }
  // Không có OPENROUTER_API_KEY phía máy chủ thì ẩn hẳn khung trò chuyện, thay
  // vì để người dùng gõ câu hỏi rồi mới báo lỗi.
  chat.available = Boolean(state.modelInfo?.chat_available);
  // Chỉ hiện nút khi đã có kết quả để hỏi; trước đó không có gì để nói.
  el.assistant.hidden = !(chat.available && state.result);
}

/* --- Thông báo --- */
function showNotice(kind, text) {
  const wrap = document.createElement("div");
  wrap.className = `notice notice--${kind}`;
  wrap.setAttribute("role", kind === "error" ? "alert" : "status");
  const icon = document.createElement("span");
  icon.innerHTML = kind === "error" ? ICONS.alert : ICONS.check;
  const body = document.createElement("div");
  body.className = "notice__body";
  body.textContent = text;
  wrap.append(icon.firstElementChild ?? icon, body);
  el.notice.replaceChildren(wrap);
  el.notice.hidden = false;
}
function clearNotice() {
  el.notice.hidden = true;
  el.notice.replaceChildren();
}

/* --- Vòng chẩn đoán --- */
function validateFile(file) {
  const s = t();
  if (file.size > MAX_UPLOAD_BYTES) return s.errTooLarge;
  // Một số hệ thống không gán type; để server quyết định thay vì chặn sớm.
  if (file.type && !ACCEPTED_TYPES.has(file.type.toLowerCase())) return s.errType;
  return null;
}

async function handleFile(file) {
  if (!file || state.busy) return;
  const problem = validateFile(file);
  if (problem) { showNotice("error", problem); return; }

  clearNotice();
  state.fileName = file.name;
  state.busy = true;
  el.intro.hidden = true;
  el.dropzone.hidden = true;
  el.results.hidden = true;
  el.progress.hidden = false;

  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(file);

  try {
    state.result = await postPredict(file);
    state.lastFile = file;
    renderResult(state.result);
  } catch (err) {
    el.intro.hidden = false;
    el.dropzone.hidden = false;
    showNotice("error", err.message);
  } finally {
    state.busy = false;
    el.progress.hidden = true;
  }
}

async function postPredict(file) {
  const s = t();
  const body = new FormData();
  body.append("file", file, file.name);

  let res;
  try {
    res = await fetch(`/api/predict?lang=${state.lang}&gradcam=true`, { method: "POST", body });
  } catch {
    throw new Error(s.errNetwork);
  }
  if (!res.ok) {
    if (res.status === 429) throw new Error(s.errRate);
    if (res.status === 503) throw new Error(s.errUnavailable);
    if (res.status === 413) throw new Error(s.errTooLarge);
    if (res.status === 422) throw new Error(s.errType);
    throw new Error(s.errGeneric);
  }
  return res.json();
}

/** Đổi ngôn ngữ thì gọi lại API để lấy nội dung chuyên môn đã bản địa hoá. */
async function refetchForLanguage() {
  if (!state.lastFile || state.busy) return;
  state.busy = true;
  try {
    state.result = await postPredict(state.lastFile);
    renderResult(state.result);
  } catch {
    // Giữ kết quả cũ; chỉ phần vỏ đổi ngôn ngữ.
  } finally {
    state.busy = false;
  }
}

/* --- Hiển thị --- */
function renderResult(r) {
  const s = t();
  el.results.hidden = false;

  // Ba khung ảnh cùng hiển thị: 1 ảnh gốc, 2 bản đồ nhiệt, 3 khoanh vùng.
  // Khung 3 dùng lại chính ảnh gốc rồi vẽ khung bao đè lên, giống hình 3 panel
  // trong notebook. Panel nào không có dữ liệu thì ẩn hẳn thay vì để ô trống.
  el.imgOriginal.src = state.objectUrl;
  el.imgBoxed.src = state.objectUrl;

  const hasCam = Boolean(r.gradcam_png_b64);
  if (hasCam) el.imgHeatmap.src = `data:image/png;base64,${r.gradcam_png_b64}`;
  el.plateHeatmap.hidden = !hasCam;

  const hasBox = Boolean(r.bbox);
  el.plateBox.hidden = !hasBox;
  if (hasBox) el.bboxLabel.textContent = fmtConfidence(r.confidence);

  // Số khung thực tế quyết định số cột, để 2 khung không bị kéo dãn thành 3.
  const visible = 1 + Number(hasCam) + Number(hasBox);
  el.plates.style.setProperty("--plate-count", String(visible));

  // Nhãn chẩn đoán
  const severity = r.info.severity;
  el.verdict.dataset.severity = severity;
  el.severityBadge.dataset.severity = severity;
  // Màu trạng thái luôn kèm biểu tượng và nhãn chữ, không để màu đứng một mình.
  el.severityBadge.innerHTML = severity === "none" ? ICONS.check : ICONS.alert;
  el.severityBadge.appendChild(document.createTextNode(` ${s[SEVERITY_LABEL[severity]]}`));

  setText(el.verdictName, r.info.name);
  setText(el.verdictPathogen, r.info.pathogen_label);
  setText(el.confValue, fmtConfidence(r.confidence));
  el.confFill.style.width = `${Math.max(r.confidence * 100, 1)}%`;
  el.lowConfidence.hidden = r.is_confident;

  // Xác suất các lớp (trong mục gập)
  el.probs.replaceChildren(...r.scores.map((score, i) => {
    const row = document.createElement("div");
    row.className = "prob";
    row.dataset.top = String(i === 0);

    const name = document.createElement("div");
    name.className = "prob__name";
    name.textContent = score.label;

    const value = document.createElement("div");
    value.className = "prob__value";
    value.textContent = fmtPercent(score.probability, 1);

    const track = document.createElement("div");
    track.className = "prob__track";
    track.setAttribute("role", "img");
    track.setAttribute("aria-label", `${score.label}: ${fmtPercent(score.probability, 1)}`);
    const fill = document.createElement("div");
    fill.className = "prob__fill";
    fill.style.width = `${Math.max(score.probability * 100, 0.4)}%`;
    track.append(fill);

    row.append(name, value, track);
    return row;
  }));

  // Thông tin kỹ thuật. Tên mô hình lấy từ phản hồi API, KHÔNG ghim cứng —
  // mô hình đổi được qua biến môi trường nên ghim cứng sẽ hiện sai mà không ai
  // biết (đã xảy ra: giao diện khoe CAFormer trong khi máy chủ chạy MobileNet).
  const distilled = state.modelInfo?.metrics?.distilled_from;
  const modelText = distilled
    ? `${modelLabel(r.model_name)} ${s.techDistilled} ${modelLabel(distilled)}`
    : modelLabel(r.model_name);

  const rows = [
    [s.techPathogen, r.info.pathogen ?? "—"],
    [s.techModel, modelText],
    [s.techAccuracy, state.modelInfo?.metrics
      ? fmtPercent(state.modelInfo.metrics.test_accuracy, 2) : "—"],
    [s.techTime, `${Math.round(r.inference_ms)} ms`],
    [s.techArea, r.bbox ? fmtPercent(r.bbox.area_ratio, 1) : "—"],
    [s.techFile, state.fileName],
  ];
  el.tech.replaceChildren(...rows.flatMap(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    return [dt, dd];
  }));

  if (el.imgBoxed.complete) positionBoundingBox();

  // Có kết quả thì hiện nút trợ lý, mở sẵn bảng và tự diễn giải ngay.
  if (chat.available) {
    resetChat();
    el.assistant.hidden = false;
    openChat({ focusInput: false });
    askChat("");
  }
}

/**
 * Vùng ảnh thực bên trong khung, sau khi `object-fit: contain` thêm viền trống.
 * Không thể đặt khung bao theo kích thước khung: ảnh được căn giữa và giữ nguyên
 * tỉ lệ, nên phần nội dung thường nhỏ hơn khung.
 */
function renderedImageRect(imgEl) {
  const fw = imgEl.clientWidth, fh = imgEl.clientHeight;
  const nw = imgEl.naturalWidth, nh = imgEl.naturalHeight;
  if (!nw || !nh) return null;
  const scale = Math.min(fw / nw, fh / nh);
  const w = nw * scale, h = nh * scale;
  return { left: (fw - w) / 2, top: (fh - h) / 2, width: w, height: h };
}

/**
 * Đặt khung bao WSOL lên ảnh gốc.
 *
 * Toạ độ từ API đã chuẩn hoá [0,1], và chuẩn hoá thì bất biến với phép co giãn
 * theo từng trục: mô hình nhìn ảnh đã ép về 224x224 (méo tỉ lệ), nhưng tỉ lệ
 * x/width trong ảnh ép và ảnh gốc là như nhau, nên dùng thẳng được.
 */
function positionBoundingBox() {
  const bbox = state.result?.bbox;
  if (!bbox) { el.bboxOverlay.hidden = true; return; }
  const rect = renderedImageRect(el.imgBoxed);
  if (!rect) { el.bboxOverlay.hidden = true; return; }

  const top = rect.top + bbox.y * rect.height;
  Object.assign(el.bboxOverlay.style, {
    left: `${rect.left + bbox.x * rect.width}px`,
    top: `${top}px`,
    width: `${bbox.width * rect.width}px`,
    height: `${bbox.height * rect.height}px`,
  });
  // Nhãn nằm trên hộp; hộp sát mép trên thì lật vào trong cho khỏi bị cắt.
  el.bboxOverlay.dataset.labelInside = String(top < 22);
  el.bboxOverlay.hidden = false;
}

function reset() {
  state.result = null;
  state.lastFile = null;
  if (state.objectUrl) { URL.revokeObjectURL(state.objectUrl); state.objectUrl = null; }
  el.results.hidden = true;
  el.intro.hidden = false;
  el.dropzone.hidden = false;
  clearNotice();
  el.fileInput.value = "";
  closeChat({ restoreFocus: false });
  resetChat();
  el.assistant.hidden = true;
  el.dropzone.focus();
}

/* --- Sự kiện --- */
function bindEvents() {
  el.dropIcon.innerHTML = ICONS.upload;

  el.dropzone.addEventListener("click", () => el.fileInput.click());
  el.dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.fileInput.click(); }
  });
  el.fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  });

  // Kéo thả: phải chặn mặc định cả ở dragover, nếu không trình duyệt sẽ mở ảnh.
  for (const type of ["dragenter", "dragover"]) {
    el.dropzone.addEventListener(type, (e) => {
      e.preventDefault(); el.dropzone.dataset.dragging = "true";
    });
  }
  for (const type of ["dragleave", "drop"]) {
    el.dropzone.addEventListener(type, (e) => {
      e.preventDefault(); el.dropzone.dataset.dragging = "false";
    });
  }
  el.dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => e.preventDefault());

  window.addEventListener("paste", (e) => {
    const item = [...(e.clipboardData?.items ?? [])]
      .find((i) => i.kind === "file" && i.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (file) handleFile(file);
  });

  el.imgBoxed.addEventListener("load", positionBoundingBox);
  window.addEventListener("resize", positionBoundingBox);

  el.resetBtn.addEventListener("click", reset);
  el.exportBtn.addEventListener("click", exportResult);
  el.themeToggle.addEventListener("click", toggleTheme);

  const setLang = (lang) => {
    if (state.lang === lang) return;
    state.lang = lang;
    writeStored(STORAGE_LANG, lang);
    applyLanguage();
  };
  el.langVi.addEventListener("click", () => setLang("vi"));
  el.langEn.addEventListener("click", () => setLang("en"));

  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => { if (!state.theme) applyTheme(); });
}


/* =============================================================================
   Trợ lý AI
   ===========================================================================*/

const chat = { history: [], busy: false, available: false, open: false, follow: false };

/**
 * Dựng HTML từ markdown rút gọn mà LLM trả về.
 *
 * Tự viết thay vì nạp thư viện markdown: trang đặt `script-src 'self'` nên không
 * kéo được CDN, và một bộ chuyển đổi đầy đủ là quá thừa cho mấy thẻ ta cần.
 *
 * AN TOÀN: nội dung này do LLM sinh ra, tức là dữ liệu không đáng tin. Toàn bộ
 * ký tự HTML được escape TRƯỚC, rồi mới chèn lại đúng vài thẻ ta tự tạo — nhờ
 * vậy không có đường nào để chèn thẻ hay thuộc tính vào trang.
 */
function renderMarkdown(text) {
  const esc = (t) => t
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const inline = (t) => esc(t)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  const out = [];
  let list = null;  // 'ul' | 'ol' | null

  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }

    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const number = line.match(/^(\d+)[.)]\s+(.*)$/);

    if (bullet) {
      if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; }
      out.push(`<li>${inline(bullet[1])}</li>`);
    } else if (number) {
      if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; }
      out.push(`<li>${inline(number[2])}</li>`);
    } else {
      closeList();
      // Bỏ dấu # của tiêu đề markdown: prompt đã cấm, nhưng mô hình vẫn có thể lỡ.
      out.push(`<p>${inline(line.replace(/^#{1,6}\s*/, ""))}</p>`);
    }
  }
  closeList();
  return out.join("");
}

function appendMessage(who, cls) {
  const wrap = document.createElement("div");
  wrap.className = `msg msg--${cls}`;
  const label = document.createElement("div");
  label.className = "msg__who";
  // Chữ nằm trong <span> riêng để avatar chen vào trước mà không đè lên text.
  const labelText = document.createElement("span");
  labelText.textContent = who;
  label.append(labelText);
  const body = document.createElement("div");
  body.className = "msg__body";
  wrap.append(label, body);
  el.chatLog.append(wrap);
  // Đưa ĐẦU tin nhắn mới lên đầu khung: với câu trả lời dài, nhảy thẳng xuống
  // đáy sẽ khiến người đọc mất luôn phần mở đầu.
  //
  // Tính bằng getBoundingClientRect chứ không phải offsetTop: offsetTop đo theo
  // offsetParent, mà khung log không được định vị nên offsetParent là một tổ
  // tiên khác — ra sai vài chục pixel.
  const logTop = el.chatLog.getBoundingClientRect().top;
  const wrapTop = wrap.getBoundingClientRect().top;
  el.chatLog.scrollTop += wrapTop - logTop - 4;
  chat.follow = false;   // tin nhắn mới: đọc từ đầu, chưa bám đáy
  return { wrap, body, label };
}

function renderSuggestions() {
  const s = t();
  if (chat.busy || !chat.available) { el.chatSuggest.replaceChildren(); return; }
  el.chatSuggest.replaceChildren(...s.chatSuggestions.map((text) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.addEventListener("click", () => askChat(text));
    return b;
  }));
}

/**
 * Gửi câu hỏi và đọc luồng SSE.
 *
 * `message` rỗng nghĩa là yêu cầu trợ lý tự diễn giải kết quả — đây là lượt chạy
 * tự động ngay sau khi chẩn đoán xong.
 */
async function askChat(message) {
  if (chat.busy || !state.result || !chat.available) return;
  const s = t();
  chat.busy = true;
  el.chatSend.disabled = true;
  el.chatSuggest.replaceChildren();

  if (message) {
    appendMessage(s.chatYou, "user").body.textContent = message;
    chat.history.push({ role: "user", content: message });
  }

  const bot = appendMessage(s.chatBot, "bot");
  bot.wrap.classList.add("msg--streaming");
  let answer = "";

  // Avatar chạy theo chữ. Nạp động nên có thể chưa sẵn sàng ở mẩu chữ đầu tiên;
  // trong lúc chờ, con trỏ nhấp nháy bằng CSS (.msg--streaming) vẫn hiển thị.
  let avatar = null;
  createWorkingAvatar().then((a) => {
    if (!a) return;
    if (chat.busy) {
      avatar = a;
      bot.wrap.classList.add("msg--has-avatar");
      a.attach(bot.body);
    } else {
      // Thư viện nạp xong sau khi câu trả lời đã kết thúc: bỏ qua giai đoạn
      // chạy theo chữ, đặt thẳng vào chỗ nghỉ.
      a.settle(bot.label);
    }
  });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message || null,
        predicted_class: state.result.predicted_class,
        confidence: state.result.confidence,
        // Chỉ gửi lịch sử đã hoàn tất; server tự cắt bớt cho vừa hạn mức token.
        history: chat.history.filter((m) => m.content),
        lang: state.lang,
      }),
    });

    if (!res.ok || !res.body) throw new Error(String(res.status));

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // SSE phân tách sự kiện bằng dòng trống; một mẩu mạng có thể cắt giữa chừng
    // nên phải gom vào buffer rồi mới tách.
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const evt = /^event:\s*(.+)$/m.exec(part)?.[1]?.trim();
        const raw = /^data:\s*(.+)$/m.exec(part)?.[1];
        if (!evt || !raw) continue;
        let data;
        try { data = JSON.parse(raw); } catch { continue; }

        if (evt === "delta") {
          answer += data.t;
          bot.body.innerHTML = renderMarkdown(answer);
          // innerHTML vừa xoá sạch nút con, gắn lại avatar vào cuối dòng chữ.
          avatar?.attach(bot.body);
          followStream();
        } else if (evt === "error") {
          throw new Error(data.message || s.chatError);
        }
      }
    }

    if (!answer.trim()) throw new Error(s.chatError);
    chat.history.push({ role: "assistant", content: answer });
  } catch (err) {
    bot.body.textContent = err.message && err.message.length < 200 ? err.message : s.chatError;
    bot.body.style.color = "var(--ink-faint)";
  } finally {
    // Trả lời xong: avatar không biến mất, nó dời lên cạnh nhãn "KỸ SƯ AI" và
    // chuyển sang trạng thái đứng yên.
    avatar?.settle(bot.label);
    avatar = null;
    bot.wrap.classList.remove("msg--streaming", "msg--has-avatar");
    chat.busy = false;
    el.chatSend.disabled = false;
    renderSuggestions();
    // Trả lời xong mà người dùng đã đóng bảng thì báo bằng chấm đỏ trên nút.
    if (!chat.open) el.chatDot.hidden = false;
  }
}

function resetChat() {
  destroyAllAvatars();
  chat.history = [];
  el.chatLog.replaceChildren();
  el.chatSuggest.replaceChildren();
  el.chatInput.value = "";
}

/** Người dùng có đang ở sát đáy log không (trong vòng 48px)? */
function chatIsAtBottom() {
  const { scrollTop, scrollHeight, clientHeight } = el.chatLog;
  return scrollHeight - scrollTop - clientHeight < 48;
}

function scrollChatToEnd() {
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

/**
 * Có bám đáy trong lúc chữ chảy về hay không — do NGƯỜI DÙNG quyết định, không
 * đo lại ở mỗi mẩu.
 *
 * Nếu đo lại mỗi mẩu thì lúc bong bóng vừa tạo ra, log còn ngắn nên "đang ở đáy"
 * luôn đúng, và thế là nó bám đáy suốt cả câu trả lời — đúng cái lỗi làm trôi
 * mất phần mở đầu. Nên: mỗi tin nhắn mới bắt đầu ở trạng thái KHÔNG bám (đầu tin
 * nhắn được neo lên đầu khung), chỉ khi người dùng tự cuộn xuống đáy mới bật bám.
 */
function followStream() {
  if (chat.follow) scrollChatToEnd();
}

function openChat({ focusInput = true } = {}) {
  chat.open = true;
  el.chatPanel.hidden = false;
  el.chatFab.setAttribute("aria-expanded", "true");
  el.chatDot.hidden = true;
  el.chatFab.innerHTML = ICONS.close;
  el.chatFab.append(el.chatDot);
  // Khi bảng tự bật lúc vừa có kết quả thì KHÔNG cướp con trỏ: người dùng đang
  // đọc kết quả, bị nhảy xuống ô nhập liệu sẽ rất khó chịu (và trên điện thoại
  // còn làm bàn phím bật lên che mất ảnh).
  if (focusInput) el.chatInput.focus();
}

function closeChat({ restoreFocus = true } = {}) {
  chat.open = false;
  el.chatPanel.hidden = true;
  el.chatFab.setAttribute("aria-expanded", "false");
  el.chatFab.innerHTML = ICONS.chat;
  el.chatFab.append(el.chatDot);
  if (restoreFocus) el.chatFab.focus();
}

function toggleChat() {
  if (chat.open) closeChat();
  else openChat();
}

function initChat() {
  el.chatFab.innerHTML = ICONS.chat;
  el.chatFab.append(el.chatDot);
  el.chatClose.innerHTML = ICONS.close;

  // Người dùng tự cuộn tới đáy = muốn theo dõi chữ chảy về; cuộn lên = muốn đọc lại.
  el.chatLog.addEventListener("scroll", () => { chat.follow = chatIsAtBottom(); });

  el.chatFab.addEventListener("click", toggleChat);
  el.chatClose.addEventListener("click", () => closeChat());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chat.open) closeChat();
  });

  el.chatSend.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  el.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = el.chatInput.value.trim();
    if (!text) return;
    el.chatInput.value = "";
    askChat(text);
  });
}

/* =============================================================================
   Khởi động — phải đặt CUỐI tệp
   `renderSuggestions()` (gọi từ applyLanguage) đọc `const chat` khai báo ở phần
   trợ lý AI phía trên. `const` không được hoisting như hàm, nên chạy khối này
   sớm hơn chỗ khai báo sẽ ném ReferenceError.
   ===========================================================================*/
cacheElements();
bindEvents();
initChat();
applyLanguage();
loadModelInfo();

/* =============================================================================
   Xuất ảnh kết quả
   ===========================================================================*/

/**
 * Dựng một "phiếu kết quả" gồm 3 khung ảnh và phần chẩn đoán, rồi tải về PNG.
 *
 * Vẽ bằng canvas phía trình duyệt chứ không dựng ở máy chủ, vì hai lý do:
 *   1. Ảnh gốc đang nằm sẵn trong trình duyệt. Dựng ở máy chủ nghĩa là phải tải
 *      ảnh lên lần nữa chỉ để ghép hình.
 *   2. Phần chữ có dấu tiếng Việt: trình duyệt đã nạp sẵn Be Vietnam Pro và vẽ
 *      dấu thanh chuẩn. Làm ở máy chủ thì phải đóng gói thêm tệp .ttf và tự lo
 *      việc xuống dòng — thừa công mà chất lượng chữ không hơn.
 */
const EXPORT = {
  W: 1600,          // bề rộng ảnh xuất (điểm ảnh thật)
  PAD: 56,
  GAP: 20,
  HEAD: 92,
};

function _exportColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, fallback) => (cs.getPropertyValue(n) || fallback).trim();
  return {
    paper: v("--paper", "#faf7f0"),
    ink: v("--ink", "#1a1714"),
    soft: v("--ink-soft", "#5a5247"),
    faint: v("--ink-faint", "#8d8475"),
    rule: v("--rule", "#ddd5c4"),
    accent: v("--accent", "#1d5c38"),
    severity: {
      none: v("--status-good", "#0ca30c"),
      moderate: v("--status-warning", "#fab219"),
      high: v("--status-critical", "#d03b3b"),
    },
  };
}

/** Vẽ ảnh theo kiểu object-fit: contain vào ô (x, y, w, h). */
function _drawContained(ctx, img, x, y, w, h) {
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  return { dx, dy, dw, dh };
}

function _wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildResultImage() {
  const r = state.result;
  const s = t();
  const c = _exportColors();
  const disp = `"Be Vietnam Pro", sans-serif`;

  const cols = [
    { img: el.imgOriginal, caption: s.capOriginal, box: null },
    { img: el.imgHeatmap, caption: s.capHeatmap, box: null },
    { img: el.imgBoxed, caption: s.capBox, box: r.bbox },
  ].filter((p) => p.img.getAttribute("src") && !p.img.closest("figure")?.hidden);

  const n = cols.length;
  const inner = EXPORT.W - EXPORT.PAD * 2;
  const cell = Math.floor((inner - EXPORT.GAP * (n - 1)) / n);
  const capH = 46;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Đo lời cảnh báo TRƯỚC khi đặt kích thước: câu này dài ngắn khác nhau giữa
  // tiếng Việt và tiếng Anh, cấp phát chiều cao cố định sẽ thừa một mảng trắng
  // ở đáy hoặc tệ hơn là cắt mất chữ.
  ctx.font = `500 18px ${disp}`;
  const noteLines = _wrapText(ctx, s.footerDisclaimer, inner);

  // 196 = khoảng cách từ đáy khung ảnh tới dòng cảnh báo đầu tiên (tổng các
  // bước dời y ở phần chẩn đoán bên dưới).
  const bodyH = 196 + noteLines.length * 26;
  canvas.width = EXPORT.W;
  canvas.height = EXPORT.HEAD + cell + capH + bodyH + EXPORT.PAD;

  ctx.fillStyle = c.paper;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Đầu phiếu ---
  let y = EXPORT.PAD;
  ctx.fillStyle = c.ink;
  ctx.font = `800 30px ${disp}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(s.tagline, EXPORT.PAD, y + 22);

  ctx.fillStyle = c.faint;
  ctx.font = `500 20px ${disp}`;
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(s.htmlLang), EXPORT.W - EXPORT.PAD, y + 22);
  ctx.textAlign = "left";

  y = EXPORT.HEAD - 12;
  ctx.strokeStyle = c.rule;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(EXPORT.PAD, y);
  ctx.lineTo(EXPORT.W - EXPORT.PAD, y);
  ctx.stroke();

  // --- Ba khung ảnh ---
  y += 22;
  cols.forEach((col, i) => {
    const x = EXPORT.PAD + i * (cell + EXPORT.GAP);

    ctx.fillStyle = c.rule;
    ctx.fillRect(x, y, cell, cell);
    const fit = _drawContained(ctx, col.img, x, y, cell, cell);

    // Khung bao WSOL vẽ theo đúng vùng ảnh thật, không theo cả ô.
    if (col.box) {
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        fit.dx + col.box.x * fit.dw,
        fit.dy + col.box.y * fit.dh,
        col.box.width * fit.dw,
        col.box.height * fit.dh,
      );
      const label = fmtConfidence(r.confidence);
      ctx.font = `700 19px ${disp}`;
      const lw = ctx.measureText(label).width + 14;
      const ly = Math.max(fit.dy + col.box.y * fit.dh - 26, fit.dy);
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(fit.dx + col.box.x * fit.dw - 2, ly, lw, 26);
      ctx.fillStyle = "#000";
      ctx.fillText(label, fit.dx + col.box.x * fit.dw + 5, ly + 19);
    }

    ctx.strokeStyle = c.rule;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + cell + 16);
    ctx.lineTo(x + cell, y + cell + 16);
    ctx.stroke();

    ctx.fillStyle = c.accent;
    ctx.font = `800 19px ${disp}`;
    ctx.fillText(String(i + 1), x, y + cell + 40);
    ctx.fillStyle = c.soft;
    ctx.font = `600 18px ${disp}`;
    ctx.fillText(col.caption.toUpperCase(), x + 20, y + cell + 40);
  });

  // --- Phần chẩn đoán ---
  y += cell + capH + 40;

  ctx.fillStyle = c.faint;
  ctx.font = `700 17px ${disp}`;
  ctx.fillText(s.verdictEyebrow.toUpperCase(), EXPORT.PAD, y);

  y += 50;
  ctx.fillStyle = c.ink;
  ctx.font = `800 54px ${disp}`;
  ctx.fillText(r.info.name, EXPORT.PAD, y);

  const sevColor = c.severity[r.info.severity] || c.soft;
  ctx.fillStyle = sevColor;
  ctx.font = `800 20px ${disp}`;
  ctx.textAlign = "right";
  ctx.fillText(s[SEVERITY_LABEL[r.info.severity]].toUpperCase(), EXPORT.W - EXPORT.PAD, y - 10);
  ctx.textAlign = "left";

  y += 32;
  ctx.fillStyle = c.soft;
  ctx.font = `italic 500 22px ${disp}`;
  ctx.fillText(r.info.pathogen_label, EXPORT.PAD, y);

  // Thanh độ chắc chắn
  y += 36;
  ctx.fillStyle = c.rule;
  ctx.fillRect(EXPORT.PAD, y, inner, 6);
  ctx.fillStyle = sevColor;
  ctx.fillRect(EXPORT.PAD, y, inner * Math.max(r.confidence, 0.01), 6);

  y += 32;
  ctx.fillStyle = c.ink;
  ctx.font = `800 20px ${disp}`;
  const conf = fmtConfidence(r.confidence);
  ctx.fillText(conf, EXPORT.PAD, y);
  ctx.fillStyle = c.faint;
  ctx.font = `500 20px ${disp}`;
  ctx.fillText(` ${s.confidence}`, EXPORT.PAD + ctx.measureText(conf).width + 16, y);

  // --- Chân phiếu: lời cảnh báo phải đi theo ảnh, vì ảnh sẽ bị chia sẻ lại ---
  y += 46;
  ctx.fillStyle = c.faint;
  ctx.font = `500 18px ${disp}`;
  for (const line of noteLines) {
    ctx.fillText(line, EXPORT.PAD, y);
    y += 26;
  }

  return canvas;
}

async function exportResult() {
  if (!state.result) return;
  const s = t();
  const label = el.exportBtn.querySelector("span");
  el.exportBtn.disabled = true;
  if (label) label.textContent = s.exportBusy;

  try {
    // Chờ font nạp xong, nếu không canvas sẽ vẽ bằng font dự phòng.
    if (document.fonts?.ready) await document.fonts.ready;
    const canvas = await buildResultImage();
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("toBlob");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `chan-doan-${state.result.predicted_class.toLowerCase()}-${stamp}.png`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    showNotice("error", s.exportFail);
  } finally {
    el.exportBtn.disabled = false;
    if (label) label.textContent = s.exportBtn;
  }
}
