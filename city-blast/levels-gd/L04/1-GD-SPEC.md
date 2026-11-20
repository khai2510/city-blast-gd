# Màn 4: "Canal Row", đổ dây chuyền (bước 1, GD)

**Bài học:** phần lớn dãy nhà không phá được bằng TNT. Phải **khởi động một chuỗi domino** ở đúng đầu dãy, sao cho chuỗi chạy **ra xa toà xanh**.

**Cảm hứng:** dãy nhà phố hẹp và cao bên kênh (kiểu phố cổ châu Âu): mặt tiền gạch nhiều màu, đầu hồi bậc thang hoặc hình chuông, xà kéo hàng trên đỉnh, cửa hàng có mái hiên sọc. Không lấy công trình cụ thể nào.

## Bố cục (có trật tự)

- 6 nhà **cùng bề ngang 4.4 m**, **khe đều 1 m**, **mặt tiền thẳng một hàng**. Mỗi nhà **cao hơn nhà trước đúng 1 tầng**: từ 3 tầng lên 8 tầng. Nhà cuối là tháp thương nhân có chóp đồng.
- Đầu trái: **trường học (toà xanh)**, cách nhà đầu 3.5 m, thẳng hàng tâm.
- Đầu phải: **nhà kho gạch** 12 × 8 m, 3 tầng, mái răng cưa, cách tháp 2.5 m.

| Toà | Chân | Vai |
|---|---|---|
| Nhà 1 (thấp nhất, gạch đỏ) | trụ bê tông 1 TNT, luật nghiêng | **chỗ khởi động đúng** |
| Nhà 2–5 | **trụ đá không ăn TNT** (hit7) | chỉ đổ khi bị nhà bên cạnh đổ đè vào (dom7) |
| Tháp (nhà 6) | trụ bê tông 3 nấc (layer7: 3 lần nổ) | khởi động ngược thì đắt, và chuỗi chạy về trường học |
| Nhà kho | trụ gạch | cuối chuỗi: tháp quật sập nó |

**dom7 (luật mới):** một nhà bị nhà bên cạnh đổ đập mạnh vào thân thì chân phía bên kia gãy, và nó đổ cùng chiều. Domino đọc được bằng mắt.

## Khoảnh khắc nhận ra
1. Bom lên chân nhà giữa: không vỡ, chỉ có bụi.
2. Nhà thấp nhất lại phá được: đẩy nó là cả dãy đi theo.
3. Đẩy về bên trái thì nó đè trường học.

## Wow
Một đợt 2 quả: 6 nhà đổ lần lượt từ thấp đến cao. Tháp cao nhất quật xuống nhà kho, cả dãy nằm rạp về một phía.

## Tester
| Bài | Ngưỡng |
|---|---|
| oneBomb / oneWave / foot | thua |
| Đúng: nghiêng nhà 1 sang phải, dọn | thắng, trường ≤ 5% |
| Sai: nghiêng nhà 1 sang trái; nghiêng tháp sang trái | thua |
