# Màn 3 "Grand Stage": kết quả tester

## Bản 2 (bố cục theo trục, run-i, 24 TNT): PASS

Sửa theo góp ý của Khai: bố cục thẳng trục (sảnh, khán phòng, tháp), hai toà xanh đối xứng hai bên tháp, cùng chiều cao, khoảng cách bằng nhau, mép trước thẳng hàng tường sau khán phòng. Camera gần chính diện.

| Bài | Kết quả |
|---|---|
| 1 bom tốt nhất | 5% |
| Toàn bộ bom ở chân | 43% |
| Chỉ nổ chân, 6 quả mỗi đợt | 74%: thua |
| Đặt hết bom nổ một lần | 77%, bệnh viện hư 13%: thua |
| Đúng: dỡ sảnh, dỡ khán phòng, đào tới chân trước, tháp đổ ập ra trước | **86%, toà xanh 0%**, 23 TNT, 6 đợt |
| Sai: nghiêng tháp về trường học / bệnh viện | toà xanh hư 98% / 40%: thua |
| Máy chơi mù | thua 3/3 |

Tester sửa thêm: `reach4` coi một khối là chạm được nếu tâm HOẶC một điểm sát mặt khối là thứ đầu tiên dưới ngón tay (trước đây chỉ xét tâm).

## Bản 1 (bố cục cũ, đã thay)

| Bài | Kết quả |
|---|---|
| 1 bom tốt nhất | 4% |
| 4 bom ở chân (lười) | 42% |
| Toàn bộ bom ở chân, một lần | 75%, bệnh viện hư 14%: thua |
| Chỉ nổ chân, nhiều đợt | 38%, toà xanh hư 14%: thua |
| Đặt hết bom nổ một lần | 63%, bệnh viện hư 22%: thua |
| Đúng: đào thẳng tới chân trước, tháp đổ ra trước | **89%, toà xanh 0%**, 37 TNT, 7 đợt |
| Đúng: dỡ sảnh rồi nghiêng ra trước | **92%, toà xanh 0%**, 36 TNT, 6 đợt |
| Đúng: dỡ sảnh và khán phòng rồi nghiêng sang trái | **93%, toà xanh 0%**, 35 TNT, 9 đợt |
| Sai: nghiêng về bệnh viện | bệnh viện hư 30%: thua |
| Sai: nghiêng ra sau | trường học hư 14%: thua |
| Máy chơi mù (không biết toà xanh) | thua 3/3, đúng như mong đợi |

Thêm vào tester: `keepT` (dỡ phần che, đào tới chân, nghiêng, dọn), `reach4` (chỉ đặt bom vào khối chạm được từ 4 góc xoay camera). Các bài foot và oneWave của màn có toà xanh dùng `reach4` và tính thua khi toà xanh hư > 5%.
