# Màn 2: "Watch Keep", ngắm hướng đổ và chuỗi phản ứng (bước 1, GD; bản 2)

Bản 2 sửa theo góp ý của Khai ngày 20/11:
- toà đích là "hai khối nhỏ xíu", phải đồ sộ, tạo hiệu ứng domino;
- cần khoảnh khắc wow;
- không mũi tên gợi ý.

**Bài học:** đổ tháp đúng hướng để **khởi động một chuỗi**. Người chơi tự phát hiện ba điều:
1. Trụ đá của Đại sảnh **không phá được bằng TNT**: đặt bom vào chỉ thấy bụi.
2. Trụ góc của tháp nứt dần qua từng lần nổ: phải **đục 3 lần**.
3. Tháp ngã về phía hai trụ cạnh nhau đã gãy.

**Chuỗi wow (một cú đổ đúng):**
1. Tháp canh ngã đè lên Đại sảnh.
2. Mái và sàn Đại sảnh sụp dây chuyền từ đầu này sang đầu kia (sụp lan).
3. Đống đổ đè vào **kho thuốc súng giấu trong cuối sảnh** (thùng đỏ, nhìn từ ngoài không thấy).
4. Kho nổ, quật đổ **tháp cổng** ở đầu kia.

**Cảm hứng:** pháo đài, thành cổ (#9). Chỉ lấy cảm hứng.

## Hình khối (trục x: tháp ở 0, chuỗi chạy về +x)

| Toà | Vị trí x | Kích thước | Kết cấu | Vai |
|---|---|---|---|---|
| **Tháp canh** | 0 | 8.4 × 8.4 m, cao khoảng 40 m | chân 8 trụ: góc `hrc` (layer7: mỗi lần nổ bóc 1 lớp, cần 3 lần nổ), giữa `rc`; thân là trụ đá 1 TNT; sàn chịu nổ; liền khối; luật nghiêng | chính, **khởi động chuỗi** |
| **Đại sảnh** | +10 … +28 | 18 × 11 m, 3 tầng × 4.5 m, mái dốc | tầng trệt: trụ đá `hard7i` (TNT không phá được, **chỉ vỡ khi bị đè**); tầng 2–3: trụ bê tông thường; vách đá có cửa vòm; mái ngói dốc, đầu hồi | **toà đích đồ sộ**, sụp lan |
| **Kho thuốc súng** | trong sảnh, cuối +x | 4 thùng đỏ | bị vách che, không chạm tới được | **bất ngờ** |
| **Tháp cổng** | +33 | 6 × 6 m, cao 18 m | trụ đá 1 TNT, mái răng cưa | cuối chuỗi, kho nổ thì đổ |
| Tường thành | −9 … −14 | | gạch | dễ |

## Mục tiêu (tester)

| Bài | Ngưỡng |
|---|---|
| oneBomb / oneWave / allFoot / footOnly | < 70 / 80 / 80 / 80% |
| **Đổ đúng hướng (+x), rồi dọn** | thắng; Đại sảnh vỡ ≥ 70% số trụ đá; kho thuốc súng nổ |
| **Đổ sai hướng (3 phía còn lại)** | < 80% |
| Bậc | Hard |
