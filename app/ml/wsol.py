"""Khoanh vùng bệnh bằng Weakly Supervised Object Localization (WSOL).

Ý tưởng: mô hình chỉ được huấn luyện với nhãn mức ảnh ("lá này bị cháy lá"),
không hề có nhãn vị trí. Nhưng bản đồ Grad-CAM cho biết mô hình nhìn vào đâu, nên
ta nhị phân hoá bản đồ đó rồi lấy khung bao của vùng nóng nhất — ra được hộp giới
hạn mà không cần một nhãn vị trí nào. Đó là "weakly supervised".

Thuật toán giữ đúng như mã trong notebook huấn luyện:

    mask = (cam * 255).astype(uint8)
    _, thresh = cv2.threshold(mask, 120, 255, cv2.THRESH_BINARY)
    contours = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    if cv2.contourArea(c) > 40: bbox = cv2.boundingRect(c)

Ở đây hiện thực lại bằng NumPy thuần thay vì gọi OpenCV: thêm `opencv-python` chỉ
để tìm khung bao sẽ kéo theo ~60MB phụ thuộc, trong khi ảnh chỉ 224x224 nên gán
nhãn liên thông bằng NumPy là quá đủ nhanh.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

# Ngưỡng nhị phân hoá, tính trên thang uint8 giống notebook (cv2.THRESH_BINARY
# đặt điểm ảnh thành 255 khi giá trị LỚN HƠN ngưỡng, nên dùng '>' chứ không '>=').
CAM_THRESHOLD_U8 = 120

# Diện tích tối thiểu để một vùng được coi là đáng khoanh (đơn vị: điểm ảnh).
MIN_COMPONENT_AREA = 40


@dataclass(frozen=True)
class BoundingBox:
    """Khung bao, toạ độ chuẩn hoá về [0,1] theo chiều rộng/cao của ảnh.

    Dùng toạ độ tương đối để client vẽ được ở bất kỳ kích thước hiển thị nào mà
    không cần biết ảnh gốc to bao nhiêu.
    """

    x: float
    y: float
    width: float
    height: float
    # Tỉ lệ diện tích vùng nóng trên toàn ảnh — cho biết mô hình tập trung hay dàn trải.
    area_ratio: float


def _largest_component_bbox(mask: np.ndarray) -> tuple[int, int, int, int, int] | None:
    """Tìm vùng liên thông lớn nhất (8 hướng) và trả (x, y, w, h, số điểm ảnh).

    Gán nhãn bằng hai lượt quét với union-find: nhanh hơn nhiều so với BFS từng
    điểm, và không cần phụ thuộc scipy.
    """
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    parent: list[int] = [0]  # parent[0] không dùng; nhãn bắt đầu từ 1

    def find(a: int) -> int:
        root = a
        while parent[root] != root:
            root = parent[root]
        while parent[a] != root:  # nén đường đi
            parent[a], a = root, parent[a]
        return root

    def union(a: int, b: int) -> None:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[max(ra, rb)] = min(ra, rb)

    # Lượt 1: gán nhãn tạm, ghi nhận các nhãn tương đương.
    ys, xs = np.nonzero(mask)
    # np.nonzero luôn trả hai mảng cùng độ dài nên strict=True là đúng.
    for y, x in zip(ys.tolist(), xs.tolist(), strict=True):
        # Chỉ cần xét 4 láng giềng đã duyệt trước đó trong 8-liên thông.
        neighbours = []
        if y > 0:
            if labels[y - 1, x]:
                neighbours.append(labels[y - 1, x])
            if x > 0 and labels[y - 1, x - 1]:
                neighbours.append(labels[y - 1, x - 1])
            if x + 1 < w and labels[y - 1, x + 1]:
                neighbours.append(labels[y - 1, x + 1])
        if x > 0 and labels[y, x - 1]:
            neighbours.append(labels[y, x - 1])

        if neighbours:
            smallest = min(neighbours)
            labels[y, x] = smallest
            for n in neighbours:
                union(smallest, n)
        else:
            parent.append(len(parent))
            labels[y, x] = len(parent) - 1

    if len(parent) == 1:
        return None

    # Lượt 2: quy các nhãn tương đương về gốc, rồi đếm và lấy khung bao.
    flat = labels.ravel()
    nonzero = flat != 0
    if not nonzero.any():
        return None
    roots = np.array([find(i) for i in range(len(parent))], dtype=np.int32)
    resolved = np.where(nonzero, roots[flat], 0)

    counts = np.bincount(resolved)
    counts[0] = 0  # bỏ nền
    best = int(counts.argmax())
    if counts[best] == 0:
        return None

    component = (resolved.reshape(h, w) == best)
    rows = np.nonzero(component.any(axis=1))[0]
    cols = np.nonzero(component.any(axis=0))[0]
    y0, y1 = int(rows[0]), int(rows[-1])
    x0, x1 = int(cols[0]), int(cols[-1])
    return x0, y0, x1 - x0 + 1, y1 - y0 + 1, int(counts[best])


def localize(cam: np.ndarray) -> BoundingBox | None:
    """Suy ra khung bao vùng bệnh từ bản đồ Grad-CAM đã chuẩn hoá [0,1].

    Trả None khi không có vùng nào đủ lớn — khi đó giao diện chỉ hiển thị bản đồ
    nhiệt, thay vì vẽ một cái hộp vô nghĩa.
    """
    if cam.ndim != 2 or cam.size == 0:
        return None

    mask = (cam * 255).astype(np.uint8) > CAM_THRESHOLD_U8
    if not mask.any():
        return None

    found = _largest_component_bbox(mask)
    if found is None:
        return None

    x, y, w, h, area = found
    if area <= MIN_COMPONENT_AREA:
        return None

    img_h, img_w = cam.shape
    return BoundingBox(
        x=round(x / img_w, 5),
        y=round(y / img_h, 5),
        width=round(w / img_w, 5),
        height=round(h / img_h, 5),
        area_ratio=round(area / (img_w * img_h), 5),
    )
