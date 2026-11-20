# Benchmark: Level 32 "Sky Saucer" (chuẩn chất lượng hình ảnh và cảm giác chơi)

Nguồn: patch `levels6 v14 MONUMENT` (D-blast-HERO-MONUMENT, Khai 12/11, tile Figma F04) cùng các vòng sửa 3–6 và chuẩn STD-v3 (14/11), đọc trong build 18/11. Ảnh: `L32-bench.jpg` (chụp trong build).

Số liệu L32:
- 9 TNT, 427 khối (không giới hạn số khối).
- 76 trụ bê tông cốt thép khối lớn (`hrc`), 70 ô sàn cùng loại bê tông, 76 tấm kính thật, 28 cột thép mảnh, 16 thùng đỏ.
- Toà chính `mon14` cộng 3 tháp phụ.

## A. Những gì Khai đã yêu cầu ở L32

### Hình ảnh
1. **Công trình biểu tượng dựng lại thành khối khổng lồ** từ một tile Figma:
   - đế có trụ chống;
   - thân kính 9 tầng kết cấu (nhìn qua kính thấy 18 sàn);
   - đầu loe, đĩa nhà hàng có dải kính và sân thượng có lan can;
   - thân kính, đài quan sát mái nón, cột ăng-ten.

   Đứng ở góc nhìn toàn khu vẫn nhận ra được dáng toà.
2. **Mọi khối kết cấu là khối vật lý thật**: trụ, ô sàn, tấm kính. Còn những gì **nhìn thấy bên trong** (sàn, lõi thang máy, cột, cầu thang, bàn, đèn) là trang trí gắn vào khối vật lý: khối vỡ thì đồ trang trí đi theo, không có thân vật lý riêng.
3. **Kính thật**: trong suốt, phản chiếu bầu trời. Đèn bên trong tự phát sáng.
4. **Toà phụ xung quanh có vai trò**: 3 tháp nhỏ có thùng đỏ, vòng ranh giới khu đất, đường.
5. **Camera**:
   - kéo dọc theo thân tháp, pinch để zoom sát;
   - góc mở màn nhìn về phía có thùng đỏ rồi đẩy dần vào chân tháp;
   - bấm BLAST hoặc chạm đúp thì camera về khung cũ.

### Cảm giác chơi và vật lý
6. **Bê tông cốt thép khối lớn** ("hai quả bom vào một chỗ nó mới bắt đầu có phản ứng"):
   - 1 TNT: sứt, nứt chân chim;
   - 2 TNT: bong lớp vỏ, lộ lồng thép;
   - 3 TNT: trụ gãy.
   - **Hư hại giữ lại giữa các đợt nổ**: 1 + 1 + 1 quả qua ba đợt bằng 3 quả cùng lúc.
7. **Luật tầng**: phá **2 trụ cạnh nhau** thì toà luôn đổ, dù trong một đợt hay nhiều đợt. Mất 1 trụ, hoặc 2 trụ không cạnh nhau, thì không bao giờ đổ.
8. **Luật nghiêng**: toà đổ về phía mặt bị nổ (bài học hướng đổ).
9. **Sàn chịu nổ**: ô sàn cùng loại bê tông với trụ, nên 4 TNT ở tầng trên không làm rơi cả tháp.
10. **Thùng đỏ nổ dây chuyền miễn phí**. Tip: "Red drums blast for free."
11. **Ngân sách chặt**: người chơi giỏi kết thúc với **0–1 TNT** (lời giải dùng 8/9). Khai từng nói tháp quá khó, nên vòng 3 đã thêm thùng đỏ ở trụ góc.

### Giao diện và chữ
12. **STD-v3: không gợi ý vị trí**, không có chấm, không có bàn tay chỉ.
13. Câu tip và câu báo thua **tối đa 9 chữ**, nói **nguyên tắc** chứ không chỉ chỗ đặt. Ví dụ: "Break two legs side by side: it falls."
14. Chạm vào các chấm trên trụ được tính là chạm vào trụ (do tester lần đầu chạm vào chấm như bấm nút).

## B. Áp vào bộ màn mới (L01 trở đi)

| Chuẩn L32 | Áp dụng thế nào |
|---|---|
| Dáng biểu tượng từ tile Figma | Bước 2: Figma vẽ theo công trình cảm hứng. Bước 3: dựng theo bản vẽ. |
| Bê tông cốt thép 3 nấc nứt, hư hại giữ lại | Trụ cứng dùng `hrc` của L32 (3 TNT, nứt dần), thay cho khối cứng 1 phát |
| Luật tầng (2 trụ cạnh nhau) | Giữ nguyên engine của L32 |
| Thùng đỏ nổ miễn phí | Mỗi màn có 1 cụm thùng đỏ đặt đúng chỗ dạy bài học |
| Kính thật và nội thất | Cửa sổ dùng `mglass`; nội thất để giai đoạn sau |
| STD-v3, chữ ≤ 9 từ | Tip mỗi màn viết theo nguyên tắc |
| Ngân sách 0–1 TNT dư (người giỏi) | Tester: người chơi máy dư 1–3 TNT ở màn thường, người giỏi dư 0–1 |
| **Mới (yêu cầu 20/11):** không thắng bằng 1 bom hay dồn hết vào chân | Két và khối nặng tính đến khi vỡ (luật v4b), tester kiểm "dồn chân" < 80% |

Lưu ý: ở L32, lời giải của người giỏi chính là đặt TNT ở chân (2 TNT vào mỗi trụ có thùng đỏ). Nếu áp luật mới thì L32 có thể không đạt bài "dồn chân". Bộ màn mới sẽ theo chuẩn hình ảnh và cảm giác của L32, nhưng cộng thêm luật chống "dồn chân".
