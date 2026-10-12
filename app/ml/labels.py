"""Nhãn lớp và thông tin bệnh (song ngữ Việt/Anh).

QUAN TRỌNG: thứ tự trong CLASS_NAMES phải giữ nguyên tuyệt đối. Đây là thứ tự
`torchvision.datasets.ImageFolder` sinh ra khi huấn luyện (sắp xếp theo bảng chữ cái),
nên nó quyết định ý nghĩa của từng chỉ số đầu ra trong lớp cuối của mô hình.
Đổi thứ tự ở đây sẽ làm mọi dự đoán bị gán sai nhãn mà không báo lỗi.
"""

from __future__ import annotations

from typing import Final

CLASS_NAMES: Final[tuple[str, ...]] = (
    "ALGAL_LEAF_SPOT",
    "ALLOCARIDARA_ATTACK",
    "HEALTHY_LEAF",
    "LEAF_BLIGHT",
    "PHOMOPSIS_LEAF_SPOT",
)

NUM_CLASSES: Final[int] = len(CLASS_NAMES)

# Lớp "lá khoẻ" — dùng để quyết định hiển thị cảnh báo hay không.
HEALTHY_CLASS: Final[str] = "HEALTHY_LEAF"

# Thông tin tham khảo cho từng lớp. `severity` chỉ dùng để tô màu giao diện.
DISEASE_INFO: Final[dict[str, dict]] = {
    "ALGAL_LEAF_SPOT": {
        "severity": "moderate",
        "pathogen": "Cephaleuros virescens",
        "vi": {
            "name": "Bệnh đốm tảo (tảo đỏ)",
            "pathogen_label": "Tảo ký sinh Cephaleuros virescens",
            "summary": (
                "Tảo ký sinh tạo các đốm tròn nhô lên trên mặt lá, phủ lớp lông "
                "mịn màu xanh xám rồi chuyển nâu đỏ như rỉ sắt. Bệnh làm giảm "
                "diện tích quang hợp, thường nặng ở vườn rậm rạp, ẩm và ít nắng."
            ),
            "symptoms": [
                "Đốm tròn 3-8 mm, hơi nhô lên khỏi mặt lá.",
                "Bề mặt đốm có lớp lông nhung, ban đầu xanh xám sau nâu đỏ.",
                "Đốm tập trung ở mặt trên của lá già, lá tầng dưới.",
                "Cạo nhẹ thì lớp tảo bong ra, để lại vết hoại tử nông.",
            ],
            "actions": [
                "Tỉa cành tạo tán cho vườn thông thoáng, tăng ánh sáng và giảm ẩm.",
                "Thu gom, tiêu huỷ lá bệnh rụng để giảm nguồn lây.",
                "Tránh tưới phun lên tán lá vào chiều muộn.",
                "Có thể dùng thuốc gốc đồng (Bordeaux, Copper oxychloride) theo liều khuyến cáo trên nhãn.",
            ],
        },
        "en": {
            "name": "Algal leaf spot (red rust)",
            "pathogen_label": "Parasitic alga Cephaleuros virescens",
            "summary": (
                "A parasitic alga forms raised circular spots covered by a velvety "
                "greenish-grey layer that turns rusty red-brown. It reduces "
                "photosynthetic area and thrives in dense, humid, shaded orchards."
            ),
            "symptoms": [
                "Circular spots 3-8 mm, slightly raised above the leaf surface.",
                "Velvety spot surface, greenish-grey turning rusty red-brown.",
                "Concentrated on upper surfaces of older, lower-canopy leaves.",
                "The algal layer scrapes off, leaving a shallow necrotic scar.",
            ],
            "actions": [
                "Prune to open the canopy, increasing light and reducing humidity.",
                "Collect and destroy fallen diseased leaves to cut inoculum.",
                "Avoid overhead irrigation onto foliage in late afternoon.",
                "Copper-based products (Bordeaux mixture, copper oxychloride) may be used at label rates.",
            ],
        },
    },
    "ALLOCARIDARA_ATTACK": {
        "severity": "high",
        "pathogen": "Allocaridara malayensis",
        "vi": {
            "name": "Rầy phấn tấn công",
            "pathogen_label": "Côn trùng gây hại Allocaridara malayensis",
            "summary": (
                "Rầy phấn sầu riêng (rầy nhảy) hút nhựa ở lá non, tiết dịch và sáp "
                "trắng. Lá non bị hại sẽ nhăn, cháy mép, xoăn rồi rụng hàng loạt — "
                "đây là tác nhân gây hại, không phải bệnh do nấm."
            ),
            "symptoms": [
                "Sáp trắng như bông và dịch ngọt trên lá, chồi non.",
                "Lá non nhăn, mép cháy khô, cong xoăn và rụng sớm.",
                "Nấm bồ hóng đen phát triển trên lớp dịch ngọt.",
                "Thấy rầy trưởng thành nhảy đi khi chạm vào chồi.",
            ],
            "actions": [
                "Kiểm tra chồi non định kỳ, nhất là trong các đợt ra lá tập trung.",
                "Phun nước áp lực lên tán để rửa bớt rầy non và sáp.",
                "Bảo vệ thiên địch (bọ rùa, ong ký sinh, nhện); hạn chế phun thuốc phổ rộng.",
                "Khi mật độ cao, dùng thuốc trừ rầy luân phiên gốc tác động và tuân thủ thời gian cách ly.",
            ],
        },
        "en": {
            "name": "Psyllid (Allocaridara) attack",
            "pathogen_label": "Insect pest Allocaridara malayensis",
            "summary": (
                "The durian psyllid feeds on young leaves, excreting honeydew and "
                "white wax. Affected young leaves crinkle, scorch at the margins, "
                "curl and drop heavily. This is insect damage, not a fungal disease."
            ),
            "symptoms": [
                "Cottony white wax and sticky honeydew on leaves and young shoots.",
                "Young leaves crinkled, margins scorched, curled, dropping early.",
                "Black sooty mould growing on the honeydew.",
                "Adults visibly jumping away when shoots are disturbed.",
            ],
            "actions": [
                "Scout young shoots regularly, especially during flushing periods.",
                "Wash nymphs and wax off the canopy with a pressurised water spray.",
                "Conserve natural enemies (ladybirds, parasitic wasps, spiders); avoid broad-spectrum sprays.",
                "At high densities, rotate insecticide modes of action and observe pre-harvest intervals.",
            ],
        },
    },
    "HEALTHY_LEAF": {
        "severity": "none",
        "pathogen": None,
        "vi": {
            "name": "Lá khoẻ mạnh",
            "pathogen_label": "Không phát hiện tác nhân gây hại",
            "summary": (
                "Mô hình không tìm thấy dấu hiệu của bốn nhóm bệnh/dịch hại được "
                "huấn luyện. Lá có màu xanh đều, phiến lá nguyên vẹn."
            ),
            "symptoms": [
                "Phiến lá xanh đều, bóng, không đốm hoại tử.",
                "Mép và chóp lá nguyên vẹn, không cháy khô.",
                "Không có sáp trắng, dịch ngọt hay nấm bồ hóng.",
            ],
            "actions": [
                "Duy trì chế độ nước và dinh dưỡng cân đối.",
                "Tiếp tục theo dõi vườn định kỳ, nhất là sau mưa dài.",
                "Giữ tán thông thoáng để phòng bệnh chủ động.",
            ],
        },
        "en": {
            "name": "Healthy leaf",
            "pathogen_label": "No pest or pathogen detected",
            "summary": (
                "The model found no signs of the four trained disease/pest classes. "
                "The leaf shows uniform green colour and an intact lamina."
            ),
            "symptoms": [
                "Uniformly green, glossy lamina with no necrotic spots.",
                "Margins and tips intact, with no scorching.",
                "No white wax, honeydew or sooty mould.",
            ],
            "actions": [
                "Maintain balanced irrigation and nutrition.",
                "Continue routine scouting, especially after prolonged rain.",
                "Keep the canopy open as preventive management.",
            ],
        },
    },
    "LEAF_BLIGHT": {
        "severity": "high",
        "pathogen": "Rhizoctonia solani",
        "vi": {
            "name": "Bệnh cháy lá",
            "pathogen_label": "Nấm Rhizoctonia solani (và tác nhân tương tự)",
            "summary": (
                "Nấm gây các mảng cháy khô lan nhanh từ mép hoặc chóp lá vào trong, "
                "ranh giới ướt sẫm. Trong điều kiện ẩm, sợi nấm có thể kết dính các "
                "lá lại với nhau làm chồi non chết khô."
            ),
            "symptoms": [
                "Mảng cháy nâu xám lớn, lan từ mép hoặc chóp lá vào gân chính.",
                "Viền vết bệnh sẫm, hơi ướt, phân cách rõ với phần lá còn xanh.",
                "Lá bị dính vào nhau bởi sợi nấm trắng khi trời ẩm.",
                "Chồi non khô đen, rụng lá nhanh ở tầng dưới.",
            ],
            "actions": [
                "Cắt bỏ và tiêu huỷ ngay lá, chồi bệnh; không vứt lại trong vườn.",
                "Hạ ẩm độ tán: tỉa cành, dọn cỏ, thoát nước tốt cho gốc.",
                "Tránh tưới lên lá; tưới gốc vào buổi sáng.",
                "Phun thuốc trừ nấm theo khuyến cáo địa phương (gốc Validamycin, Hexaconazole, Azoxystrobin), luân phiên hoạt chất.",
            ],
        },
        "en": {
            "name": "Leaf blight",
            "pathogen_label": "Fungus Rhizoctonia solani (and similar agents)",
            "summary": (
                "The fungus causes large dry scorched patches spreading rapidly "
                "inward from leaf margins or tips, with a dark water-soaked edge. "
                "Under humid conditions mycelium can web leaves together, killing shoots."
            ),
            "symptoms": [
                "Large grey-brown scorched patches spreading from margin or tip to the midrib.",
                "Dark, slightly water-soaked lesion border, sharply set off from green tissue.",
                "Leaves webbed together by white mycelium in humid weather.",
                "Young shoots blackened and dry; rapid leaf drop in the lower canopy.",
            ],
            "actions": [
                "Prune and destroy affected leaves and shoots immediately; do not leave debris in the orchard.",
                "Lower canopy humidity: prune, clear weeds, improve drainage at the root zone.",
                "Avoid wetting foliage; irrigate at the base in the morning.",
                "Apply fungicides per local recommendations (validamycin, hexaconazole, azoxystrobin), rotating actives.",
            ],
        },
    },
    "PHOMOPSIS_LEAF_SPOT": {
        "severity": "moderate",
        "pathogen": "Phomopsis durionis",
        "vi": {
            "name": "Bệnh đốm lá Phomopsis",
            "pathogen_label": "Nấm Phomopsis durionis",
            "summary": (
                "Nấm tạo nhiều đốm nhỏ hình tròn đến bầu dục, tâm sáng màu rơm với "
                "quầng nâu sẫm và viền vàng. Các đốm có thể liên kết thành mảng lớn, "
                "trên tâm đốm già thấy các hạt đen nhỏ là ổ bào tử."
            ),
            "symptoms": [
                "Đốm tròn/bầu dục 2-6 mm, tâm màu rơm nhạt, viền nâu sẫm.",
                "Quầng vàng mờ bao quanh vết bệnh.",
                "Hạt đen li ti (ổ bào tử) ở tâm các đốm cũ.",
                "Đốm liên kết thành mảng khô, lá rụng sớm khi bệnh nặng.",
            ],
            "actions": [
                "Thu gom lá rụng mang tiêu huỷ để cắt vòng lây nhiễm.",
                "Tỉa tán thông thoáng, bón phân cân đối, tránh thừa đạm.",
                "Giữ lá khô: không tưới phun lên tán, nhất là buổi chiều.",
                "Phun thuốc trừ nấm phòng ngừa khi vào mùa mưa (gốc Mancozeb, Difenoconazole, Propiconazole) theo liều trên nhãn.",
            ],
        },
        "en": {
            "name": "Phomopsis leaf spot",
            "pathogen_label": "Fungus Phomopsis durionis",
            "summary": (
                "The fungus produces numerous small round to oval spots with pale "
                "straw-coloured centres, dark brown rings and yellow halos. Spots may "
                "coalesce into large patches; tiny black fruiting bodies appear in older centres."
            ),
            "symptoms": [
                "Round/oval spots 2-6 mm with pale straw centres and dark brown borders.",
                "Diffuse yellow halo surrounding each lesion.",
                "Minute black specks (pycnidia) in the centres of older spots.",
                "Spots coalescing into dry patches; early leaf drop in severe cases.",
            ],
            "actions": [
                "Collect and destroy fallen leaves to break the infection cycle.",
                "Open up the canopy; fertilise in balance and avoid excess nitrogen.",
                "Keep foliage dry: no overhead irrigation, especially in the afternoon.",
                "Apply preventive fungicides entering the rainy season (mancozeb, difenoconazole, propiconazole) at label rates.",
            ],
        },
    },
}


def class_index(name: str) -> int:
    return CLASS_NAMES.index(name)


def info_for(class_name: str, lang: str = "vi") -> dict:
    """Trả về thông tin bệnh theo ngôn ngữ, mặc định tiếng Việt nếu lang không hợp lệ."""
    entry = DISEASE_INFO[class_name]
    lang = lang if lang in ("vi", "en") else "vi"
    localized = entry[lang]
    return {
        "class_name": class_name,
        "severity": entry["severity"],
        "pathogen": entry["pathogen"],
        **localized,
    }
