# Chẩn đoán bệnh trên lá sầu riêng

Ứng dụng web cho phép tải lên ảnh lá sầu riêng và nhận chẩn đoán bệnh từ mô hình
**CAFormer-S18**, kèm bản đồ nhiệt **Grad-CAM** chỉ ra vùng ảnh mà mô hình dựa vào
để ra quyết định. Giao diện song ngữ Việt / English.

| | |
|---|---|
| **Mô hình** | `caformer_s18.sail_in22k_ft_in1k` + đầu phân loại tuỳ chỉnh |
| **Số lớp** | 5 (4 nhóm bệnh/dịch hại + lá khoẻ) |
| **Độ chính xác** | **98.54%** trên 890 ảnh test · macro F1 **0.9848** |
| **Giải thích** | Grad-CAM + khoanh vùng **WSOL** (tự hiện thực, không phụ thuộc thư viện ngoài) |
| **Trợ lý AI** | Diễn giải kết quả và trả lời câu hỏi, qua OpenRouter (tuỳ chọn) |
| **Xuất kết quả** | Tải về một ảnh PNG gồm 3 khung ảnh + chẩn đoán |
| **Backend** | FastAPI + PyTorch + timm |
| **Frontend** | HTML/CSS/JS thuần, không framework, không CDN |

---

## 1. Năm lớp mô hình nhận dạng

| Mã lớp | Tiếng Việt | Tác nhân | Mức độ |
|---|---|---|---|
| `ALGAL_LEAF_SPOT` | Bệnh đốm tảo (tảo đỏ) | *Cephaleuros virescens* | Trung bình |
| `ALLOCARIDARA_ATTACK` | Rầy phấn tấn công | *Allocaridara malayensis* | Nghiêm trọng |
| `HEALTHY_LEAF` | Lá khoẻ mạnh | — | Không |
| `LEAF_BLIGHT` | Bệnh cháy lá | *Rhizoctonia solani* | Nghiêm trọng |
| `PHOMOPSIS_LEAF_SPOT` | Bệnh đốm lá Phomopsis | *Phomopsis durionis* | Trung bình |

> **Thứ tự năm lớp trên là bất biến của dự án.** Đây là thứ tự `ImageFolder` sinh ra
> lúc huấn luyện (sắp theo bảng chữ cái) và nó quyết định ý nghĩa từng chỉ số đầu ra
> của mô hình. Đổi thứ tự sẽ làm **mọi** dự đoán bị gán sai nhãn mà không báo lỗi.
> Bất biến này được khoá bằng test (`tests/test_labels.py`).

---

## 2. Chạy thử nhanh

Yêu cầu: Python 3.10+ (đã kiểm thử trên 3.12).

```bash
make setup     # tạo .venv, cài phụ thuộc, tạo .env từ .env.example
make dev       # chạy server phát triển
```

Mở http://127.0.0.1:8000

Không dùng `make` thì:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
cp .env.example .env
.venv/bin/python -m uvicorn app.main:app --reload
```

### Ảnh mẫu để thử

Thư mục `samples/` có sẵn 10 ảnh lấy từ tập test, **tên tệp chính là đáp án đúng**
(ví dụ `LEAF_BLIGHT_1.jpg`), tiện để đối chiếu nhanh khi thử giao diện.

### Chạy bằng Docker

```bash
docker compose up --build                    # http://127.0.0.1:8000
HOST_PORT=8081 docker compose up --build     # nếu cổng 8000 đã bận
```

Đã kiểm chứng: image build xong **1.68GB**, container chạy bằng user `app`
(uid 10001, không phải root), HEALTHCHECK chuyển `healthy`, chiếm **563MB RAM**,
và `/docs` trả 404 đúng như cấu hình production.

Image chỉ chép đúng trọng số đang phục vụ (90MB) chứ không chép cả 5 mô hình
(481MB), và cài bản **torch chỉ CPU** thay vì bản kèm CUDA — nếu không, riêng
runtime CUDA đã làm image phình thêm vài GB.

---

## 3. Mô hình hoạt động thế nào

### 3.1. Kiến trúc

```python
backbone   = timm.create_model("caformer_s18.sail_in22k_ft_in1k",
                               pretrained=False, num_classes=0, global_pool="avg")
