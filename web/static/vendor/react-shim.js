/**
 * Chỗ trám cho hai import React của `bot-avatars`.
 *
 * Gói đó xuất kèm một component React, nhưng ứng dụng này là JS thuần không có
 * bước build — ta chỉ dùng phần API vẽ canvas (`BotAvatarSim`,
 * `drawBotAvatarFrame`). Hai import ở đầu bundle vì thế không phân giải được
 * trên trình duyệt, nên chúng được trỏ sang tệp này lúc vendor.
 *
 * Lưu ý quan trọng: `forwardRef` được gọi ngay LÚC NẠP MODULE để định nghĩa
 * component, nên nó phải chạy êm. Chỉ những hàm chạy lúc render (`jsx` và các
 * hook) mới được phép ném lỗi — và chúng không bao giờ chạy vì ta không bao giờ
 * dựng component đó.
 */
const renderOnly = (name) => () => {
  throw new Error(
    `bot-avatars: component React (${name}) không dùng được ở bản vendor này. ` +
    `Hãy dùng API canvas: BotAvatarSim + drawBotAvatarFrame.`,
  );
};

/** Chạy lúc nạp module: trả về một component giả, chỉ ném nếu bị dựng. */
export function forwardRef(render) {
  const Stub = renderOnly("BotAvatar");
  Stub.displayName = "BotAvatarStub";
  Stub._render = render;
  return Stub;
}

export const jsx = renderOnly("jsx");
export const useRef = renderOnly("useRef");
export const useImperativeHandle = renderOnly("useImperativeHandle");
export const useId = renderOnly("useId");
export const useEffect = renderOnly("useEffect");
export const useState = renderOnly("useState");
export const useLayoutEffect = renderOnly("useLayoutEffect");
