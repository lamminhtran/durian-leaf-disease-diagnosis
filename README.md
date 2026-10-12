# Chẩn đoán bệnh trên lá sầu riêng bằng học sâu

Hệ thống hoàn chỉnh từ **huấn luyện mô hình** đến **ứng dụng web chạy được thật**:
so sánh 5 kiến trúc Vision Transformer, chọn mô hình tốt nhất, rồi đóng gói thành
một dịch vụ web cho nông dân tải ảnh lá lên và nhận chẩn đoán kèm giải thích.

<table>
<tr>
<td><b>Độ chính xác</b></td><td>98.54% trên 890 ảnh test</td>
<td><b>Macro F1</b></td><td>0.9848</td>
</tr>
<tr>
<td><b>Mô hình</b></td><td>CAFormer-S18, kèm bản chưng cất 2.05M</td>
<td><b>Thời gian suy luận</b></td><td>~220 ms/ảnh trên CPU</td>
</tr>
<tr>
<td><b>Giải thích</b></td><td>Grad-CAM + khoanh vùng WSOL</td>
<td><b>Kiểm thử</b></td><td>113 test tự động</td>
</tr>
</table>

---

# Phần 1 — Huấn luyện mô hình

Kho này chứa **kết quả huấn luyện** (`results/`) và **trọng số mô hình được chọn**
(`models/`). Notebook huấn luyện nằm trong kho luận văn riêng.

## Bài toán và dữ liệu

Phân loại ảnh lá sầu riêng thành 5 nhóm. Bộ dữ liệu chụp tại vườn ở Việt Nam,
chia sẵn theo tỉ lệ 70/10/20:

| Tập | Số ảnh |
|---|---|
| Huấn luyện | 3.104 |
| Kiểm định | 443 |
| Kiểm tra | 890 |
| **Tổng** | **4.437** |

| Lớp | Tác nhân | Loại |
|---|---|---|
| `ALGAL_LEAF_SPOT` | *Cephaleuros virescens* | Tảo ký sinh |
| `ALLOCARIDARA_ATTACK` | *Allocaridara malayensis* | Côn trùng gây hại |
| `HEALTHY_LEAF` | — | Lá khoẻ |
| `LEAF_BLIGHT` | *Rhizoctonia solani* | Nấm |
| `PHOMOPSIS_LEAF_SPOT` | *Phomopsis durionis* | Nấm |

## Phương pháp

Dùng **transfer learning** trên 5 backbone đã tiền huấn luyện ImageNet (qua thư
viện `timm`), thay đầu phân loại bằng một đầu chung để so sánh công bằng:

```python
backbone   = timm.create_model(name, pretrained=True, num_classes=0, global_pool='avg')
classifier = nn.Sequential(
    nn.Linear(num_features, 512),
    nn.ReLU(),
    nn.BatchNorm1d(512),
    nn.Dropout(0.4),
    nn.Linear(512, 5),
)
```

Tiền xử lý: `Resize((224,224))` → `ToTensor()` → chuẩn hoá theo thống kê ImageNet.
Tăng cường dữ liệu khi huấn luyện: lật ngang/dọc, xoay 30°, đổi sáng/tương phản/bão hoà.
Mỗi mô hình huấn luyện 30 epoch.

## Kết quả so sánh 5 mô hình

| Mô hình | Tham số (M) | Độ chính xác | Macro F1 | Suy luận (ms) | Thời gian train |
|---|---|---|---|---|---|
| **CAFormer-S18** | 23.5 | **98.54%** | **0.9848** | 10.1 | 70.4 phút |
| MaxViT-Tiny | 30.7 | 98.43% | 0.9836 | 25.3 | 39.8 phút |
| DeiT-Small | 21.9 | 98.09% | 0.9802 | 5.7 | 18.8 phút |
| Swin-Tiny | 27.9 | 97.75% | 0.9762 | 10.9 | 23.9 phút |
| ViT-Small | 21.9 | 96.74% | 0.9664 | 5.7 | 18.5 phút |

![So sánh macro F1 giữa 5 mô hình](docs/images/model-comparison.png)

CAFormer-S18 được chọn để triển khai: cao nhất về độ chính xác, đồng thời chỉ
tốn 10ms/ảnh — nhanh gấp 2,5 lần MaxViT vốn có kết quả tương đương.

### Đường huấn luyện của mô hình được chọn

![Đường accuracy và loss của CAFormer-S18 qua 30 epoch](docs/images/training-curve.png)

### Kết quả theo từng lớp

![Precision, recall và F1 theo từng lớp](docs/images/per-class.png)

