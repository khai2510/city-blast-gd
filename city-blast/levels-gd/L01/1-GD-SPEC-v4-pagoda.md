# Màn 1 v4: "Five Eaves", sân chùa năm tầng mái (bước 1, GD)

20/11. Hai lý do đổi:
1. Khai: các màn chưa đạt độ chi tiết và độ phức tạp của L32.
2. Tháp đồng hồ **đã có** trong game (F01 "Old Tock", L3/L29/L34), nên không dùng lại.

Công trình cảm hứng là mục #5 trong `LANDMARKS.md`: **đền nhiều tầng mái cong châu Á**. Chỉ lấy dáng, không chép công trình thật nào.

## Chuẩn L32 áp dụng

- Dựng bằng builder riêng (`g7pagoda`) với bộ helper của toà chính (`A1.h`, `M14.api`), không dùng bộ sinh khối chung.
- Quy mô như toà chính: khoảng 40 m, 250–400 khối.
- Mọi khối kết cấu là khối vật lý; mọi chi tiết (mái cong, góc mái vểnh, lan can, đèn lồng, bàn thờ, hoa văn) là trang trí gắn lên khối vật lý.
- Trụ tầng trệt dùng bê tông cốt thép 3 nấc `hrc`, có vết nứt hiển thị (`rcDecor`), cùng luật tầng (`ring`: mất 2 trụ cạnh nhau thì tầng sập).

## Hình khối

| Phần | Kích thước | Kết cấu (khối vật lý) | Trang trí | Vai / độ khó |
|---|---|---|---|---|
| Nền đá | 22 × 22 m | neo (anchor) | bậc thềm, lan can đá, đèn đá | |
| Tầng 1 (sảnh) | 14 × 14 m, cao 7 m | 12 trụ `hrc` sơn đỏ, vách gỗ chạm, cửa kính (mglass) mặt trước; sàn chịu nổ | bàn thờ, đèn lồng sáng, cửa song gỗ | **khó**: trụ 3 nấc |
| Tầng 2–5 | 12 / 10.4 / 8.8 / 7.2 m, cao 5 m | 8 trụ gỗ mỗi tầng (một TNT một trụ), vách gỗ, sàn chịu nổ | lan can, cửa sổ tròn, đèn | **dễ đến trung bình** |
| Mái 5 tầng | đua ra 2.2 m | 4 tấm mái nặng `hard7s` mỗi tầng | mái dốc, góc vểnh, bờ nóc vàng | **phải rơi mới vỡ** (drop7) |
| Chóp đồng | 1.6 × 3.2 m | khối nặng `hard7v` | vòng vàng, búp sen | **phải rơi mới vỡ** |

**Mỗi tầng là một khối rời** (nhóm liên kết riêng), nên phá tầng nào thì tầng đó sụp, các tầng trên rơi xuống thành từng bậc.

## Toà phụ

| Toà | Vị trí | Kết cấu | Vai |
|---|---|---|---|
| **Cổng tam quan** | trước chùa, z = +16 | trụ gạch, 3 cửa vòm, mái cong | **lá chắn**: che chân chùa nhìn từ camera |
| **Thùng đỏ ×3** | sau cổng, cạnh trụ góc trước | | **quà** |
| **Lầu chuông** | bên phải | 4 trụ bê tông cốt thép, mái; **chuông đồng** `hard7v` treo dưới mái | **khó**: phá lầu cho chuông rơi, rồi mới đập được chuông |
| **Quán trà** | bên trái | gỗ, 2 × 2 | **dễ** |

## Mục tiêu (tester)

| Bài | Ngưỡng |
|---|---|
| 1 bom tốt nhất | < 70% |
| Dồn chân / chỉ đánh chân | < 80% |
| **Một lượt** (đặt hết TNT rồi bấm BLAST một lần) | **< 80%** |
| Đường phản ứng | bậc thang, không có vách đứng |
| Người chơi máy | Hard: thắng 3/3, dư ≥ 1, ≥ 3 đợt, 30–90 giây |
