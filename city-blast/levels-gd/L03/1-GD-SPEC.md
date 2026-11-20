# Màn 3: "Grand Stage", giữ toà xanh nguyên vẹn (bước 1, GD)

**Bài học:** đừng đổ tháp về phía toà xanh. Chân với tới được lại là chân sai, nên phải **mở đường từng ít một**: phá một phần sảnh hoặc khán phòng để lộ chân phía an toàn, rồi mới cho tháp đổ.

**Cảm hứng:** nhà hát kiểu Pháp thuộc (#10): hàng cột đôi, mái vòm xanh đồng, mái mansard. Chỉ lấy cảm hứng, tỷ lệ và chi tiết là của mình.

## Hình khối (x: trái → phải, z+: phía camera)

| Toà | Vị trí | Kích thước | Kết cấu | Vai |
|---|---|---|---|---|
| **Tháp sân khấu** (A) | x +8, z −4 | 9 × 8 m, cao 22 m (5 tầng) | chân 8 trụ bê tông 1 TNT, **luật nghiêng**; thân trụ bê tông, vách đá kem, cửa sổ cao, mái hồi, đàn lia mạ vàng | chính |
| **Sảnh trước** (F) | x +1.5, z +5.8 | 22 × 6 m, 3 tầng (13.4 m) | trụ bê tông; mặt tiền cột đôi, ban công lan can, cửa vòm; mái mansard, vòm xanh đồng có đèn lồng, hai vòm góc | che chân trước của tháp |
| **Khán phòng** (R) | x −3.5, z −3 | 13 × 10 m, 2 tầng × 6 m | trụ bê tông; bên trong: sân khấu, **màn nhung đỏ**, 25 cụm ghế đỏ, 2 ban công, **đèn chùm** | che chân trái của tháp; phá vỏ thì lộ bên trong |
| **Bệnh viện** (xanh) | x +19.5, z −3 | 4 tầng, cách tháp 3.4 m | toà bảo vệ của game | đổ về đây thì thua |
| **Trường học** (xanh) | x +8, z −17 | 3 tầng | toà bảo vệ, thấy khi xoay camera | đổ về đây thì thua |

## Khoảnh khắc nhận ra (không chữ, không mũi tên)

1. Chân tháp thấy được là chân **phía bệnh viện**. Phía sau là trường học (xoay camera mới thấy).
2. Chân trước bị sảnh che, chân trái bị khán phòng che. Từ góc nào cũng không chạm được.
3. Nổ to một lần làm mảnh văng sang bệnh viện (sảnh đứng sát).

## Khoảnh khắc wow

- **Đào xuyên lưng sảnh** (một đợt nhỏ 6 quả ở các khối sát chân trước tháp): tháp 22 m đổ ập về phía trước, **đè nát nửa sảnh và mái vòm**, rơi ra quảng trường. Bệnh viện đứng nguyên.
- Phá sảnh thì thấy màn nhung đỏ, ghế và đèn chùm của khán phòng.

## Mục tiêu (tester)

| Bài | Ngưỡng |
|---|---|
| oneBomb | < 70% |
| Đặt hết bom nổ một lần (chỉ những khối chạm được từ 4 góc nhìn) | thua: < 80% hoặc toà xanh hư > 5% |
| Toàn bộ bom ở chân / chỉ nổ chân | như trên |
| **Ba đường đúng** (đào thẳng tới chân trước; dỡ sảnh rồi nghiêng ra trước; dỡ sảnh và khán phòng rồi nghiêng sang trái) | thắng, toà xanh hư ≤ 5% |
| **Hai hướng sai** (về bệnh viện; về trường) | thua |
| Bậc | Hard |
