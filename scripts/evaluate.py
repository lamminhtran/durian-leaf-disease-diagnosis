#!/usr/bin/env python
"""Đánh giá lại mô hình đang phục vụ trên một thư mục dữ liệu test.

Mục đích: kiểm chứng rằng pipeline suy luận của ứng dụng web cho ra đúng con số
đã báo cáo lúc huấn luyện. Nếu kết quả lệch, nghĩa là tiền xử lý hoặc thứ tự nhãn
đã bị thay đổi ở đâu đó — một lỗi âm thầm mà không test nào khác bắt được.

Dùng:
    python scripts/evaluate.py --data-dir /đường/dẫn/tới/test
"""

from __future__ import annotations

import argparse
import sys
import time
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import get_settings  # noqa: E402
from app.ml.labels import CLASS_NAMES  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data-dir", required=True, type=Path,
        help="Thư mục test có cấu trúc <data-dir>/<TÊN_LỚP>/*.jpg",
    )
    parser.add_argument("--device", default="cpu", help="cpu | cuda | mps | auto")
    parser.add_argument("--limit", type=int, default=0, help="Giới hạn số ảnh mỗi lớp (0 = tất cả)")
    args = parser.parse_args()

    if not args.data_dir.is_dir():
        print(f"Không tìm thấy thư mục: {args.data_dir}", file=sys.stderr)
        return 2

    from app.ml.predictor import DurianPredictor

    settings = get_settings()
    print(f"Mô hình : {settings.backbone_name}")
    print(f"Trọng số: {settings.model_path}")
    print(f"Dữ liệu : {args.data_dir}\n")

    predictor = DurianPredictor(
        backbone_name=settings.backbone_name,
        weights_path=Path(settings.model_path),
        device_preference=args.device,
        image_size=settings.image_size,
        enable_gradcam=False,  # không cần ảnh giải thích khi chấm điểm
    )

    confusion: Counter[tuple[str, str]] = Counter()
    per_class_total: Counter[str] = Counter()
    correct = total = 0
    started = time.perf_counter()

    for class_name in CLASS_NAMES:
        folder = args.data_dir / class_name
        if not folder.is_dir():
            print(f"  bỏ qua {class_name}: không có thư mục", file=sys.stderr)
            continue

        files = sorted(
            p for p in folder.iterdir()
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
        )
        if args.limit:
            files = files[: args.limit]

        for path in files:
            try:
                image = predictor.decode_image(path.read_bytes())
            except Exception as exc:
                print(f"  bỏ qua {path.name}: {exc}", file=sys.stderr)
                continue
            predicted = predictor.predict(image, want_gradcam=False).predicted_class
            confusion[(class_name, predicted)] += 1
            per_class_total[class_name] += 1
            correct += predicted == class_name
            total += 1

        print(f"  {class_name:22s} {per_class_total[class_name]:4d} ảnh")

    if total == 0:
        print("Không có ảnh nào để đánh giá.", file=sys.stderr)
        return 2

    elapsed = time.perf_counter() - started

    # Precision / recall / F1 cho từng lớp.
    print(f"\n{'Lớp':24s} {'Precision':>10s} {'Recall':>9s} {'F1':>8s} {'Số ảnh':>8s}")
    print("-" * 63)
    f1_scores = []
    for name in CLASS_NAMES:
        tp = confusion[(name, name)]
        fp = sum(confusion[(a, name)] for a in CLASS_NAMES if a != name)
        fn = sum(confusion[(name, b)] for b in CLASS_NAMES if b != name)
        precision = tp / (tp + fp) if tp + fp else 0.0
        recall = tp / (tp + fn) if tp + fn else 0.0
        f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
        f1_scores.append(f1)
        print(f"{name:24s} {precision:10.4f} {recall:9.4f} {f1:8.4f} {per_class_total[name]:8d}")

    accuracy = correct / total
    macro_f1 = sum(f1_scores) / len(f1_scores)
    print("-" * 63)
    print(f"{'Độ chính xác':24s} {accuracy * 100:9.2f}%  ({correct}/{total})")
    print(f"{'Macro F1':24s} {macro_f1:10.4f}")
    print(f"{'Thời gian':24s} {elapsed:9.1f}s  ({elapsed / total * 1000:.1f} ms/ảnh)")

    # Đối chiếu với số liệu đã lưu, nếu có.
    from app.ml.metrics import load_metrics

    reported = load_metrics(
        Path(settings.results_dir), settings.backbone_name, settings.metrics_prefix
    )
    if reported:
        drift = abs(accuracy - reported["test_accuracy"])
        print(
            f"\nĐã báo cáo lúc huấn luyện: {reported['test_accuracy'] * 100:.2f}% "
            f"/ macro F1 {reported['macro_f1']:.4f}"
        )
        if drift < 0.005:
            print("KHỚP — pipeline suy luận trùng với lúc huấn luyện.")
        else:
            print(f"LỆCH {drift * 100:.2f} điểm phần trăm — kiểm tra lại tiền xử lý và thứ tự nhãn.")
            return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