classifier = nn.Sequential(
    nn.Linear(512, 512),   # 512 = số chiều đặc trưng của backbone
    nn.ReLU(),
    nn.BatchNorm1d(512),
    nn.Dropout(0.4),
    nn.Linear(512, 5),
)
```

Trọng số được nạp bằng `strict=True`: mọi sai khác về khoá đều làm dịch vụ báo lỗi
ngay lúc khởi động thay vì âm thầm chạy với trọng số khởi tạo ngẫu nhiên.

### 3.2. Tiền xử lý (phải trùng tuyệt đối với lúc huấn luyện)

```python
transforms.Resize((224, 224))                                  # ép vuông, KHÔNG center-crop
transforms.ToTensor()
transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
```

Hai chi tiết dễ làm sai và làm tụt độ chính xác mà không gây lỗi:

- Huấn luyện dùng `Resize((224, 224))` — ép ảnh về đúng hình vuông, chấp nhận méo
  tỉ lệ. Nếu đổi sang "resize cạnh ngắn rồi center-crop" (cách phổ biến hơn), ảnh
  đưa vào mô hình sẽ khác phân phối huấn luyện.
- Ảnh chụp từ điện thoại thường có cờ EXIF orientation. Ứng dụng áp dụng
  `ImageOps.exif_transpose` trước khi suy luận, nếu không mô hình sẽ nhận ảnh nằm
  ngang so với ảnh người dùng nhìn thấy.

### 3.3. Grad-CAM

Tự hiện thực trong `app/ml/gradcam.py`, lớp đích là `backbone.stages[-1]` — tầng
đặc trưng cuối trước global pooling, đầu ra `(1, 512, 7, 7)`.

Điểm đáng chú ý về hiệu năng: bản cài đặt dùng
`torch.autograd.grad(score, activation)` thay cho `score.backward()`. Grad-CAM chỉ
cần gradient **tại lớp đích**, nên autograd chỉ phải đi ngược đoạn đồ thị từ logits
về lớp đó. Dùng `backward()` sẽ lan ngược qua toàn bộ backbone và tính gradient của
mọi tham số — tốn công mà kết quả không dùng tới.

Đo trên CPU (Apple M-series, 10 nhân):

| | Trước | Sau |
|---|---|---|
| Suy luận, không Grad-CAM | 228 ms | 228 ms |
| Suy luận, có Grad-CAM | 994 ms | **218 ms** |

Nói cách khác, sau khi sửa thì Grad-CAM gần như miễn phí.

### 3.4. Khoanh vùng bệnh bằng WSOL

**Weakly Supervised Object Localization**: mô hình chỉ được huấn luyện bằng nhãn
mức ảnh ("lá này bị cháy lá"), chưa bao giờ được dạy bệnh nằm ở đâu. Nhưng bản đồ
Grad-CAM cho biết mô hình nhìn vào đâu, nên nhị phân hoá bản đồ đó rồi lấy khung
bao vùng nóng nhất là ra được vị trí — không cần một nhãn toạ độ nào.

Thuật toán giữ đúng như notebook (`app/ml/wsol.py`):

1. `mask = (cam * 255).astype(uint8)`, ngưỡng nhị phân tại **120**;
2. tìm các vùng liên thông **8 hướng**, lấy vùng **lớn nhất**;
3. bỏ qua nếu diện tích **≤ 40 điểm ảnh** (nhiễu);
4. trả khung bao của vùng đó.

Hiện thực bằng NumPy thuần thay vì OpenCV — thêm `opencv-python` chỉ để tìm khung
bao sẽ kéo theo ~60MB phụ thuộc. **Đã đối chiếu: 25/25 ảnh cho khung bao trùng
khít với bản OpenCV gốc** (sai lệch ≤ 1 pixel).

API trả về **toạ độ chuẩn hoá [0,1]** chứ không phải ảnh đã vẽ sẵn, nhờ vậy hộp
hiển thị nét ở mọi kích thước và dùng được qua API. Toạ độ chuẩn hoá cũng bất biến
với phép ép ảnh về 224×224: tỉ lệ `x/width` trong ảnh ép và ảnh gốc là như nhau,
nên client dùng thẳng, không cần quy đổi.

> **Lưu ý về lớp đích Grad-CAM.** Notebook hook vào
> `backbone.stages[3].blocks[-1].norm2`, và ứng dụng bám theo đúng lớp đó. Nếu hook
> ở đầu ra cả stage (`stages[-1]`) thì bản đồ nhiệt gần như không đổi (tương quan
> **0.98**) nhưng **khung bao lệch đáng kể** — IoU trung vị chỉ **0.79**, với 10/40
> ảnh dưới 0.5. Vì vậy phải giữ đúng lớp của notebook thì hộp trên web mới trùng
> với hình trong báo cáo. Đổi được qua `GRADCAM_TARGET_LAYER`.

---

## 4. Kiểm chứng

Pipeline suy luận của ứng dụng web được đối chiếu với kết quả huấn luyện đã lưu:

```bash
make eval DATA=/đường/dẫn/tới/dataset/test
```

Kết quả thực tế trên bộ test 890 ảnh:

| Lớp | Precision | Recall | F1 | Số ảnh |
|---|---|---|---|---|
| ALGAL_LEAF_SPOT | 0.9730 | 0.9796 | 0.9763 | 147 |
| ALLOCARIDARA_ATTACK | 0.9784 | 0.9891 | 0.9837 | 183 |
| HEALTHY_LEAF | 0.9849 | 1.0000 | 0.9924 | 196 |
| LEAF_BLIGHT | 1.0000 | 0.9947 | 0.9973 | 188 |
| PHOMOPSIS_LEAF_SPOT | 0.9883 | 0.9602 | 0.9741 | 176 |
| **Tổng** | | | **0.9848** (macro F1) | **890** |

**Độ chính xác 98.54% (877/890)** — trùng khít từng chữ số với
`results/caformer_s18_report.csv`. Nếu con số này lệch
đi sau khi bạn sửa mã, nghĩa là tiền xử lý hoặc thứ tự nhãn đã bị thay đổi.

### Chạy test

```bash
make test       # 45 test nhanh, không cần tệp trọng số
make test-all   # thêm 9 test tích hợp, cần trọng số thật
make lint
```

### 3.4b. Avatar của trợ lý

Trong lúc trợ lý sinh chữ, một avatar bot nhỏ bám ngay sau chữ cuối cùng — giống
con trỏ sinh chữ của Claude. Trả lời xong, nó **không biến mất**: chuyển sang
trạng thái đứng yên (chớp mắt, thỉnh thoảng nhảy) và dời lên cạnh nhãn
"KỸ SƯ AI", ở lại đó suốt cuộc trò chuyện.

Dùng gói [`bot-avatars`](https://libraries.dev/bots) (MIT), đã vendor vào
`web/static/vendor/`.

Gói này vốn là component React, nhưng ứng dụng không có bước build và CSP đặt
`script-src 'self'`. Thay vì kéo React vào chỉ vì một biểu tượng, ta dùng **API
canvas thuần** mà gói đó cũng xuất ra (`BotAvatarSim` + `drawBotAvatarFrame`).

Hai điểm cần biết nếu nâng cấp gói:

- Bundle ESM có đúng **hai import React** ở dòng 1–2, chỉ phục vụ component.
  Lúc vendor, hai dòng đó được trỏ sang `web/static/vendor/react-shim.js`.
  `forwardRef` phải là **no-op chạy êm** vì nó được gọi ngay lúc nạp module để
  định nghĩa component; các hàm còn lại chỉ chạy lúc render nên ném lỗi được.
- Thư viện nặng ~190KB (64KB sau gzip) nên được **nạp động** bằng `import()`,
  chỉ khi trợ lý bắt đầu trả lời. Người không dùng trò chuyện không tải gì thêm.
  Nếu nạp hỏng, giao diện tự quay về con trỏ nhấp nháy bằng CSS — avatar chỉ là
  trang trí, không được phép chặn việc đọc câu trả lời.

Mỗi lần `innerHTML` cập nhật là các nút con bị xoá sạch, nên avatar được gắn lại
sau mỗi mẩu chữ, và gắn vào **khối chữ sâu nhất ở cuối** (`<li>` trong danh sách,
không phải thẻ `<ul>` ngoài) — nếu không nó rớt xuống thành một dòng riêng.

Vì avatar ở lại sau khi trả lời xong, một cuộc trò chuyện dài sẽ có nhiều con
cùng sống. Chúng dùng **một vòng lặp `requestAnimationFrame` chung** (`avatar.js`)
chứ không phải mỗi con một vòng: chi phí không đổi dù có bao nhiêu avatar. Vòng
lặp tự tắt khi không còn con nào và khi tab bị ẩn, chạy lại khi tab hiện ra.

### 3.5. Xuất ảnh kết quả

Nút "Tải ảnh kết quả" dựng một phiếu PNG 1600px gồm ba khung ảnh (ảnh gốc, bản đồ
nhiệt, khoanh vùng kèm khung bao), tên bệnh, tác nhân, độ tin cậy và dòng cảnh báo.

Vẽ bằng canvas **phía trình duyệt** chứ không dựng ở máy chủ, vì hai lý do:

1. Ảnh gốc đã nằm sẵn trong trình duyệt. Dựng ở máy chủ nghĩa là tải ảnh lên lần
   nữa chỉ để ghép hình.
2. Chữ có dấu tiếng Việt: trình duyệt đã nạp Be Vietnam Pro và vẽ dấu thanh chuẩn.
   Làm ở máy chủ thì phải đóng gói thêm tệp `.ttf` và tự lo việc xuống dòng.

Chiều cao ảnh tính động theo số dòng của lời cảnh báo (câu này dài ngắn khác nhau
giữa tiếng Việt và tiếng Anh), nên không thừa mảng trắng ở đáy mà cũng không cắt chữ.
Lời cảnh báo được vẽ **vào trong ảnh** vì ảnh sẽ bị chia sẻ lại tách khỏi trang web.

> **Lưu ý khi sửa `app/ml/labels.py`.** Giao diện không còn hiển thị "Dấu hiệu nhận
> biết" và "Nên làm gì" (trợ lý AI đã đảm nhiệm phần này), nhưng hai trường đó
> **vẫn phải giữ** trong `labels.py` và trong phản hồi API: chúng là dữ liệu neo
> tiêm vào prompt mỗi lượt hỏi. Xoá đi là LLM mất căn cứ và bắt đầu tự nghĩ ra
> tên thuốc.

---

## 4b. Trợ lý AI (tuỳ chọn)

Sau khi chẩn đoán xong, một kỹ sư AI tự diễn giải kết quả bằng lời nông dân hiểu
được và trả lời câu hỏi tiếp theo. Tính năng này **tuỳ chọn**: không có khoá API
thì nút trợ lý ẩn hẳn, phần chẩn đoán vẫn chạy bình thường.

Giao diện là một **nút tròn nổi** ở góc dưới phải, chỉ xuất hiện khi đã có kết quả
để hỏi. Có kết quả thì bảng trò chuyện **tự bật** và trợ lý diễn giải ngay.

Vài quyết định nhỏ nhưng đáng lưu ý khi sửa phần này:

- **Tự bật nhưng không cướp con trỏ.** Người dùng đang đọc kết quả; nhảy xuống ô
  nhập liệu sẽ rất khó chịu, và trên điện thoại còn làm bàn phím bật lên che mất
  ảnh. Mở bằng nút thì mới đưa con trỏ vào ô nhập.
- **Không bám đáy khi chữ đang chảy về.** Mỗi tin nhắn mới neo phần ĐẦU lên đầu
  khung; chỉ khi người dùng tự cuộn xuống đáy mới bật chế độ bám. Nếu đo lại
  "đang ở đáy" ở mỗi mẩu thì lúc bong bóng còn rỗng điều kiện luôn đúng, và câu
  trả lời dài sẽ bị trôi mất phần mở đầu ngay khi vừa sinh ra.
- **Đóng bảng mà câu trả lời xong** thì hiện chấm đỏ trên nút.
- Bấm `Esc` để đóng, con trỏ quay về nút.

### Bật lên

1. Lấy khoá tại <https://openrouter.ai/keys>
2. Dán vào tệp `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.5-flash
```

3. Khởi động lại dịch vụ. Kiểm tra bằng `GET /api/model-info` → `"chat_available": true`.

### Vì sao LLM không bịa ra cách chữa

Rủi ro lớn nhất của việc gắn LLM vào ứng dụng nông nghiệp: nông dân **làm thật**
theo lời khuyên, nên một tên thuốc hay liều lượng bịa ra là gây hại thật. Vì vậy
mô hình không được tự nghĩ biện pháp:

- Toàn bộ triệu chứng và hướng xử lý trong `app/ml/labels.py` được **tiêm nguyên
  văn** vào ngữ cảnh mỗi lượt hỏi. Mô hình chỉ diễn giải lại cho dễ hiểu.
- Prompt hệ thống cấm tuyệt đối việc bịa tên thương mại, liều lượng, nồng độ pha;
  hỏi tới liều thì phải trả lời "đọc nhãn thuốc và hỏi cán bộ khuyến nông".
- Độ tin cậy gửi cho mô hình **không bao giờ làm tròn lên 100%** — nói "chắc 100%"
  sẽ khiến nó khẳng định chắc nịch về một kết quả chỉ đọc từ ảnh.
- Dưới 60% tin cậy, ngữ cảnh tự thêm cảnh báo buộc mô hình nói rõ là chưa chắc.

Các bất biến này được khoá bằng test (`tests/test_chat.py`).

### Những điểm khác đáng lưu ý

- **Khoá API chỉ nằm ở máy chủ.** Trình duyệt gọi `/api/chat` của chính ứng dụng,
  không bao giờ thấy khoá. Có test riêng kiểm tra khoá không rò ra bất kỳ phản hồi nào.
- **Trả về SSE (stream).** Chữ hiện dần sau khoảng một giây thay vì chờ trọn câu
  trả lời — khác biệt đáng kể với mạng di động ở vùng trồng.
- **Hạn mức riêng, chặt hơn** (`CHAT_RATE_LIMIT_REQUESTS`, mặc định 12/phút): mỗi
  lượt gọi LLM đều phát sinh chi phí ở nhà cung cấp, khác với endpoint chẩn đoán
  chỉ tốn CPU của chính máy chủ.
- **Không lưu trạng thái.** Lịch sử hội thoại do trình duyệt giữ và gửi kèm; máy
  chủ cắt còn `LLM_MAX_HISTORY_MESSAGES` lượt gần nhất để kiểm soát token.
- `deploy/nginx.conf` cần `proxy_buffering off` cho endpoint này, nếu không SSE bị
  gom lại rồi đẩy một lần (ứng dụng cũng gửi kèm `X-Accel-Buffering: no`).

### `POST /api/chat`

Trả về `text/event-stream`. Bỏ trống `message` nghĩa là yêu cầu diễn giải lần đầu.

```json
{ "message": "Bệnh này có lây không?", "predicted_class": "LEAF_BLIGHT",
  "confidence": 0.9999, "history": [], "lang": "vi" }