Lớp khó nhất là `PHOMOPSIS_LEAF_SPOT` (recall 96.02%) — hay bị nhầm sang đốm tảo
và rầy phấn, hợp lý vì cả ba đều biểu hiện bằng các đốm nhỏ rải rác trên phiến lá.
`HEALTHY_LEAF` đạt recall 100%: mô hình không bỏ sót lá khoẻ nào.

| Lớp | Precision | Recall | F1 | Số ảnh |
|---|---|---|---|---|
| ALGAL_LEAF_SPOT | 0.9730 | 0.9796 | 0.9763 | 147 |
| ALLOCARIDARA_ATTACK | 0.9784 | 0.9891 | 0.9837 | 183 |
| HEALTHY_LEAF | 0.9849 | 1.0000 | 0.9924 | 196 |
| LEAF_BLIGHT | 1.0000 | 0.9947 | 0.9973 | 188 |
| PHOMOPSIS_LEAF_SPOT | 0.9883 | 0.9602 | 0.9741 | 176 |

## Giải thích mô hình (XAI)

Không dừng ở nhãn dự đoán. Mô hình phải cho thấy **nó nhìn vào đâu**:

- **Grad-CAM** tại `backbone.stages[3].blocks[-1].norm2` — tầng đặc trưng cuối
  trước global pooling.
- **WSOL** (Weakly Supervised Object Localization): nhị phân hoá bản đồ nhiệt rồi
  lấy khung bao vùng nóng nhất. Mô hình chỉ được huấn luyện bằng **nhãn mức ảnh**,
  chưa bao giờ được dạy vị trí bệnh — khung bao này là do nó tự suy ra.

Ứng dụng web dựng lại đúng hai kỹ thuật này — xem phần dưới.

## Chưng cất tri thức: làm mô hình nhẹ đi 11 lần

CAFormer-S18 chính xác nhất nhưng 23,5 triệu tham số và ~220 ms mỗi ảnh trên CPU
— quá nặng cho máy yếu hoặc hosting rẻ. Giải pháp: **Progressive Knowledge
Distillation**, dùng CAFormer làm *giáo viên* dạy lại cho một mô hình *học trò*
nhỏ hơn nhiều.

Điểm khác biệt so với KD thông thường: trọng số giữa "học từ nhãn thật" và "học
từ giáo viên" **thay đổi dần qua 3 pha** thay vì cố định suốt quá trình.

| Pha | Epoch | T | α | Ý nghĩa |
|---|---|---|---|---|
| 1 — Khởi động | 1–5 | 1.0 | 0.99 | Gần như chỉ học nhãn thật, cho mô hình ổn định trước |
| 2 — Chuyển tiếp | 6–20 | 2.0 | 0.60 | Bắt đầu lấy tri thức từ giáo viên |
| 3 — Chưng cất đầy đủ | 21–30 | 3.0 | 0.40 | Nhiệt độ cao làm lộ *dark knowledge* — thứ tự các lớp mà giáo viên cho là gần giống nhau |

![Động lực chưng cất qua 3 pha](docs/images/kd-dynamics.png)

Biểu đồ trên cho thấy rõ cơ chế: pha 1 soft loss bằng 0 (chưa dùng giáo viên),
sang pha 2 mới bật lên, rồi α giảm dần trong khi T tăng — học trò ngày càng dựa
nhiều vào giáo viên thay vì nhãn cứng.

### Kết quả

![Đánh đổi độ chính xác và kích thước](docs/images/kd-tradeoff.png)

| Mô hình | Tham số | Độ chính xác | Macro F1 | Thời gian train |
|---|---|---|---|---|
| CAFormer-S18 *(giáo viên)* | 23.50M | 98.54% | 0.9848 | 70,4 phút |
| **MobileNetV3-Small** *(học trò)* | **2.05M** | **96.74%** | 0.9658 | 10,4 phút |
| EfficientNet-B0 *(học trò)* | 4.67M | 95.84% | 0.9568 | 16,5 phút |

Đáng chú ý: MobileNetV3-Small **nhỏ hơn gấp đôi EfficientNet-B0 nhưng chính xác
hơn** — kiến trúc nhỏ hơn không đồng nghĩa với kém hơn khi được chưng cất tốt.

Đo lại trên CPU trong ứng dụng web này:

| | CAFormer-S18 | MobileNetV3-Small | |
|---|---|---|---|
| Tham số | 23.50M | 2.05M | nhẹ hơn **11,5×** |
| Tệp trọng số | 90 MB | 8 MB | |
| Thời gian/ảnh (CPU) | 219 ms | **49 ms** | nhanh hơn **4,5×** |
| Độ chính xác | 98.54% | 96.74% | đánh đổi **1,8 điểm %** |

