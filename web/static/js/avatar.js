/**
 * Avatar bot đi cùng câu trả lời của trợ lý.
 *
 * Lúc đang sinh chữ, avatar ở trạng thái "working" và bám ngay sau chữ cuối.
 * Trả lời xong, nó chuyển sang "default" (đứng yên, chớp mắt, thỉnh thoảng nhảy)
 * và dời lên cạnh nhãn tên người nói — ở lại đó luôn, không biến mất.
 *
 * Dùng API canvas thuần của `bot-avatars` (BotAvatarSim + drawBotAvatarFrame),
 * KHÔNG dùng component React của gói đó: ứng dụng này không có bước build, và
 * kéo thêm React vào chỉ vì một biểu tượng là không đáng.
 *
 * Thư viện nặng ~190KB nên được nạp động (`import()`), chỉ khi trợ lý thực sự
 * bắt đầu trả lời.
 */

const SIZE = 20;        // cạnh ô avatar, px CSS — vừa cỡ một chữ cái
const TYPE = "clover";

let libPromise = null;

function loadLib() {
  // Nạp một lần rồi dùng lại; lỗi mạng thì cho thử lại ở lần sau.
  if (!libPromise) {
    libPromise = import("/static/vendor/bot-avatars.js").catch((err) => {
      libPromise = null;
      throw err;
    });
  }
  return libPromise;
}

/* --- Một vòng lặp chung cho mọi avatar ---
   Avatar ở lại sau khi trả lời xong, nên một cuộc trò chuyện dài sẽ có nhiều
   con cùng sống. Mỗi con tự gọi requestAnimationFrame là lãng phí; gộp về một
   vòng duy nhất thì chi phí không đổi dù có bao nhiêu avatar. Vòng lặp tự dừng
   khi không còn con nào, và khi tab bị ẩn. */
const live = new Set();
let ticking = false;
let lastT = 0;

function tick(now) {
  if (!live.size) { ticking = false; return; }
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  for (const a of live) a.draw(dt);
  requestAnimationFrame(tick);
}

function startTicker() {
  if (ticking || !live.size) return;
  ticking = true;
  lastT = 0;
  requestAnimationFrame(tick);
}

document.addEventListener("visibilitychange", () => {
  // Tab ẩn: vòng lặp tự tắt ở nhịp sau. Hiện lại thì chạy tiếp.
  if (!document.hidden) startTicker();
});

/** Trình duyệt đang ở chế độ tối hay sáng — avatar cần biết để chọn mực. */
function currentTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Tạo một avatar đang ở trạng thái "working".
 *
 * Trả về null nếu thư viện không nạp được (mạng hỏng, trình duyệt cũ) — phía
 * gọi tự quay lại con trỏ nhấp nháy bằng CSS. Avatar chỉ là trang trí, không
 * được phép làm hỏng việc đọc câu trả lời.
 */
export async function createWorkingAvatar() {
  let lib;
  try {
    lib = await loadLib();
  } catch {
    return null;
  }

  const {
    BotAvatarSim, drawBotAvatarFrame, botAvatarShapes, botAvatarPresets,
    autoInk, BOT_AVATAR_OVERSCAN,
  } = lib;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const box = SIZE * BOT_AVATAR_OVERSCAN;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(box * dpr);
  canvas.height = Math.round(box * dpr);
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "bot-caret";
  // Canvas vẽ rộng hơn ô thật (để cú nhảy không bị cắt) rồi kéo lại bằng lề âm,
  // nhờ vậy chỗ nó chiếm trong dòng chữ vẫn đúng bằng SIZE.
  const bleed = (box - SIZE) / 2;
  canvas.style.width = `${box}px`;
  canvas.style.height = `${box}px`;
  canvas.style.margin = `${-bleed}px ${-bleed}px ${-bleed}px ${-bleed + 4}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const preset = botAvatarPresets[TYPE];
  const cfg = {
    path: new Path2D(botAvatarShapes[TYPE]),
    ...preset,
    ink: autoInk(preset.color),
    shading: "plastic",
    typeKey: TYPE,
    dpr,
    theme: currentTheme(),
  };

  const sim = new BotAvatarSim(Math.random(), "working");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handle = {
    el: canvas,
    draw(dt) {
      sim.update(dt);
      ctx.clearRect(0, 0, box, box);
      drawBotAvatarFrame(ctx, SIZE, sim.pose, cfg);
    },

    /** Gắn lại vào cuối phần chữ. Cần gọi sau mỗi lần đặt innerHTML, vì thao
     *  tác đó xoá sạch các nút con — kể cả canvas này. */
    attach(bodyEl) {
      // Đi xuống tới khối chữ sâu nhất ở cuối: markdown sinh ra <ul><li>…</li></ul>,
      // nếu chỉ nối vào thẻ ngoài cùng thì avatar rớt thành một dòng riêng bên
      // dưới danh sách thay vì bám ngay sau chữ đang được gõ.
      let target = bodyEl;
      for (;;) {
        const last = target.lastElementChild;
        if (!last || !/^(P|LI|UL|OL)$/.test(last.tagName)) break;
        target = last;
      }
      target.append(canvas);
    },

    /** Trả lời xong: thôi "working", dời lên cạnh nhãn tên và ở lại đó. */
    settle(labelEl) {
      sim.setState("default");
      canvas.classList.add("bot-caret--settled");
      canvas.style.margin = `${-bleed}px ${-bleed + 6}px ${-bleed}px ${-bleed}px`;
      labelEl.prepend(canvas);
    },

    /** Gỡ hẳn (khi xoá hội thoại). */
    destroy() {
      live.delete(handle);
      canvas.remove();
    },
  };

  if (reduced) {
    // Tôn trọng prefers-reduced-motion: vẽ một khung tĩnh, không vào vòng lặp.
    sim.update(1 / 60);
    drawBotAvatarFrame(ctx, SIZE, sim.pose, { ...cfg, still: true });
  } else {
    live.add(handle);
    startTicker();
  }

  return handle;
}

/** Gỡ mọi avatar đang sống — gọi khi xoá sạch hội thoại. */
export function destroyAllAvatars() {
  for (const a of [...live]) a.destroy();
}