```

```
event: delta
data: {"t": "Lá của anh/chị "}

event: done
data: {"ok": true}
```

Lỗi xảy ra giữa luồng không đổi được mã HTTP nữa (header đã gửi), nên báo bằng
`event: error`.

---

## 5. API

Tài liệu tương tác tại `/docs` (chỉ bật khi `ENVIRONMENT != production`).

### `POST /api/predict`

| Tham số | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `file` | multipart | bắt buộc | Ảnh JPEG/PNG/WebP/BMP/TIFF, tối đa 10 MB |
| `lang` | query | `vi` | `vi` hoặc `en` — ngôn ngữ của tên bệnh và lời khuyên |
| `gradcam` | query | `true` | Có sinh bản đồ nhiệt hay không |

```bash
curl -X POST "http://127.0.0.1:8000/api/predict?lang=vi" \
     -F "file=@la_benh.jpg"
```

Phản hồi (rút gọn):

```json
{
  "request_id": "a1b2c3d4e5f6a7b8",
  "predicted_class": "LEAF_BLIGHT",
  "confidence": 0.9999,
  "is_healthy": false,
  "is_confident": true,
  "scores": [
    { "class_name": "LEAF_BLIGHT", "label": "Bệnh cháy lá", "probability": 0.9999 },
    { "class_name": "PHOMOPSIS_LEAF_SPOT", "label": "Bệnh đốm lá Phomopsis", "probability": 0.00005 }
  ],
  "info": {
    "name": "Bệnh cháy lá",
    "severity": "high",
    "pathogen": "Rhizoctonia solani",
    "summary": "...",
    "symptoms": ["..."],
    "actions": ["..."]
  },
  "inference_ms": 231.6,
  "gradcam_png_b64": "iVBORw0KGgo...",
  "bbox": { "x": 0.138, "y": 0.138, "width": 0.152, "height": 0.152, "area_ratio": 0.015 },
  "warnings": [],
  "disclaimer": "Kết quả chỉ mang tính tham khảo..."
}
```

`scores` luôn có đủ 5 lớp, sắp xếp giảm dần, tổng bằng 1.

`bbox` là khung bao WSOL, toạ độ chuẩn hoá [0,1] so với chiều rộng/cao của ảnh;
`null` khi vùng nóng quá nhỏ hoặc phân tán. `area_ratio` là tỉ lệ diện tích vùng
nóng trên toàn ảnh — cho biết mô hình tập trung hay dàn trải.

### Các endpoint khác

| Endpoint | Mục đích |
|---|---|
| `GET /healthz` | Liveness — 200 khi tiến trình còn sống |
| `GET /readyz` | Readiness — 200 khi mô hình đã nạp, **503** khi chưa |
| `GET /api/model-info` | Metadata và số liệu đánh giá của mô hình |

### Lỗi

Mọi lỗi đều trả về cùng một hình dạng:

```json
{ "error": { "code": "invalid_image", "message": "...", "request_id": "..." } }
```

| Mã HTTP | `code` | Khi nào |
|---|---|---|
| 422 | `invalid_image` | Không phải ảnh, sai định dạng, hoặc vượt giới hạn kích thước |
| 422 | `validation_error` | Thiếu tệp, hoặc `lang` không hợp lệ |
| 429 | `rate_limit_exceeded` | Vượt hạn mức (kèm header `Retry-After`) |
| 503 | `model_unavailable` | Mô hình chưa nạp xong hoặc nạp thất bại |

---

## 6. Cấu hình

Tất cả qua biến môi trường hoặc tệp `.env` — xem `.env.example` để biết danh sách
đầy đủ kèm chú thích.

| Biến | Mặc định | Ghi chú |
|---|---|---|
| `ENVIRONMENT` | `production` | `production` sẽ ẩn `/docs`, `/redoc`, `/openapi.json` |
| `MODEL_PATH` | `models/caformer_s18_best.pth` | Đường dẫn tương đối được neo vào gốc dự án, không phụ thuộc thư mục làm việc |
| `DEVICE` | `auto` | `auto` chọn CUDA nếu có. Không tự chọn `mps` vì một số toán tử chưa ổn định; ép được bằng `DEVICE=mps` |
| `MAX_UPLOAD_BYTES` | `10485760` | 10 MB |
| `TORCH_NUM_THREADS` | `0` | `0` = để torch tự quyết. **Đặt `1` khi chạy nhiều worker** |
| `GRADCAM_TARGET_LAYER` | *(trống)* | Trống = tự dò `stages[-1].blocks[-1].norm2` như notebook |
| `ENABLE_WSOL` | `true` | Bật khoanh vùng bệnh suy ra từ bản đồ nhiệt |
| `OPENROUTER_API_KEY` | *(trống)* | Trống = tắt hẳn trợ lý AI |
| `OPENROUTER_MODEL` | `google/gemini-2.5-flash` | Mô hình trên OpenRouter |
| `LLM_MAX_HISTORY_MESSAGES` | `12` | Số lượt gần nhất gửi lại cho LLM |
| `CHAT_RATE_LIMIT_REQUESTS` | `12` | Hạn mức chat mỗi phút, chặt hơn chẩn đoán |
| `CORS_ALLOW_ORIGINS` | `*` | Đặt tên miền cụ thể khi chạy công khai |
| `TRUSTED_PROXY_COUNT` | `0` | Đặt `1` khi chạy sau nginx, để đọc đúng IP từ `X-Forwarded-For` |

---

## 7. Triển khai công khai

```bash
echo "PUBLIC_HOST=ten-mien-cua-ban.vn" > .env
# đặt fullchain.pem và privkey.pem vào deploy/certs/
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Cấu trúc: nginx kết thúc TLS và đứng trước, container API **không** publish cổng
ra ngoài. `deploy/nginx.conf` lo chuyển hướng HTTPS, chặn request quá lớn trước khi
chúng tới tầng Python, giới hạn tần suất, và nới timeout cho suy luận trên CPU.

