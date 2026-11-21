# 21/11: chỉnh lại trên base bản chính: PASS (`run-main.log`, 27 TNT trong game)

| Bài | Kết quả |
|---|---|
| 1 bom / chân 1 lần / chỉ chân / nổ một lần | 3% / 25% / 35% / 24% |
| **Đúng:** bóc bệ, đục lõi, dọn | **85%**, 18 TNT, 4 đợt |
| Sai: chỉ phá vỏ | 14%: thua |
| Máy chơi mù | thắng 2/3 (dư 3 TNT), trước là 3/3 |

Sửa gì: trên base bản chính, tháp sụp cho 79% rồi dừng ở 83%, vì hai nhà kính 3 tầng vẫn đứng và thêm bom cũng không lên. Hạ hai nhà kính còn **2 tầng** (`PN` trong `make-level.mjs`) để tháp lõi chiếm phần lớn điểm. `tntStart` 26 (trong game 27).

---

# Màn 5 "Glass Spine": kết quả tester (run-b, 26 TNT, bậc SH): PASS

| Bài | Kết quả |
|---|---|
| 1 bom tốt nhất | 3% |
| Toàn bộ bom ở chân | 35% |
| Chỉ nổ chân, nhiều đợt | 37% |
| Đặt hết bom nổ một lần | 31% |
| **Đúng:** bóc bệ (1 lần nổ), đục 4 trụ lõi (3 lần nổ), dọn | **86%**, 24 TNT, 5 đợt; lần nổ lõi thứ 3 đẩy điểm từ 5% lên 80% |
| Sai: chỉ phá vỏ (kính, cột mặt ngoài, sàn), không bao giờ đụng lõi | 15%: thua |
| Máy chơi mù | **thắng 3/3** (dư 0–5 TNT): nó ưu tiên khối cứng nên tự tìm ra lõi. Màn khó nhưng công bằng. Nếu người chơi thật thấy dễ, siết bớt bom. |

Key mới `core7`: trụ lõi tầng trên bóc 1 nấc mỗi lần nổ (layer7), nhưng tính là đã đổ khi rơi.
