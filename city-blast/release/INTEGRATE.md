# Bàn giao: 5 màn khó (g7) đưa vào bản chính City Blast

Người gửi: Mac (agent màn khó), 20/11. Người nhận: Agents-Game (máy ảo), phụ trách dựng và đăng bản chính.
Khai đã duyệt toàn bộ thay đổi trong gói này để đưa lên `main`. **Đăng lên bản chính W6863CXQSyGGhusBrTSyc9 vẫn cần Khai OK lần cuối** sau khi chơi bản build.

## 1. Trong gói có gì

| File | Là gì |
|---|---|
| `release/g7-hard-levels.json` | dữ liệu 5 màn khó, **đã chốt số bom** (`charges.tnt`) |
| `release/index-hard5-release.html` | bản build tham chiếu: base 18/11 + engine g7 + 5 màn nối tạm vào cuối danh sách (`test=false`). Mở `?pack7=1` để nhảy tới màn khó đầu tiên |
| `pipeline7/engine.js` | engine g7: mọi cơ chế mới và builder công trình. Tiêm vào **cuối `main()`** |
| `pipeline7/build.mjs` | cách tiêm đang dùng (2 điểm neo, xem mục 3) |
| `pipeline7/tester.js`, `run.mjs` và các script `*.mjs` | tester và công cụ nội bộ (xem `TOOLS.md`) |
| `levels-gd/Lxx/` | spec, `make-level.mjs`, tóm tắt kết quả, ảnh, bản vẽ Figma của từng màn |
| `LEARNINGS.md` | mọi bài học và lỗi đã gặp. **Đọc trước** |

Mã màn khó là **H1–H5** (trường `bp` trong JSON). Đây là mã nhận diện, **không phải vị trí** trong game.

| Mã | Tên | bp | Bậc | TNT | Bài học |
|---|---|---|---|---|---|
| H1 | Five Eaves | L01v4 | SH | 37 | làm rơi trước, phá sau (`drop7`) |
| H2 | Watch Keep | L02 | H | 25 | ngắm hướng đổ; chuỗi đè sảnh, kho thuốc súng (`hit7`, `layer7`) |
| H3 | Grand Stage | L03 | H | 24 | giữ toà xanh: dỡ sảnh và khán phòng, tháp đổ dọc trục (`keeps`) |
| H4 | Canal Row | L04 | SH | 21 | domino đối xứng: phá tháp giữa trước (`dom7`, `layer7`) |
| H5 | Glass Spine | L05 | SH | 26 | bóc vỏ thấy lõi (`layer7` với `hrc` và `core7`) |

## 2. Thay đổi ảnh hưởng **toàn game** (không chỉ 5 màn) trong `engine.js`

1. **Bom bám theo khối** (bọc `fixedStep`): bom chưa nổ đi theo khối nó được đặt lên; khối vỡ thì bom rơi xuống đất. Sửa lỗi bom treo lơ lửng (Khai báo 20/11).
2. **Bỏ vòng đỏ** quanh bom (bọc `placeCharge`: `ghost.visible = false`).
3. Hook test (vô hại ngoài test): `__blast.lv7.view(k)`, `closeUp()`, `kdGap()`, `info()`.

Còn lại đều chỉ bật khi level có trường tương ứng: `drop7`, `layer7`, `cap7`, `hit7`, `dom7`, `hard7`, `stage7`, `rack7`. Màn 1–36 không có các trường này nên không đổi hành vi, trừ 2 điểm ở trên.

## 3. Cách đưa vào `src/tools/build-main.js`

Thêm **một bước mới ở cuối chuỗi** (sau mọi bước hiện có, vì engine g7 bọc các hàm của bản cuối), ví dụ `g7-hard`. Bước này làm đúng những gì `pipeline7/build.mjs` đang làm (`test=false`):
- **Engine:** chèn nội dung `pipeline7/engine.js` ngay trước chuỗi neo `} // main\n})();` (neo phải xuất hiện đúng 1 lần).
- **Dữ liệu màn:** chèn khối `main/levels7-data.js`, gồm `LV7DEFS = <release/g7-hard-levels.json>` đẩy vào `LEVELS`, đặt `window.__lv7base`, ngay trước `try{\n// ---- UILAYOUT v2`.
- Bỏ phần `test=true` (nút chọn màn, nhảy thẳng tới màn 37).
- Cờ URL: `?lv7=0` tắt 5 màn; `?pack7=1` nhảy thẳng tới màn khó đầu tiên.
- **Vị trí màn: Agents-Game (main) quyết định.** Có thể đặt H1–H5 xen giữa, theo thứ tự hay đổi thứ tự, tuỳ đường độ khó của cả game. `build.mjs` chỉ nối tạm vào cuối danh sách để test. Số bom và bậc đã cân cho từng màn riêng lẻ, không phụ thuộc vị trí.
- Base của gói là bản 18/11 (`pipeline7/base-1811.html` = W6863 lúc 18/11, chưa có fix4). Nếu bản chính đã đổi thì chạy lại build và `packcheck`. Neo không khớp thì dừng lại và báo vào `SYNC.md`, đừng sửa neo theo cảm tính.

## 4. Kiểm tra sau khi tích hợp

```bash
cd city-blast/pipeline7
N=5 node packcheck.mjs <bản-build.html>
LEVEL_JSON=../release/g7-hard-levels.json perl -e 'alarm 3000; exec @ARGV' node run.mjs
```
- `packcheck`: mỗi màn có 0 khối chết lúc dựng, và `tip ""` (không gợi ý).
- `run.mjs`: cả 5 màn phải PASS. Trên Linux đặt thêm `CHROME=<chromium>`. Không chạy 2 Chrome cùng lúc.
- **Không chạy lại màn 1–36 cũ** bằng tester này (Khai dặn).

## 5. Chưa xong, cần biết

- Chưa có người thật chơi thử Màn 2–5.
- Màn 5: máy chơi "mù" thắng 3/3. Màn công bằng nhưng có thể dễ hơn ý Khai.
- Màn 1: kiểm tra footOnly nằm đúng ngưỡng 80%.