### Lưu ý khi chọn số worker

Mỗi worker uvicorn nạp **một bản mô hình riêng** (~500MB RAM). Số worker vì vậy bị
giới hạn bởi RAM chứ không phải số nhân CPU. Đồng thời, phải đặt
`TORCH_NUM_THREADS=1`: nếu để mặc định, mỗi worker sẽ cố chiếm hết số nhân và các
worker tranh CPU của nhau, tổng thông lượng còn thấp hơn chạy một worker.

### Năng lực phục vụ (đo thực tế)

Đo trên CPU Apple M-series 10 nhân, 1 worker, có bật Grad-CAM:

| Số request song song | Thông lượng | p50 độ trễ | p95 độ trễ |
|---|---|---|---|
| 1 | 3.3 req/s | 301 ms | 319 ms |
| 4 | 4.4 req/s | 889 ms | 932 ms |
| 8 | 4.3 req/s | 1772 ms | 1973 ms |

Thông lượng bão hoà quanh **~4.3 request/giây cho mỗi worker**: suy luận được tuần
tự hoá bằng lock (xem `DurianPredictor`), nên gửi thêm request song song chỉ làm
xếp hàng dài thêm chứ không tăng thông lượng. Muốn phục vụ nhiều hơn thì thêm
worker (mỗi worker +500MB RAM) hoặc chuyển sang GPU.

