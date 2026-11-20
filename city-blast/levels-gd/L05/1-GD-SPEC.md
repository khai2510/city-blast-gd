# Màn 5: "Glass Spine", bóc vỏ thấy lõi (bước 1, GD)

**Bài học:** cái nhìn thấy (kính, cột mặt ngoài) **không giữ gì cả**. Cả toà treo trên **một lõi bê tông 4 trụ** giấu sâu trong bệ. Phải bóc vỏ bệ để thấy lõi, rồi **đục lõi qua 3 lần nổ** (mỗi lần nổ chỉ bóc 1 nấc).

**Cảm hứng:** toà văn phòng kính hiện đại có lõi bê tông (#8): mặt dựng kính khung tối, sàn mỏng, vương miện kính lùi vào, cột ăng-ten có đèn đỏ. Bệ đá 2 tầng có cửa hàng (biển màu), mái bệ có vườn. Không lấy công trình cụ thể nào.

## Bố cục (có trật tự)
- Một trục giữa: tháp kính 9 tầng trên bệ đá 18 × 18 m. Tổng cao khoảng 41 m.
- Hai bên là **hai nhà kính 3 tầng giống hệt nhau**, cách bệ đều 5 m, mặt tiền thẳng hàng.

| Toà | Kết cấu | Vai |
|---|---|---|
| Tháp (A) | cột mặt ngoài mảnh (bê tông 1 TNT); **lõi 4 trụ** ở giữa; trụ lõi tầng trệt là **hrc 3 nấc** (layer7); bệ có vách và mặt cửa hàng che lõi | chính |
| Nhà kính trái/phải | cột mảnh, không lõi | bối cảnh, dễ phá; tháp sụp sẽ đè một bên |

## Khoảnh khắc nhận ra
1. Phá kính và cột mặt ngoài nhiều lần: toà vẫn đứng (tester: 4–58%).
2. Vỡ kính thì thấy **khối lõi xám** chạy suốt chiều cao ở giữa.
3. Trụ lõi ở chân nứt dần qua từng lần nổ, không sập ngay.

## Wow
Lần nổ thứ ba vào lõi: cả tháp kính 41 m sụp thẳng xuống bệ, kính văng khắp quảng trường, đè luôn nhà kính bên cạnh (từ 5% lên 80% trong một lần nổ).

## Tester (`coreTest`)
| Bài | Ngưỡng |
|---|---|
| Đúng: bóc bệ, đục lõi 3 lần, dọn | thắng |
| Sai: chỉ phá vỏ (kính, cột, sàn), không bao giờ đụng lõi | thua |
| oneBomb / allFoot / footOnly / oneWave | < 70 / 80% |
| Bậc | SH |
