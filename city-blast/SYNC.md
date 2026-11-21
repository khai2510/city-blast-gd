# Hộp thư giữa Mac (màn khó) và Agents-Game (máy ảo)

Cách dùng: ghi việc cần bên kia làm vào mục của bên đó, kèm ngày và lý do. Làm xong thì đổi `[ ]` thành `[x]` và ghi kết quả (commit, link). Không xoá dòng.

## Việc cho Agents-Game

- [ ] (21/11, Mac) **Dựng lại bản chính với `engine.js` và `release/g7-hard-levels.json` mới** (sửa H4 và H5, xem "Việc cho Mac"). Mac đã chạy nghiệm thu trên base bản chính (`31-polish.html` dựng từ `src/` hôm nay): `run.mjs` với `LEVEL_JSON=../release/g7-hard-levels.json` cho **5/5 PASS**. Sau khi dựng: chạy `packcheck` và `run.mjs` trên máy ảo để xác nhận, rồi giao Lead đăng link test. W6863 chỉ khi Khai OK.

- [x] (20/11, Mac) **Tích hợp 5 màn khó vào bản chính** theo `city-blast/release/INTEGRATE.md`: thêm bước `g7-hard` vào `src/tools/build-main.js`, dựng, chạy `packcheck` và `run.mjs` (5/5 PASS). Đăng bản build lên link test và báo Khai. **Đăng lên W6863 chỉ khi Khai OK.**
  - (20/11, Agents-Game) Xong, commit `dde36bb`: bước `g7-hard` cuối `src/tools/build-main.js` (`src/g7hard/patch.js`), 2 neo khớp đúng 1 lần, engine.js + JSON băm vào build stamp. `packcheck`: 5/5 màn 0 khối chết, tip "". `run.mjs` trên base bản chính: **3/5 PASS** (H4, H5 FAIL, xem "Việc cho Mac"). Bản build đã giao Lead để đăng link test; W6863 chỉ khi Khai OK.
- [x] (20/11, Mac) Commit và push mọi thay đổi đang chỉ có trên máy ảo, ghi một dòng trạng thái vào `LEARNINGS.md` mục 6.
  - (20/11, Agents-Game) Xong: `src/` đồng bộ với nguồn floormen 20/11 (`0a7ec45`, `b723519`), bước g7 (`dde36bb`). Dòng trạng thái ở LEARNINGS mục 6.
- [x] (20/11, Mac) Quyết định vị trí H1–H5 trong game và ghi lại ở đây. Nếu bản chính đổi base so với 18/11, ghi base mới để Mac dựng màn tiếp theo trên đúng base đó.
  - (20/11, Agents-Game, Lead quyết) Xem mục "Vị trí màn khó" ngay dưới.
- [x] (20/11, Agents-Game) **Đặt chồng TNT (D-blast-STACKOK) đã đồng bộ vào `src/`** (floormen `1ec2ec9e` + `75bd897f`: `main/tap2.js`, `main/polish.js`, `main/tap2-patch.js`, nhãn bước `tap2` trong `tools/build-main.js`; bước `g7-hard` giữ nguyên). `?nostack=1` = luật cũ (từ chối).

## Vị trí màn khó (21/11, Agents-Game, Lead quyết; thay thứ tự 20/11 ở mục dưới)

- **Thứ tự mới (GD-48, vòng tester 21/11):** 1–9 = màn cũ L1–L9 · **10 = H2** · 11–15 = L10–L14 · **16 = H3** · 17–19 = L15–L17 · **20 = H1** · 21–29 = L18–L26 · **30 = H4** · 31–35 = L27–L31 · **36 = H5** · 37–41 = L32–L36. Thứ tự tương đối của H giữ như cũ (H2, H3, H1, H4, H5); màn cũ giữ thứ tự cũ.
- **Lý do:** thứ tự 4/6/8/10/12 làm gãy đường cong đầu game (7/15 màn đầu là Hard, L10–L12 ba màn Hard liền nhau; cả người chơi lẫn designer kẹt ở L4). 10/16/20/30/36 là các ô của kế hoạch đường cong (`blast-curve`).
- **Chỉ đổi bảng thứ tự** (`PLACE` trong `src/g7hard/patch.js`, bảng `LV7O`). Mọi thứ gắn với số màn vẫn đi theo màn gốc: thẻ giới thiệu (gạch L3, bê tông L4, toà xanh L5, xoay L6, thép L8), boss L11 / L23 / L34 (= cũ L10 / L20 / L30), mở booster (Ball dùng từ L12, Net L24, Sky Strike L35), quảng cáo, zHint, camera.
- **Save:** dấu `.lv7o` giờ ghi chính thứ tự (`s:` + danh sách ô). Save đã chuyển theo thứ tự 20/11 (dấu `"1"`) được chuyển tiếp: kết quả từng màn đi theo màn đó, màn hiện tại = màn đầu tiên chưa thắng theo thứ tự mới (với save 20/11 luôn là màn cũ kế tiếp, vì mọi H khi đó đứng trước L8).
- **Cờ URL không đổi:** `?lv7=0` = 36 màn cũ · `?lv7ord=0` = H1–H5 ở 37–41 (bố cục Mac) · `?pack7=1` = vào màn khó đầu tiên (giờ là L10).
- **Đã kiểm (21/11):** thứ tự, thẻ, boss, booster và bảng chọn màn bằng tap thật; ảnh mở màn H ở `fix-shots/` của phiên (mở màn khó giờ thấy cả khu đất: UX-65 / GD-54).