Bộ nhớ ổn định: RSS giữ nguyên 421MB sau 120 request liên tiếp có Grad-CAM —
không rò rỉ. Tất cả request đều trả đúng kết quả ở mọi mức song song (24/24).

### Giới hạn tần suất

Ứng dụng có sẵn bộ đếm trong RAM, nhưng **bộ đếm này riêng cho từng tiến trình**:
chạy N worker thì hạn mức thực tế là `RATE_LIMIT_REQUESTS × N`. Vì vậy khi chạy
công khai, hãy coi giới hạn ở nginx (`deploy/nginx.conf`) là lớp chính; muốn một
hạn mức dùng chung chính xác thì cần chuyển bộ đếm sang Redis.

---

## 8. Cấu trúc dự án

```
├── app/
│   ├── main.py            # Khởi tạo FastAPI, lifespan nạp mô hình, middleware
│   ├── config.py          # Cấu hình qua biến môi trường (pydantic-settings)
│   ├── deps.py            # Trạng thái dùng chung, dependency injection
│   ├── errors.py          # Chuyển lỗi thành JSON thống nhất
│   ├── schemas.py         # Hợp đồng dữ liệu của API
│   ├── ratelimit.py       # Giới hạn tần suất theo IP
│   ├── logging_config.py  # Log JSON cho production
│   ├── genai/
│   │   ├── client.py      # OpenRouter, đọc luồng SSE
│   │   └── prompts.py     # Prompt hệ thống + ngữ cảnh neo vào labels.py
│   ├── ml/
│   │   ├── model.py       # Kiến trúc; nạp trọng số strict=True
│   │   ├── predictor.py   # Tiền xử lý, suy luận, dựng ảnh overlay
│   │   ├── gradcam.py     # Grad-CAM tự hiện thực
│   │   ├── wsol.py        # Khoanh vùng WSOL (NumPy thuần, khớp OpenCV)
│   │   ├── labels.py      # 5 nhãn + thông tin bệnh song ngữ
│   │   └── metrics.py     # Đọc số liệu từ results/
│   └── routes/            # health.py, predict.py, chat.py
├── web/                   # Giao diện: index.html + CSS/JS thuần
├── models/                # Trọng số CAFormer-S18 đang phục vụ
├── results/               # Số liệu đánh giá đã lưu của cả 5 mô hình
├── tests/                 # 54 test (45 nhanh + 9 tích hợp)
├── scripts/               # dev.sh, serve.sh, evaluate.py
├── deploy/                # nginx.conf, docker-compose.prod.yml
└── Dockerfile
```

