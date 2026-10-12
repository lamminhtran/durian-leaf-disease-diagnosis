"""Test tích hợp: nạp mô hình thật và chẩn đoán ảnh thật.

Tự bỏ qua khi không có tệp trọng số, để bộ test vẫn chạy được trên máy/CI không
kèm theo 94MB trọng số. Chạy riêng nhóm này bằng:  pytest -m integration
"""

from __future__ import annotations

from pathlib import Path

import pytest

from app.config import get_settings
from app.ml.labels import CLASS_NAMES

pytestmark = pytest.mark.integration

DATASET_TEST_DIR = Path(
    "/Users/kiettran/Documents/graduation_thesis/Dataset/DLD_FinalDataset_224_spit/test"
)


@pytest.fixture(scope="module")
def predictor():
    from app.ml.predictor import DurianPredictor

    settings = get_settings()
    weights = Path(settings.model_path)
    if not weights.is_file():
        pytest.skip(f"không có tệp trọng số: {weights}")

    return DurianPredictor(
        backbone_name=settings.backbone_name,
        weights_path=weights,
        device_preference="cpu",
        image_size=settings.image_size,
        enable_gradcam=True,
    )


def test_weights_load_strictly(predictor):
    """Nạp bằng strict=True: mọi khoá phải khớp chính xác với kiến trúc."""
    assert predictor.gradcam_available
    assert str(predictor.device) == "cpu"


def test_probabilities_are_a_valid_distribution(predictor):
    from PIL import Image

    result = predictor.predict(Image.new("RGB", (224, 224), (60, 110, 70)))
    probs = [s.probability for s in result.scores]
    assert len(probs) == len(CLASS_NAMES)
    assert abs(sum(probs) - 1.0) < 1e-5
    assert all(0.0 <= p <= 1.0 for p in probs)
    assert probs == sorted(probs, reverse=True)


@pytest.mark.parametrize("class_name", CLASS_NAMES)
def test_classifies_held_out_samples_correctly(predictor, class_name):
    """Lấy vài ảnh thật của mỗi lớp từ tập test và kiểm tra mô hình đoán đúng.

    Mô hình đạt 98.54% trên toàn tập test, nên trên một mẫu nhỏ ta yêu cầu đúng
    hết; nếu test này đỏ thì nhiều khả năng pipeline tiền xử lý đã lệch khỏi lúc
    huấn luyện (sai chuẩn hoá, sai thứ tự nhãn...), chứ không phải mô hình kém đi.
    """
    folder = DATASET_TEST_DIR / class_name
    if not folder.is_dir():
        pytest.skip("không có bộ dữ liệu test trên máy này")

    files = sorted(p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})[:4]
    if not files:
        pytest.skip(f"không có ảnh trong {folder}")

    for path in files:
        image = predictor.decode_image(path.read_bytes())
        result = predictor.predict(image, want_gradcam=False)
        assert result.predicted_class == class_name, (
            f"{path.name}: đoán {result.predicted_class}, đúng ra là {class_name}"
        )


def test_gradcam_overlay_is_a_valid_png(predictor):
    import base64
    import io

    from PIL import Image

    result = predictor.predict(Image.new("RGB", (300, 200), (70, 120, 80)), want_gradcam=True)
    assert result.gradcam_png_b64

    raw = base64.b64decode(result.gradcam_png_b64)
    with Image.open(io.BytesIO(raw)) as img:
        assert img.format == "PNG"
        assert img.size == (448, 448)


def test_exif_rotated_image_is_uprighted(predictor):
    """Ảnh chụp từ điện thoại hay có cờ EXIF orientation; nếu bỏ qua thì mô hình
    nhận ảnh xoay khác với ảnh người dùng nhìn thấy."""
    import io

    from PIL import Image

    buf = io.BytesIO()
    img = Image.new("RGB", (200, 100), (90, 130, 80))
    exif = img.getexif()
    exif[274] = 6  # orientation = quay 90 độ
    img.save(buf, format="JPEG", exif=exif)

    decoded = predictor.decode_image(buf.getvalue())
    assert decoded.size == (100, 200), "chưa áp dụng xoay theo EXIF"