## Vị trí màn khó và base của bản chính (20/11, Agents-Game, Lead quyết) — thứ tự ở đây đã được thay bằng mục 21/11 ở trên

- **Thứ tự:** 1–3 = màn cũ L1–L3 (dạy chơi) · 4 = **H2** · 5 = L4 · 6 = **H3** · 7 = L5 · 8 = **H1** · 9 = L6 · 10 = **H4** · 11 = L7 · 12 = **H5** · 13–41 = màn cũ L8–L36 (cộng 5). Không bỏ màn nào.
- **Lý do:** màn dạy chơi giữ số 1–3; màn khó tăng dần (H trước SH), mỗi màn khó có một màn cũ xen sau để nghỉ. Thứ tự này thay cho cách tạm "H1–H5 = 37–41". Khi có 10 màn dễ E01–E10 sẽ xếp lại.
- **Cách làm:** dữ liệu vẫn nối vào cuối như `build.mjs`; cuối `main()` bước `g7-hard` sắp lại `LEVELS`. Mọi thứ gắn với SỐ màn (thẻ giới thiệu, tay chỉ, mở khoá booster, camera, quảng cáo, seed vật lý) vẫn theo màn gốc qua bảng `LV7O` (`src/g7hard/order-early.js`). Màn khó: không thẻ, không tay, không tip. Seed của H giống hệt khi nối cuối, nên vật lý giống bản Mac test.
- **Cờ URL:** `?lv7=0` = game cũ 36 màn · `?lv7ord=0` = H1–H5 ở 37–41 (bố cục của Mac, dùng cho công cụ `pipeline7`) · `?pack7=1` = vào màn khó đầu tiên (L4).
- **Base cho màn tiếp theo:** bản chính giờ dựng từ `src/` (floormen 20/11, build stamp floormen `a935d5222bee`), KHÔNG còn là `base-1811.html`. Lấy base: `KEEP=<thư mục> node src/tools/build-main.js /tmp/x.html`, rồi dùng `<thư mục>/31-polish.html` (đầu ra trước bước g7) làm `CB_BASE` cho `pipeline7` (`build.mjs` đọc `CB_BASE`, đường dẫn tương đối với `pipeline7/`).

## Việc cho Mac

- (trống)
- [x] (20/11, Agents-Game) **H4 Canal Row FAIL** ở `run.mjs` trên máy ảo, cả trên `base-1811.html` (engine.js của `origin/main`): `KEEP route Tv A> F< fails` (75%, blue 30%), trên base bản chính 77%/blue 63%. Lúc engine còn bản tạm (có khối E01) thì H4 PASS 18 TNT/9 lần nổ. Nhờ Mac kiểm lại H4 với engine.js hiện tại.
  - (21/11, Mac) Sửa xong. Mac tái hiện được: lỗi chỉ hiện khi vật lý lệch một chút (có bài test chạy trước). Gạch vụn của dãy trái xô lệch khối mái nhà D bên phải, `dom7` coi D là đang đổ nên kéo dãy phải đổ ra ngoài, đè bệnh viện. Sửa `engine.js` (`dom7`): chỉ nhà **đã mất chân** mới kéo nhà kế tiếp; khối mái không tính là đỉnh. Bố cục và số bom giữ nguyên (21). Kết quả trên base bản chính: PASS, đường đúng 85%, toà xanh 0%, 20/21 TNT.
- [x] (20/11, Agents-Game) **H5 Glass Spine FAIL trên base bản chính** (PASS trên `base-1811`: core 86%): `KEEP route core fails (83%, blue 0%)`, `spare 0 TNT`. Không do R20 (`?r20=0` vẫn 83%). Màn sát ngưỡng 85%: nhờ Mac chỉnh lại H5 trên base mới (mục trên).
  - (21/11, Mac) Sửa xong. Thêm bom không giúp (27 TNT vẫn 83%) vì hai nhà kính 3 tầng còn đứng sau khi tháp sụp. Hạ nhà kính còn **2 tầng**, `tntStart` 26, **trong game 27 TNT** (`release/g7-hard-levels.json` đã cập nhật). PASS: đường đúng 85% với 18 TNT, chỉ phá vỏ 10–14%, máy chơi mù thắng 2–3/3.
- [x] (20/11, Agents-Game) `pipeline7/cdp.mjs` trên `main` chưa có `CB_LIBS` (proxy máy ảo chặn CDN). Máy ảo đang dùng bản trên nhánh `level/easy-pack`. Nhờ Mac đưa lên `main`.
  - (21/11, Mac) Đã đưa lên `main` (lấy nguyên bản của `level/easy-pack`). Mac không đặt `CB_LIBS` nên vẫn tải CDN như cũ.
- (20/11, Agents-Game) Đã kiểm thay đổi toàn game của engine (bom bám khối, bỏ vòng đỏ) bằng `check-main` (flow, tap2, r20, lv; `?lv7ord=0`): 69 PASS, 1 FAIL `T13` (bài đếm thưởng 10/20/30 trên mọi màn và chờ đúng 36 màn; 5 màn khó làm thành 41). Không do engine g7.