Nội dung chuyên môn (tên bệnh, triệu chứng, hướng xử lý) chỉ nằm **một nơi duy
nhất** là `app/ml/labels.py` và được server trả về theo tham số `lang`. Frontend
chỉ dịch phần vỏ giao diện (`web/static/js/i18n.js`), nhờ vậy không có nguy cơ hai
bản nội dung lệch nhau.

---

## 9. Những điều hệ thống **không** làm

- **Không** nhận dạng được bệnh ngoài 5 nhóm đã huấn luyện, và đây là điểm yếu
  lớn nhất của hệ thống. Đã đo cụ thể bằng 300 ảnh biển báo giao thông (hoàn toàn
  ngoài phạm vi):

  | | Ảnh lá thật | Ảnh biển báo giao thông |
  |---|---|---|
  | Độ tin cậy trung vị | 99.97% | **98.19%** |
  | Tỉ lệ vượt 99% | — | **43.3%** |

  Nói cách khác, mô hình **tự tin y hệt** khi gặp ảnh hoàn toàn không liên quan.
  Một ảnh màu xanh trơn cũng bị gán `LEAF_BLIGHT` với độ tin cậy 100%.

  Đã thử dùng **energy score** (`-logsumexp(logits)`) làm bộ lọc ảnh ngoài phạm vi
  nhưng **không dùng được**: AUROC chỉ đạt **0.5445**, tức gần như đoán mò. Vì vậy
  hệ thống cố tình **không** cài bộ lọc nào — thà không có còn hơn có một bộ lọc
  tạo cảm giác an toàn giả. Muốn xử lý triệt để thì phải can thiệp ở khâu huấn
  luyện: thêm một lớp "không phải lá sầu riêng" với dữ liệu âm tính.

  Ngưỡng cảnh báo 60% trên giao diện chỉ bắt được trường hợp mô hình tự thấy phân
  vân, **không** phải cơ chế phát hiện ảnh ngoài phạm vi.
