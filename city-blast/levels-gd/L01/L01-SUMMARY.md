# Màn 1: Clock Tower (tóm tắt 3 bước)

| Bước | Kết quả | File |
|---|---|---|
| 1. GD chọn hình khối và vật liệu | Tháp vuông 3 × 3 cột, 6 tầng thân + tầng chuông; trụ góc cứng, đỉnh nặng; toà phụ gỗ | `1-GD-SPEC.md` |
| 2. Figma | Mặt đứng lấy cảm hứng tháp đồng hồ Gothic, kèm bảng vật liệu; component dùng lại: Glass window, Hard post segment, Vault block | Figma: *City Blast — Level Designs*, trang "L01 Clock Tower" |
| 3. GD ánh xạ ngược | Trụ góc `hrc` (chuẩn L32, 3 TNT, vết nứt giữ lại); thân gạch; sàn cứng ở tầng 4 và tầng chuông; 2 két ở đỉnh và 1 két ở toà phụ; 3 thùng đỏ ở chân | `make-level.mjs`, `level.json` |

## Tester (bản 18/11, đo trong game)

| Lượt | Thay đổi | 1 bom | Dồn chân | Chỉ chân | Người chơi thường | Kết quả |
|---|---|---|---|---|---|---|
| 1 | như bản vẽ đầu tiên | 74% | 84% | 86% | thắng sau 1 đợt | Trượt: sàn chiếm 37% khối lượng, mà két chỉ 11% |
| 2 | + 2 sàn cứng (tầng 4, tầng chuông) | 61% (toà đổ, không thắng) | **70%** | **70%** | **thắng 3/3, 17 TNT, 4 đợt, khoảng 40 giây, dư 2–7** | **Đạt** |

Khối lượng đo được ở lượt 2:
- sàn thường 24%, sàn cứng 18%;
- trụ `hrc` 15%;
- gạch 25%;
- két 10%;
- phần còn lại là gỗ và tấm tường.

Bản vẽ Figma đã được cập nhật lại theo số đo này (bước 2 và bước 3 khớp nhau).

## So với chuẩn L32: những gì còn thiếu (ghi thật)

- **Đã đạt:** bê tông cốt thép 3 nấc, thùng đỏ nổ miễn phí, luật tầng của L32, chữ ngắn (≤ 9 từ), không gợi ý vị trí.
- **Chưa đạt, đều về hình ảnh:**
  - trong game, trụ góc có màu bê tông sáng chứ không sẫm như bản vẽ;
  - **chưa có mặt đồng hồ, chóp nhọn, ô cửa phòng chuông**;
  - két nằm khuất trong tầng chuông;
  - chưa có kính thật và nội thất.

  L32 có một builder riêng cho toà chính (`mon14`), lo phần trang trí, kính và ánh sáng. Màn 1 cần một builder tương tự (đồng hồ, chóp, trụ sẫm) để đạt mức hình ảnh của L32.
- **Ngân sách:** L32 cho người giỏi dư 0–1 TNT. Màn 1 dư 2–7 với người chơi máy, nên có thể siết lại còn khoảng 15 TNT sau khi người thật chơi thử.

## v2 (20/11): tháp hai khối, toà phụ có vai

Đã sửa theo góp ý của Khai: bỏ kiểu đế dày, nâng cấp toà phụ. Spec ở `1-GD-SPEC-v2.md`, nghiên cứu ở `../DIFFICULTY-MECHANICS.md`.

| | v1 | v2 |
|---|---|---|
| Đường phản ứng (bom ở chân: 1/2/3/4/6/8/12) | 2 → **63**% (vách đứng) | 4/10/13/16/21/24/26% (đều, có trần) |
| 1 bom tốt nhất | 61% | **13%** |
| Dồn chân / chỉ đánh chân | 70 / 70 | **46 / 45** |
| Người chơi máy | 17 TNT, 4 đợt, khoảng 40 giây | **31 TNT, 8–9 đợt, 74–97 giây**, dư 3–7 |
| Bậc | Normal | **Hard** |

Toà phụ:
- dãy cửa hàng làm lá chắn;
- thùng đỏ là quà, đặt sau lá chắn;
- bể nước là toà cứng (chân bê tông cốt thép, bể nặng).

Figma: khung "L01 v2 · Clock Tower · design" gồm mặt đứng, bảng vai trò, biểu đồ phản ứng và mặt bằng.

## v4 (20/11): "Five Eaves", chùa năm tầng mái, dựng theo chuẩn L32

Lý do có v4:
- Khai: màn chưa đạt độ chi tiết và độ phức tạp của L32.
- Tháp đồng hồ đã có trong game (F01).
- Không được thắng bằng cách đặt hết bom rồi bấm một lần.

**Cách dựng:** viết builder riêng `g7pag`, `g7gate`, `g7bell`, `g7tea` trong `engine.js`, dùng đúng bộ công cụ của các toà chính L1–36 (`A1.h`, `M14.api`, trang trí `l6KdAdd`).
- 165 khối vật lý.
- Trang trí gắn lên khối: mái cong, góc mái vểnh, lan can, đèn lồng sáng, cửa tròn chạm, bàn thờ, vết nứt bê tông của L32.
- Mỗi tầng chùa là một khối rời.

**Độ khó:**
- 4 trụ góc của sảnh là bê tông 3 nấc, các trụ giữa là bê tông thường.
- 4 tấm mái của sảnh, chóp đồng và chuông đồng chỉ phá được sau khi đã rơi xuống (`drop7`).
- Cổng tam quan che chân chùa.

| Bài | Kết quả |
|---|---|
| Đường phản ứng (1/2/3/4/6/8/12 bom ở chân) | 0/2/4/4/8/12/16%: tăng dần |
| 1 bom tốt nhất | 5% |
| **Một lượt** (đặt hết TNT, bấm BLAST một lần) | **72%**; chỉ chạm vào thứ nhìn thấy được thì 44% |
| Dồn chân / chỉ đánh chân | 32% / 80% (vẫn dưới mức thắng 85%) |
| Người chơi máy | 31 TNT: có lần thua; 37 TNT: thắng 3/3, dư 4–8, 9–12 đợt nổ, 100–130 giây |
| Bậc | Super Hard (7–10 đợt nổ) |