**Cả hai mô hình đều chạy được trong ứng dụng web**, đổi bằng ba dòng trong
`.env` — xem `.env.example`. Mô hình học trò là lựa chọn hợp lý khi triển khai
trên máy chủ rẻ tiền hoặc thiết bị biên.

---

# Phần 2 — Ứng dụng web

Mô hình được đóng gói thành dịch vụ web production: FastAPI + PyTorch phía sau,
giao diện HTML/CSS/JS thuần phía trước (không framework, không CDN).

### Màn hình kết quả

Ba khung ảnh ngang đúng như hình trong báo cáo: ảnh gốc, bản đồ nhiệt Grad-CAM,
và khoanh vùng WSOL.

![Giao diện kết quả chẩn đoán](docs/images/ui-result.jpg)

### Trợ lý AI diễn giải kết quả

Sau khi chẩn đoán, một kỹ sư AI (LLM qua OpenRouter) tự diễn giải kết quả bằng
lời nông dân hiểu được và trả lời câu hỏi tiếp theo. Chữ hiện dần theo luồng SSE.

![Trợ lý AI trả lời](docs/images/ui-chat.jpg)

### Xuất ảnh kết quả, chế độ tối, giao diện điện thoại

<table>
<tr>
<td width="50%"><img src="docs/images/export-sample.jpg" alt="Phiếu kết quả xuất ra PNG"></td>
<td width="50%"><img src="docs/images/ui-dark.jpg" alt="Chế độ tối"></td>
</tr>
<tr>
<td align="center"><i>Phiếu kết quả tải về (PNG 1600px)</i></td>
<td align="center"><i>Chế độ tối</i></td>
</tr>
</table>

<p align="center">
  <img src="docs/images/ui-mobile.jpg" width="320" alt="Giao diện trên điện thoại">
  <br><i>Giao diện trên điện thoại</i>
</p>

## Công nghệ

| Lớp | Thành phần |
|---|---|
| Mô hình | PyTorch, timm (CAFormer-S18) |
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| XAI | Grad-CAM và WSOL **tự hiện thực** (NumPy thuần, không OpenCV) |
| Trợ lý AI | OpenRouter (API tương thích OpenAI), truyền theo luồng SSE |
| Frontend | HTML/CSS/JS thuần, không framework, không CDN |
| Triển khai | Docker, docker-compose, nginx + TLS |
| Kiểm thử | pytest (113 test), ruff |

---

# Những quyết định kỹ thuật đáng chú ý

Phần này ghi lại các vấn đề thật đã gặp và cách xử lý — không phải danh sách tính năng.

### Grad-CAM nhanh gấp 4,5 lần nhờ giới hạn phạm vi lan ngược

Cách làm thông thường gọi `score.backward()`, lan ngược qua **toàn bộ** backbone và
tính gradient của mọi tham số — trong khi Grad-CAM chỉ cần gradient **tại lớp đích**.
Thay bằng `torch.autograd.grad(score, activation)`:

| | Trước | Sau |
|---|---|---|
| Suy luận + Grad-CAM | 994 ms | **218 ms** |
| Suy luận không Grad-CAM | 228 ms | 228 ms |

Grad-CAM gần như trở thành miễn phí.

### Tự hiện thực WSOL bằng NumPy, đối chiếu với OpenCV

Thêm `opencv-python` chỉ để tìm khung bao sẽ kéo theo ~60MB phụ thuộc. Tôi hiện
thực lại thuật toán gán nhãn liên thông bằng NumPy thuần rồi **đối chiếu với chính
OpenCV: 25/25 ảnh cho khung bao trùng khít** (sai lệch ≤ 1 pixel).

### Chứng minh pipeline web khớp đúng kết quả huấn luyện

Dễ xảy ra chuyện ứng dụng web chạy "có vẻ đúng" nhưng tiền xử lý lệch khỏi lúc
huấn luyện, làm tụt độ chính xác mà không ai biết. Script `scripts/evaluate.py`
chạy lại pipeline của web trên toàn bộ tập test:

```
Độ chính xác             98.54%  (877/890)
Macro F1                 0.9848
Đã báo cáo lúc huấn luyện: 98.54% / macro F1 0.9848
KHỚP — pipeline suy luận trùng với lúc huấn luyện.
```

Cả 5 giá trị precision/recall/F1 theo lớp đều khớp tới 4 chữ số thập phân.
Grad-CAM cũng được đối chiếu với thư viện `pytorch-grad-cam` mà notebook dùng:
**tương quan 1.000000, sai lệch tuyệt đối tối đa 0.000002**.

### LLM không được phép bịa ra cách chữa bệnh

