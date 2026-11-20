# Pipeline7 v3: toà khung thép + thành phần nhiều độ cứng (học theo cách Smash Fest xếp vật)

20/11/2026 · Chạy: `node run.mjs`, rồi `node final.mjs` và `node report.mjs`. Bản trước: `REPORT-v1-frames.md` (toà bê tông) và `blueprints-v2-stage.mjs` (có bệ).

## 1. Vì sao đổi hướng

| Lần | Cách làm | Tester / Khai thấy gì |
|---|---|---|
| v1 | Toà bê tông nối khớp, trụ cứng ở góc hoặc viền | Không còn chuyện 1 bom đổ cả toà, nhưng **dồn hết TNT ở chân vẫn thắng** (80–95%, 8/10 màn). Phần cứng nằm ở chân thì đánh chân là đánh luôn phần cứng. |
| v2 | Thêm bệ, đống đổ trên bệ vẫn tính là "còn" | Khai: không hợp. Không quả bom nào hất được hết đồ khỏi bệ. |
| **v3** | **Khung thép là cái kệ. Thứ cần phá là các thành phần rời trên từng tầng, mỗi loại một độ cứng.** | 10/10 đạt mọi bài |

Đây là cách Smash Fest làm: bàn và kệ không phải mục tiêu; mục tiêu là các vật đặt trên đó (bình, thùng, đá, trống thép). Mỗi vật đứng riêng, độ cứng khác nhau, và vị trí của chúng quyết định độ khó.

## 2. Mỗi toà được làm từ gì

| Thành phần | Trong game | Tương đương Smash Fest | Phá thế nào |
|---|---|---|---|
| Khung thép (cột, sàn) | `rack7c` / `rack7d`, cố định | kệ, bàn | Không phá được, **không tính vào %** |
| Mềm | thùng gỗ / gạch nhẹ | bình, hộp | 1 TNT dọn được cả cụm |
| Vừa | khối bê tông | thùng | Cần nổ gần |
| Cứng | khối bê tông cốt thép | đá | Chỉ vỡ khi TNT đặt đúng lên nó |
| Trống thép | `drum7` | trống thép | Không vỡ, phải nổ cho văng ra ngoài |
| Kính mặt trước | `glass` | lớp vật ở mặt trước | Vỡ ngay, là lớp trước |

- Các thành phần **đặt rời, không nối khớp**: chúng đổ, trượt, văng như vật trong Smash Fest.
- **% = số thành phần đã bị phá hoặc đã rơi xuống đất.** Đếm theo số cái, như Smash Fest; một cái trống tính bằng một khối bê tông.
- Chạm vào khung thép thì TNT tự chuyển sang thành phần gần nhất.

## 3. Mẫu theo từng tầng (`gen.mjs` › `rackItems`)

| Mẫu | Cứng/mềm đặt ở đâu | Màn SF gốc |
|---|---|---|
| corners | khối cứng ở 4 góc, tầng chẵn | 131, 152, 165 |
| frame | hai đầu mỗi tầng cứng, giữa mềm | 123, 140, 171 |
| cap | 2 tầng trên cùng là trống thép | 121, 134, 141, 151 |
| shelf | cứ 2 tầng có 1 tầng cứng | 127, 137, 177 |
| checker | trống thép và thùng xen kẽ | 126, 129, 162, 175 |
| spine | cột giữa cứng mọi tầng | 128, 131, 170 |
| shell | kính trước, lõi cứng giữa, trống trên mái | 124, 144, 147, 154, 179 |
| depth | trước mềm, giữa bê tông, sau cứng | 139, 142, 164 |
| base | tầng trệt cứng, trên mềm | 148, 159 |

Mỗi màn có toà chính và toà phụ đứng riêng, mỗi toà một mẫu.

## 4. Tester

1. Đo cấu trúc.
2. **1 quả bom tốt nhất** (thử 18 vị trí).
3. 4 TNT ở chân.
4. **Dồn hết ngân sách TNT vào chân, nổ một đợt.**
5. **Chỉ đánh chân:** nhiều đợt, chỉ nhắm các thành phần ở tầng trệt.
6. **Người chơi thường**, chỉ chạm, chạy 3 lần:
   - nhắm vào cụm dày nhất;
   - ưu tiên khối cứng;
   - chạm đúng chỗ khối được vẽ;
   - các lần chạm cách nhau ít nhất 45 px;
   - nếu chạm mà không đặt được TNT thì chạm ra vùng trời để bỏ chọn, rồi chạm lại.
7. Tự chỉnh TNT đến khi người chơi thường thắng cả 3 lần và còn dư.

**Luật đạt:**

| Bài | Ngưỡng |
|---|---|
| 1 quả bom tốt nhất | < 45% |
| Dồn hết ở chân, chỉ đánh chân | **< 80%** |
| Người chơi thường | thắng 3/3 lần, dư Normal ≥ 2, Hard ≥ 1 TNT |
| Số đợt nổ | ≥ 2 (Normal) / ≥ 3 (Hard) |
| Thời gian ước tính | trong khoảng của bậc |

## 5. Kết quả v3 (10/10 đạt)

## Cấu trúc: Smash Fest vs City Blast

