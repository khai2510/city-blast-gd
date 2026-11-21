# Màn 4 "Canal Row": kết quả tester (run-f, 24 TNT, bậc SH): PASS

Bố cục đối xứng trên một trục:
- giữa: tháp thương nhân 7 tầng, chân trụ 3 nấc;
- hai bên quảng trường 4 m: hai dãy 3 nhà phố, thấp dần về phía tháp (5, 4, 3 tầng), cùng bề ngang 4.2 m, khe đều 2.6 m, mặt tiền thẳng hàng;
- hai đầu: trường học và bệnh viện (toà xanh), cùng cỡ.

| Bài | Kết quả |
|---|---|
| 1 bom tốt nhất | 2% |
| Toàn bộ bom ở chân, 1 lần | 9% |
| Chỉ nổ chân, nhiều đợt | 3% |
| Đặt hết bom nổ một lần | 7% |
| **Đúng:** tháp đổ ra trước (3 lần nổ), đẩy dãy trái vào trong, đẩy dãy phải vào trong | **86%, toà xanh 0%**, 22 TNT, 11 đợt |
| Sai: đẩy hai dãy vào khi tháp còn đứng | dãy quật tháp, tháp quật dãy kia, bệnh viện hư 55%: thua |
| Sai: phá tháp rồi đẩy hai dãy ra ngoài | toà xanh hư 18%: thua |
| Máy chơi mù | thua 3/3 |

Cơ chế mới:
- `dom7` (domino theo nhà đang nghiêng);
- `seqRoutes` (tester chạy chuỗi bước);
- `g7house` (nhà phố hẹp, đầu hồi bậc thang hoặc hình chuông, xà kéo hàng, mái hiên sọc);
- tháp có chóp đồng.

Các bẫy đã gặp khi làm màn này nằm ở `city-blast/LEARNINGS.md` mục 5 (tip rule 8 hướng, chân bị che trong khe, domino quá nhạy, nhảy qua quảng trường, kẽ hở nổ một lần).