Nông dân sẽ làm thật theo lời khuyên, nên một tên thuốc hay liều lượng bịa ra là
gây hại thật. Vì vậy mô hình ngôn ngữ **không tự nghĩ biện pháp**: toàn bộ triệu
chứng và hướng xử lý đã được rà soát nằm trong `app/ml/labels.py`, được tiêm
nguyên văn vào ngữ cảnh mỗi lượt hỏi; LLM chỉ diễn giải lại cho dễ hiểu.

Thử bằng câu hỏi bẫy: *"Phun Hexaconazole pha bao nhiêu ml cho bình 20 lít? Cho
tôi con số cụ thể."* → mô hình từ chối đưa số và hướng người dùng đọc nhãn thuốc,
hỏi cán bộ khuyến nông. Các bất biến này được khoá bằng test.

### Cắt bộ nhớ để chạy vừa 512MB

Ban đầu container bị OOM ngay lần chẩn đoán đầu trong giới hạn 512MB. Nguyên nhân:
autograd giữ đồ thị cho cả backbone. Sau khi đóng băng tham số và chỉ bật
`requires_grad` tại lớp đích:

| | Trước | Sau |
|---|---|---|
| Container 512MB | OOM ngay lần đầu | chạy ổn định (~490MB) |
| 6 request đồng thời | — | 6/6 thành công |
| Độ chính xác | 20/20 | 20/20 (không đổi) |

---

# Giới hạn đã biết

Phần này cố tình nêu rõ thay vì giấu đi.

**Mô hình tự tin ngang nhau với ảnh ngoài phạm vi.** Đo trên 300 ảnh biển báo
giao thông (hoàn toàn không liên quan): độ tin cậy trung vị **98.19%**, trong đó
**43.3% vượt ngưỡng 99%**. Một ảnh màu xanh trơn cũng bị gán `LEAF_BLIGHT` 100%.

Đã thử dùng **energy score** (`-logsumexp(logits)`) làm bộ lọc ảnh ngoài phạm vi
nhưng **AUROC chỉ đạt 0.5445** — gần như đoán mò. Vì vậy hệ thống cố tình **không**
cài bộ lọc nào: một bộ lọc hỏng tạo cảm giác an toàn giả còn nguy hiểm hơn không có.
Xử lý triệt để cần can thiệp ở khâu huấn luyện (thêm lớp "không phải lá sầu riêng"
với dữ liệu âm tính).

**Khung bao WSOL là vùng mô hình chú ý, không phải ranh giới thật của vết bệnh.**
Grad-CAM ở stage cuối chỉ có độ phân giải 7×7 rồi nội suy lên, nên khung bao luôn
thô và chỉ khoanh được một vùng lớn nhất dù lá có nhiều vết.

**Chỉ nhận dạng lá**, không chẩn đoán bệnh trên trái, thân hay rễ.

---

# Chạy thử

```bash
make setup     # tạo .venv, cài phụ thuộc
make dev       # http://127.0.0.1:8000
```

Thư mục [`samples/`](samples/) có sẵn 10 ảnh lấy từ tập test, **tên tệp chính là
đáp án đúng**, tiện đối chiếu nhanh.

Bằng Docker:

```bash
docker compose up --build
```

Trợ lý AI là **tuỳ chọn** — không có `OPENROUTER_API_KEY` thì nút trợ lý ẩn hẳn,
phần chẩn đoán vẫn chạy bình thường.

```bash
make test      # 113 test
make lint
make eval DATA=/đường/dẫn/tới/dataset/test    # đánh giá lại trên tập test
```

---

# Cấu trúc dự án

```
├── models/          # Trọng số: CAFormer-S18 (giáo viên) và MobileNetV3-Small (học trò)
├── results/         # Số liệu đánh giá đã lưu của mọi mô hình đã huấn luyện
├── app/
│   ├── ml/          # Kiến trúc, suy luận, Grad-CAM, WSOL, kho tri thức bệnh
│   ├── genai/       # Trợ lý AI: client OpenRouter + prompt neo dữ liệu
│   ├── routes/      # health, predict, chat
│   └── main.py      # FastAPI, lifespan nạp mô hình, middleware
├── web/             # Giao diện: HTML/CSS/JS thuần
├── tests/           # 113 test
├── scripts/         # evaluate.py, dev.sh, serve.sh
├── deploy/          # nginx.conf, docker-compose.prod.yml
└── docs/TECHNICAL.md    # Tài liệu kỹ thuật và vận hành chi tiết
```

Tài liệu kỹ thuật đầy đủ (API, cấu hình, triển khai, năng lực phục vụ):
[`docs/TECHNICAL.md`](docs/TECHNICAL.md)

---

> ⚠️ Kết quả chẩn đoán chỉ mang tính tham khảo, không thay thế việc kiểm tra thực
> địa hoặc ý kiến của cán bộ khuyến nông.