- **Không** chẩn đoán bệnh trên trái, thân hay rễ — mô hình chỉ học trên ảnh lá.
- **Không** có xác thực người dùng, tài khoản hay phân quyền.
- **Không** lưu ảnh người dùng tải lên: ảnh chỉ nằm trong RAM trong lúc xử lý.
- **Không** có cơ sở dữ liệu; mỗi request độc lập với nhau.
- Bản đồ nhiệt Grad-CAM cho biết **mô hình nhìn vào đâu**, không phải **mức độ nặng
  của bệnh**. Độ phân giải của nó là 7×7 ô rồi nội suy lên, nên vùng nóng luôn thô.
- Khung bao WSOL kế thừa đúng hạn chế đó: nó là khung bao của **vùng mô hình chú ý**,
  không phải ranh giới thật của vết bệnh, và cũng chỉ khoanh **một** vùng lớn nhất
  dù trên lá có nhiều vết. Đừng dùng nó để đo diện tích tổn thương.

> ⚠️ Kết quả chẩn đoán chỉ mang tính tham khảo. Hãy đối chiếu thực địa hoặc hỏi ý
> kiến cán bộ khuyến nông trước khi quyết định xử lý.

---

## 10. Ghi chú cho người tiếp nhận dự án

Kiến trúc mô hình và các tham số tiền xử lý trong `app/ml/` được đối chiếu ngược
với chính tệp trọng số để chắc chắn khớp với lúc huấn luyện: khoá
`classifier.2.running_mean` xác nhận lớp BatchNorm1d, `classifier.4.weight` có
shape `(5, 512)` xác nhận 5 lớp đầu ra, và `running_mean >= 0` ở mọi kênh xác nhận
hàm kích hoạt là ReLU chứ không phải GELU. Sau đó toàn bộ pipeline được chạy lại
trên tập test và cho ra đúng 98.54% như báo cáo gốc.