def test_wsol_box_is_produced_on_real_images(predictor):
    """Ảnh lá thật phải khoanh được vùng, và vùng đó phải nằm trong ảnh."""
    folder = DATASET_TEST_DIR / "LEAF_BLIGHT"
    if not folder.is_dir():
        pytest.skip("không có bộ dữ liệu test trên máy này")

    files = sorted(p for p in folder.iterdir() if p.suffix.lower() == ".jpg")[:5]
    found = 0
    for path in files:
        result = predictor.predict(predictor.decode_image(path.read_bytes()), want_gradcam=True)
        if result.bbox is None:
            continue
        found += 1
        b = result.bbox
        assert 0.0 <= b.x < 1.0 and 0.0 <= b.y < 1.0
        assert 0.0 < b.width <= 1.0 and 0.0 < b.height <= 1.0
        assert b.x + b.width <= 1.0 + 1e-6
        assert b.y + b.height <= 1.0 + 1e-6
        assert 0.0 < b.area_ratio <= 1.0
    assert found > 0, "không khoanh được vùng nào trên ảnh lá thật"




# --- Mô hình chưng cất tri thức (student) ---

STUDENT_WEIGHTS = Path("models/mobilenetv3_small_kd_best.pth")


@pytest.fixture(scope="module")
def student():
    from app.ml.predictor import DurianPredictor

    if not STUDENT_WEIGHTS.is_file():
        pytest.skip(f"không có trọng số student: {STUDENT_WEIGHTS}")
    return DurianPredictor(
        backbone_name="mobilenetv3_small_100",
        weights_path=STUDENT_WEIGHTS,
        device_preference="cpu",
        enable_gradcam=True,
    )


def test_student_weights_load_strictly(student):
    assert student.gradcam_available


def test_student_classifies_held_out_samples(student):
    """Student đạt 96.74% toàn tập, nên trên mẫu nhỏ cho phép sai tối đa 1."""
    wrong = []
    for class_name in CLASS_NAMES:
        folder = DATASET_TEST_DIR / class_name
        if not folder.is_dir():
            pytest.skip("không có bộ dữ liệu test trên máy này")
        for path in sorted(p for p in folder.iterdir() if p.suffix.lower() == ".jpg")[:3]:
            result = student.predict(student.decode_image(path.read_bytes()), want_gradcam=False)
            if result.predicted_class != class_name:
                wrong.append(f"{path.name}: {result.predicted_class} != {class_name}")
    assert len(wrong) <= 1, f"sai quá nhiều: {wrong}"


def test_pinned_gradcam_layers_match_the_training_notebook(predictor, student):
    """Khoá cứng lớp đích Grad-CAM cho từng backbone.

    Để bộ tự dò chọn thay sẽ cho bản đồ nhiệt trông tương tự nhưng KHUNG BAO
    lệch hẳn — đã đo: CAFormer IoU 0.79, MobileNet IoU 0.74 với 13/40 ảnh dưới
    0.5. Khi đó hình trên web không còn trùng với hình trong báo cáo.
    """
    _, teacher_name = predictor._resolve_target_layer()
    assert teacher_name == "backbone.stages.3.blocks.-1.norm2 (notebook)"

    layer, student_name = student._resolve_target_layer()
    assert student_name == "backbone.blocks.5.0.conv (notebook)"
    assert layer is student._model.backbone.blocks[5][0].conv


def test_student_metrics_report_its_teacher():
    from app.ml.metrics import load_metrics

    m = load_metrics(Path("results"), "mobilenetv3_small_100", "mobilenetv3_small_kd")
    if m is None:
        pytest.skip("không có tệp số liệu của student")
    assert m["distilled_from"] == "caformer_s18.sail_in22k_ft_in1k"
    assert abs(m["test_accuracy"] - 0.9674157) < 1e-6
    assert m["total_params_m"] == 2.05
