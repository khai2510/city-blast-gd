# Pipeline7: bộ 10 level City Blast sinh từ chỉ số Smash Fest, có tester tự động

20/11/2026 · Chạy toàn bộ bằng `node run.mjs`, rồi gộp kết quả bằng `node final.mjs`. Không cần cài thêm gì: dùng Node 24 và Google Chrome chạy ngầm, điều khiển qua giao thức gỡ lỗi của Chrome.

## 1. Luồng chạy

```
blueprints.mjs ──► gen.mjs ──► build.mjs ──► Chrome chạy ngầm + tester.js ──► chỉnh TNT ──► phán quyết ──► final.mjs
 (chỉ số SF)       (level CB)   (inject vào    (đo cấu trúc, 1 bom, nổ lười,   (tăng đến khi    (PASS/FAIL     (bản build test
                                 bản 16/11)     người chơi chỉ-chạm 3 lần)      thắng 3/3 và     theo quy tắc)   và phát hành,
                                                                                còn dư TNT)                     ảnh, bảng)
```

- **`blueprints.mjs`:** mỗi level là **một mẫu Smash Fest đã đo được** trong `metrics-120-200.csv`. Mỗi bản thiết kế ghi:
  - các màn Smash Fest gốc;
  - dòng chỉ số Smash Fest: % vật cứng, vị trí cứng, lõi, số lớp cứng, lớp trước, chiều sâu, số khối, nguồn khó;
  - câu chuyện của màn;
  - toà chính và các toà phụ.
- **`gen.mjs`:** chuyển "vị trí cứng" thành cấu kiện City Blast thật:
  - trụ cứng `pier` ở góc, ở viền, hoặc xen kẽ kiểu bàn cờ;
  - lõi bê tông cốt thép;
  - sàn sâu `tdeck` làm kệ;
  - tầng thép trên đỉnh làm nắp;
  - chân trụ cứng;
  - cầu thép;
  - toà phụ tách rời;
  - bệ (chỉ dùng ở 4 màn).
- **`tester.js`:** chạy trong trang game, gồm 5 bài:
  1. **Đo cấu trúc** trên level đã dựng, theo đúng các cột của bảng Smash Fest: số khối, cứng/mềm, vị trí cứng (đỉnh/giữa/đáy, viền/lõi, trước/sau), số lớp cứng, số hàng cột theo chiều sâu, số toà.
  2. **1 quả bom tốt nhất:** thử 18 vị trí ở 2 tầng dưới của mọi toà, lấy kết quả tệ nhất: % điểm và **% khối lượng bị sập**. Đây là bài chống "1 bom đổ cả toà".
  3. **Nổ lười:** 4 TNT ở chân toà chính, một đợt.
  4. **Người chơi thường:** chỉ chạm lên màn hình (cùng đường chạm của người chơi), dùng kho TNT thật và nút BLAST, chạy 3 lần với 3 bộ ngẫu nhiên khác nhau (seed). Ghi lại: thắng/thua, TNT dư, số đợt nổ (số lần phải suy nghĩ), thời gian ước tính = Σ(3 giây đọc + 1 giây mỗi lần chạm + thời gian xem nổ, tối đa 6 giây).
  5. **Chỉnh TNT:** thử trước với 40 TNT, rồi đặt ngân sách = số đã dùng + phần dư của bậc. Tăng từng quả cho đến khi **cả 3 lần chạy đều thắng và còn dư**.

**Quy tắc đạt** (theo khoảng của Smash Fest):

| Bài | Ngưỡng |
|---|---|
| 1 quả bom tốt nhất | < 45% điểm **và** < 40% khối lượng bị sập |
| 4 TNT ở chân | không được thắng (< 85%) |
| Người chơi thường | thắng 3/3 lần chạy; dư Normal ≥ 2, Hard và Super Hard ≥ 1 TNT |
| Số đợt nổ | Normal ≥ 2; Hard và Super Hard ≥ 3 |
| Thời gian ước tính | Normal 20–75 giây; Hard 30–90; Super Hard 40–120 |
| Toà bảo vệ | hư hại ≤ 5% |

## 2. Lịch sử chạy: tester bắt lỗi gì, đã sửa ra sao