Cả năm mô hình huấn luyện cùng đợt đều đã được kiểm chứng nạp đúng và tái lập đúng
số liệu đã báo cáo (`results/summary_table.csv`):

| Mô hình | Độ chính xác | Macro F1 |
|---|---|---|
| **caformer_s18** (đang phục vụ) | **98.54%** | **0.9848** |
| maxvit_tiny_tf_224 | 98.43% | 0.9836 |
| deit_small_patch16_224 | 98.09% | 0.9802 |
| swin_tiny_patch4_window7_224 | 97.75% | 0.9762 |
| vit_small_patch16_224 | 96.74% | 0.9664 |

Kho này chỉ kèm trọng số của mô hình đang phục vụ (`models/caformer_s18_best.pth`);
bốn mô hình còn lại nặng hơn 400MB nên không đưa vào git.
Muốn đổi sang mô hình khác, sửa `BACKBONE_NAME` và `MODEL_PATH` trong `.env`. Kiến
trúc đầu phân loại giống hệt nhau ở cả năm mô hình nên không cần sửa mã; riêng lớp
đích của Grad-CAM được chọn tự động (`stages[-1]`, lùi về `blocks[-1]` cho ViT/DeiT)
và `app/ml/gradcam.py` đã xử lý sẵn ba kiểu bố cục tensor (NCHW, NHWC, chuỗi token).