| Lv | Màn | Bậc | Mẫu SF (màn) | SF: vật cứng % · vị trí cứng | CB đo được: cứng % (toà chính) · vị trí | Lõi | Lớp cứng | Hàng cột (sâu) | Số toà |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Corner Posts | N | corners (131, 152, 165) | 20% · corners (front+back) full height | 24% · đỉnh 4, giữa 4, đáy 4, viền 12 | no | 3 | 2 | 3 |
| 38 | Hard Frame | N | frame (123, 140, 171) | 30% · perimeter | 33% · đỉnh 4, giữa 8, đáy 4, viền 16 | no | 4 | 2 | 2 |
| 39 | Drum Lid | N | cap (121, 134, 141, 151) | 20% · top (full width cap) | 0% ·  | no | 0 | 0 | 3 |
| 40 | Shelf Tower | H | shelf (127, 137, 177) | 35% · mid shelves | 27% · đỉnh 6, giữa 6, đáy 6, viền 18 | no | 3 | 2 | 2 |
| 41 | Drum Checker | N | checker (126, 129, 162, 175) | 50% · checker | 0% ·  | no | 0 | 0 | 2 |
| 42 | The Spine | N | spine (128, 131, 170) | 25% · center column | 20% · đỉnh 4, giữa 4, đáy 4, viền 12 | no | 6 | 2 | 3 |
| 43 | Shell and Core | H | shell (124, 144, 147, 154, 179) | 30% · front + core + top | 17% · đỉnh 4, giữa 4, đáy 4, viền 6, lõi 6 | yes | 6 | 2 | 2 |
| 44 | Front and Back | N | depth (139, 142, 164) | 25% · back row | 11% · đỉnh 3, giữa 3, đáy 3, viền 9 | no | 3 | 1 | 2 |
| 45 | Three Towers | N | split (125, 145, 149) | 25% · split stacks with different materials | 33% · đỉnh 4, giữa 4, đáy 4, viền 12 | no | 3 | 2 | 3 |
| 46 | The Citadel | SH | citadel (130, 140, 170) | 30% · core + frame + top | 9% · đỉnh 4, giữa 4, đáy 4, lõi 12 | yes | 6 | 1 | 3 |

## Tester

| Lv | Màn | 1 bom tốt nhất % | Dồn hết TNT ở chân % | Chỉ đánh chân % | TNT cho | Người chơi thường: thắng | dư TNT | số đợt | ước thời gian |
|---|---|---|---|---|---|---|---|---|---|
| 37 | Corner Posts | 17% | 55% | 55% | 17 | 3/3 | 3–3 | 3–3 | 35–35 s |
| 38 | Hard Frame | 23% | 58% | 56% | 16 | 3/3 | 3–3 | 3–3 | 32–32 s |
| 39 | Drum Lid | 13% | 51% | 47% | 20 | 3/3 | 2–2 | 4–4 | 47–47 s |
| 40 | Shelf Tower | 11% | 28% | 21% | 17 | 3/3 | 1–1 | 3–3 | 36–36 s |
| 41 | Drum Checker | 18% | 48% | 48% | 16 | 3/3 | 3–5 | 3–5 | 33–49 s |
| 42 | The Spine | 14% | 40% | 43% | 14 | 3/3 | 3–3 | 2–2 | 25–25 s |
| 43 | Shell and Core | 13% | 40% | 39% | 17 | 3/3 | 1–1 | 3–3 | 36–37 s |
| 44 | Front and Back | 17% | 46% | 45% | 21 | 3/3 | 2–4 | 5–5 | 49–52 s |
| 45 | Three Towers | 11% | 38% | 33% | 21 | 3/3 | 3–3 | 2–2 | 33–33 s |
| 46 | The Citadel | 10% | 35% | 34% | 38 | 3/3 | 2–2 | 5–5 | 75–76 s |


**So với Smash Fest:**
- Màn Normal ở đây 25–52 giây; Smash Fest khoảng 12–30 giây.
- Màn Hard khoảng 36 giây, gần với Smash Fest (20–35 giây).
- Màn boss Citadel 75 giây và 38 TNT, vẫn dài gấp đôi màn boss Smash Fest.
- Tỷ lệ thành phần cứng 13–44%; Smash Fest 21–26%, riêng màn bàn cờ khoảng 50%.

## 6. Lỗi tester đã gặp và sửa trên đường (ghi lại để không lặp)

- **Bàn trống thép quá nặng:** trống 5,7 tấn thì nổ không hất nổi. Đổi sang trống rỗng 0,5 tấn.
- **Tính % theo khối lượng làm trống thép gần như không đáng kể.** Đổi sang đếm số cái, như Smash Fest.
- **Người chơi máy kẹt, do lỗi của nó chứ không phải do màn:**
  - chạm sát quả TNT vừa đặt thì game hiểu là chọn quả đó;
  - hàm vẽ phục vụ test bị trễ một bước;
  - khối bị uốn cong được vẽ lệch so với vị trí vật lý.
- **Lõi ở giữa toà sâu 3 ô bị sàn tầng trên che mất.** Người thật cũng không thấy, nên đây là lỗi thiết kế. Đã đổi sang toà sâu 2 ô.

## 7. Còn mở

- **Hình ảnh:** hiện là khung thép chứa thùng, đọc ra là "kệ hàng" chứ chưa ra "toà nhà". Giai đoạn 2 (Figma) sẽ vẽ vỏ toà và toà phụ.
- **Chưa có người chơi thật.** Người chơi máy không xoay camera, không zoom.
- **Citadel quá dài** (75 giây, 38 TNT).