| Lượt | Đạt | Tester bắt được | Đã sửa |
|---|---|---|---|
| 1 | 4/10 | **1 bom đổ cả toà:** Iron Hat sập 83%, Shelf 99%, Front&Back 67%, Bridge 52%. Citadel cần 38 TNT, 12 đợt, 119 giây, và trúng bệnh viện. | Đo được: toà mềm, mảnh (2×2, 3×2) là nguyên nhân. Thêm **trụ cứng ở góc hoặc viền chạy suốt chiều cao** (mẫu "cột sống cứng" của SF L131/L165). |
| 2 | 1/6 | Shelf: 1 bom còn 25%, nhưng chỉ 2 đợt. Shell&Core quá dài (107 giây). Front&Back: nổ lười đã thắng (87%). Citadel thua với 18 TNT. | Thêm bệ cho Shelf. Thu nhỏ Shell&Core. Khối sau của Front&Back đổi sang viền trụ cứng. Bộ chạy tự tăng TNT. |
| 3 | 3/5 | Bridge: 1 bom vẫn đánh đổ trọn 1 tháp (50%). Shell&Core vẫn 97 giây. | Bỏ bệ ở Shell&Core. Thêm kiểm tra TNT dư. |
| 4 | 9/10 | Bridge: 45%. | Tháp cầu rộng ra 3×3, trụ cứng ở góc. |
| 5–6 | 10/10 | Bridge dư 8–10 TNT (quá dễ). | Ngân sách Bridge còn 13, Citadel 28. |

## 3. Kết quả cuối (L37–L46)

## Cấu trúc: Smash Fest vs City Blast

| Lv | Màn | Bậc | Mẫu SF (màn) | SF: vật cứng % · vị trí cứng | CB đo được: cứng % (toà chính) · vị trí | Lõi | Lớp cứng | Hàng cột (sâu) | Số toà |
|---|---|---|---|---|---|---|---|---|---|
| 37 | Corner Posts | N | frame-corners (131, 152, 165) | 20% · corners (front+back) full height | 19% · đỉnh 8, giữa 8, đáy 8, viền 24 | no | 6 | 3 | 3 |
| 38 | Hard Ring | N | frame-ring (123, 140, 171) | 30% · perimeter | 36% · đỉnh 10, giữa 20, đáy 10, viền 40 | no | 4 | 3 | 2 |
| 39 | Iron Hat | N | cap (121, 134, 141, 151) | 20% · top (full width cap) | 25% · đỉnh 13, giữa 12, đáy 8, viền 28, lõi 5 | yes | 6 | 3 | 3 |
| 40 | Shelf Tower | H | shelf (127, 137, 177) | 35% · mid shelves + pillars | 33% · đỉnh 21, giữa 21, đáy 21, viền 48, lõi 15 | yes | 9 | 3 | 2 |
| 41 | Checker Hall | N | checker (126, 129, 162, 175) | 50% · checker | 21% · đỉnh 5, giữa 5, đáy 5, viền 15 | no | 3 | 2 | 2 |
| 42 | The Spine | N | spine (128, 131, 170) | 25% · center column | 8% · đỉnh 4, giữa 6, đáy 4, lõi 14 | yes | 7 | 3 | 3 |
| 43 | Shell and Core | H | shell-core (124, 144, 147, 154, 179) | 30% · top + front-bottom, core inside | 17% · đỉnh 4, giữa 4, đáy 14, viền 10, lõi 12 | yes | 6 | 3 | 2 |
| 44 | Front and Back | N | depth (139, 142, 164) | 25% · front + bottom | 36% · đỉnh 20, giữa 30, đáy 20, viền 70 | no | 7 | 3 | 2 |
| 45 | Sky Bridge | N | bridge (174) | 15% · middle bridge | 19% · đỉnh 8, giữa 8, đáy 8, viền 24 | no | 6 | 3 | 3 |
| 46 | The Citadel | SH | citadel (130, 140, 170) | 30% · back wall + center column + sides | 22% · đỉnh 8, giữa 18, đáy 12, viền 24, lõi 14 | yes | 7 | 3 | 3 |

## Tester

| Lv | Màn | 1 bom tốt nhất: % / sập | 4 TNT ở chân: % | TNT cho | Người chơi thường: thắng | dư TNT | số đợt | ước thời gian |
|---|---|---|---|---|---|---|---|---|
| 37 | Corner Posts | 9% / 21% | 69% | 11 | 3/3 | 2–2 | 2–2 | 25–25 s |
| 38 | Hard Ring | 4% / 6% | 56% | 14 | 3/3 | 4–4 | 3–3 | 33–33 s |
| 39 | Iron Hat | 8% / 7% | 65% | 18 | 3/3 | 5–6 | 3–4 | 34–42 s |
| 40 | Shelf Tower | 4% / 20% | 47% | 15 | 3/3 | 2–3 | 4–4 | 43–44 s |
| 41 | Checker Hall | 10% / 16% | 54% | 12 | 3/3 | 3–3 | 3–3 | 31–31 s |
| 42 | The Spine | 4% / 7% | 74% | 10 | 3/3 | 3–4 | 2–3 | 21–30 s |
| 43 | Shell and Core | 8% / 18% | 38% | 10 | 3/3 | 2–4 | 3–4 | 30–38 s |
| 44 | Front and Back | 4% / 6% | 77% | 19 | 3/3 | 3–8 | 2–4 | 28–46 s |
| 45 | Sky Bridge | 3% / 5% | 28% | 13 | 3/3 | 3–3 | 2–2 | 27–27 s |
| 46 | The Citadel | 4% / 15% | 50% | 28 | 3/3 | 2–7 | 8–10 | 78–100 s |


**Đọc bảng:**
- **"1 bom đổ cả toà": đã loại hết.** 1 quả bom tốt nhất chỉ làm sập 5–21% khối lượng (trước khi sửa là 52–99%) và chỉ được 3–10% điểm.
- **Nổ lười ở chân không thắng ở màn nào** (28–77%).
- **Người chơi thường thắng 30/30 lần chạy**, với 2–10 đợt nổ, khoảng 21–100 giây mỗi màn.
- **So với Smash Fest** (từ video): màn Normal khoảng 12–30 giây, Hard 20–35 giây, Super Hard 34–36 giây.
  - Các màn Normal của City Blast nằm ở mức 21–46 giây, hơi dài hơn.
  - Citadel (78–100 giây) **dài gần gấp 3** màn Super Hard của Smash Fest, cần cắt bớt nếu muốn bám sát.

**Chỗ còn lệch so với Smash Fest (ghi thật):**
- **Checker Hall:** 21% khối cứng, trong khi Smash Fest ~50%. Nếu đặt trụ cứng ở mọi nút xen kẽ thì 1 tầng 5×2 quá cứng, nên mới đặt cứng ở tầng trệt.
- **The Spine:** 8% khối cứng, Smash Fest ~25%. Lõi chỉ có 2 trụ và các tấm sàn của lõi.
- **Cột "Lõi = yes" ở Iron Hat và Shelf Tower** là do cách đếm: các tấm sàn và tầng thép nằm ở giữa mặt bằng cũng bị tính là "lõi". Hai màn này không có lõi thật.
- **Front and Back và Iron Hat dư tới 5–8 TNT** ở một lần chạy, vì người chơi máy không ổn định giữa các lần chạy. Ngân sách đang an toàn, không chặt.
- **Người chơi trong tester là máy**, chiến thuật đơn giản (chạm 2–3 chân mỗi toà, rồi dọn đống). Người thật có thể nhanh hơn hoặc chậm hơn.

## 4. File

| File | Nội dung |
|---|---|
| `blueprints.mjs` | bản thiết kế, sửa ở đây rồi chạy lại |
| `gen.mjs`, `build.mjs` | bộ sinh level và bộ ghép build |
| `tester.js`, `run.mjs` | tester và bộ chạy (`node run.mjs` hoặc `node run.mjs B4 B9`) |
| `final.mjs`, `report.mjs` | gộp bản cuối, ảnh, bảng |
| `out/final/index-test.html` | bản thử: mở sẵn L37, có nút chọn màn |
| `out/final/index-release.html` | bản phát hành: không mở khoá, nút chọn màn ẩn |
| `out/final/shots/` | ảnh khung đầu của 10 màn |
| `out/final/results-final.json` | toàn bộ số đo |
| `out/run1.log` … `run6.log` | log từng lượt chạy |
