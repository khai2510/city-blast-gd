# City Blast: bài học khi làm màn khó (cập nhật 20/11)

File này là **bộ nhớ chung** của mọi máy và mọi agent làm màn City Blast:
- **Đọc hết trước khi làm.**
- Xong việc thì **ghi thêm** bài học mới vào cuối mục liên quan (ngày, màn, một câu vì sao).
- Chi tiết quy trình nằm ở `levels-gd/LEVEL-PROCESS.md`. Cơ chế độ khó nằm ở `levels-gd/DIFFICULTY-MECHANICS.md`.

## 1. Mục tiêu của Khai cho màn khó

- Không thắng được bằng: **1 quả bom**; **dồn hết bom ở chân**; **đặt hết bom rồi bấm BLAST một lần**.
- Mỗi màn dạy **một kỹ năng khác nhau**. Câu chuyện chung: **nổ từ từ, mỗi lần nổ có mục đích**.
- Chất lượng ngang L32 "Sky Saucer": công trình có dáng, chi tiết, nội thất, phá vỏ thì thấy bên trong.
- **Không gợi ý**: không mũi tên, không câu nhắc lúc mở màn, không toast. Chỉ có câu báo khi thua: ≤ 9 chữ, nói nguyên tắc, không chỉ chỗ.
- **Toà phụ đồ sộ** (10–25 m, có chi tiết), không phải mấy khối nhỏ.
- Mỗi màn có ít nhất **một chuỗi phản ứng (wow)** và **một khoảnh khắc nhận ra**.
- **Bố cục có trật tự** (góp ý Màn 3):
  - xếp theo kiến trúc thật của công trình (nhà hát: sảnh, khán phòng, tháp trên một trục);
  - toà phụ và toà xanh đối xứng hoặc thẳng hàng: cùng cỡ, khoảng cách bằng nhau, mép thẳng với tường toà chính;
  - camera gần chính diện;
  - không bao giờ đặt "cho vừa chỗ trống".
- Công trình: **lấy cảm hứng, không sao chép** (`levels-gd/LANDMARKS.md`). Không trùng các landmark đã có trong game.

## 1b. Toà phụ và bố cục: luật cụ thể (rút ra từ H2–H5, góp ý Khai 20/11)

**Chất lượng toà phụ**
- Toà phụ **cùng chuẩn với toà chính**: builder riêng, kết cấu thật (cột, sàn, vách), mái thật, cửa và đèn, có **nội thất** để phá vỏ thì có cái để thấy (H3: màn nhung đỏ, ghế, đèn chùm; H2: bàn ghế trong Đại sảnh). Không dùng hộp xếp chồng.
- **Mỗi toà phụ một vai**: đích của chuỗi (H2 Đại sảnh), lá chắn che chân an toàn (H3 sảnh và khán phòng), mắt xích domino (H4 dãy nhà), bối cảnh bị chuỗi đè (H5 nhà kính). Không có toà nào chỉ để lấp chỗ.
- **Toà phụ không lặp câu đố của toà chính.** H5 v1: hai nhà kính cũng có lõi giấu trong bệ, nên tốn bom gấp ba mà không dạy thêm gì. Đã đổi thành nhà kính thường, dễ phá.
- Mái và đầu hồi phải là **khối thật**; decor nằm sát, trong đường bao của khối nó gắn vào (xem mục 5 "mái lơ lửng").

**Bố cục**
- **Một trục**, xếp theo kiến trúc thật: nhà hát thì sảnh, khán phòng, tháp sân khấu; tháp kính thì bệ đến thân rồi vương miện; dãy phố thì tháp ở giữa quảng trường.
- **Đối xứng qua trục**: toà xanh và toà phụ thành cặp **cùng cỡ, cùng chiều cao, cùng khoảng cách** (H3: bệnh viện và trường học hai bên tháp, cùng 4 tầng, cách 3.5 m; H4: trường học và bệnh viện hai đầu; H5: hai nhà kính giống hệt nhau).
- **Mép thẳng hàng**: mặt tiền một dãy thẳng một hàng; mép trước toà xanh thẳng với tường sau khán phòng (H3).
- **Nhịp đều**: cùng bề ngang, khe đều. Chiều cao đổi đều từng bậc (H4: 5, 4, 3 tầng về phía tháp; mỗi nhà khác nhà bên một tầng).
- **Camera gần chính diện** (`yaw` khoảng 0.08–0.12) để thấy trục. Toà xanh phải **lộ ra ở góc mở màn**: thu hẹp toà chính (H3: sảnh 16 m thay vì 22 m) hoặc đặt toà xanh ra ngoài bề ngang toà chính.

**Khoảng cách do vật lý quyết định, rồi mới làm đều**
- **Khe giữa các nhà ≥ 2.5 m** để chân giữa chạm được (khe 1–2 m: chân giữa bị chân góc che từ mọi góc).
- **Domino**: chiều cao nhà > khoảng cách tới nhà kế (để chạm), nhưng < khoảng cách nhảy qua quảng trường (để chuỗi dừng đúng chỗ). H4: nhà 14 m, khe tới tháp 4 m, qua quảng trường 13 m.
- **Toà xanh**: đủ gần để đổ sai hướng là trúng (H3: 3.5 m cạnh tháp 22 m), nhưng không đứng chắn đường đổ đúng.
- **Chân an toàn**: phải bị che từ **cả 4 góc xoay camera**, không chỉ góc mở màn. Lấp khe nhìn trộm bằng cách cho mép toà khác thẳng hàng (H3: dịch toà xanh lên thẳng tường sau khán phòng).

**Kiểm bằng mắt trước khi chạy tester**: `shotlv.mjs` (ảnh mở màn), `closeup.mjs` (cận cảnh mái, khe hở), bản vẽ Figma có ghi "1 m = N px".

## 2. Quy trình 4 bước (mỗi màn một lượt, xong màn nào gửi Khai màn đó)

1. **GD spec** (`Lxx/1-GD-SPEC.md`): bài học, hình khối, vật liệu, vai từng toà, khoảnh khắc nhận ra, wow, bảng tester.
2. **Figma** (file "City Blast — Level Designs", `lPChMUu7HoLizIXGtMa5uj`): mặt bằng, mặt đứng, khung "How it plays". Mũi tên chỉ có trên bản vẽ, không có trong game.
3. **Builder** (`pipeline7/engine.js`, mỗi màn một khối `V5_PARTS.g7…`) và `Lxx/make-level.mjs` sinh ra `level.json`.
4. **Tester**: lệnh `LEVEL_JSON=../levels-gd/Lxx/level.json node run.mjs`. Đạt hết thì ghép gói, lên link test, gửi ảnh, viết `Lxx-SUMMARY.md`.

## 3. Tester: đo gì, khi nào là đạt

| Bài | Ngưỡng đạt |
|---|---|
| oneBomb (quả tốt nhất) | < 70% |
| allFoot (toàn bộ bom ở chân, 1 lần) / footOnly (6 quả mỗi đợt, chỉ chân) / oneWave (hết bom, 1 lần) | < 80%, **hoặc** làm hư toà xanh > 5% |
| Bài riêng của màn (aim / keepRoutes / seqRoutes) | đường đúng thắng, đường sai thua |
| Bom dư của đường đúng | N ≥ 2, H/SH ≥ 1 |

- **`reach4`**: chỉ đặt bom vào khối mà ngón tay chạm được từ 1 trong 4 góc camera (vuốt xoay 90°). Một khối tính là chạm được nếu tâm **hoặc** một điểm sát mặt khối là thứ đầu tiên dưới ngón tay. Chỉ xét tâm thì quá khắt khe: chân giữa nằm giữa hai vách luôn bị coi là "không chạm được".
- Máy chơi "mù" (`fair`) không biết toà xanh hay hướng đổ. Ở màn có bài riêng, nó thua là đúng.
- Máy dọn dẹp tốn bom hơn người, nên khi đo "bom dư" phải nhớ điều này.

## 4. Cơ chế trong `engine.js` (bật bằng trường của level)

| Trường | Tác dụng | Màn |
|---|---|---|
| `drop7 {keys}` | khối phải **rơi trước** rồi mới phá được (xét lúc bấm BLAST) | 1 |
| `layer7 {keys, n}` | mỗi lần nổ chỉ bóc **1 nấc**; hrc cần 3 lần nổ. Đặt thêm bom trong cùng một lần nổ không bóc thêm nấc nào | 2, 4 |
| `cap7` | tối đa n quả mỗi lần nổ | |
| `hit7 {keys, armor, f, reach, fuel, drums}` | TNT không phá được, chỉ vỡ khi **bị toà khác đổ đè**; thùng thuốc súng bị đè thì nổ | 2 |
| `keeps:[keep6]` + `keep` | toà xanh (bệnh viện, trường): hư > 5% là thua | 3, 4 |
| `dom7 {parts}` | **domino**: nhà đang nghiêng (đỉnh lệch > 1.5 m theo hàng, còn cao > 35%) chồm qua nhà kế bên thì nhà đó gãy chân phía xa và đổ cùng chiều | 4 |
| `keepRoutes` / `seqRoutes` | bài riêng của tester: chuỗi bước (dỡ phần che, nghiêng phần nào, về hướng nào) | 3 / 4 |
| tip rule (`M14.api.tip`) | phá 2 chân cạnh nhau thì toà đổ về phía đó | mọi màn |

Đã sửa thêm: **bom bám theo khối** nó được đặt lên khi toà sập; khối vỡ thì bom rơi xuống đất. **Bỏ vòng đỏ** quanh bom.

## 5. Lỗi đã gặp và cách tránh (đọc kỹ)

- **Tầng trên lơ lửng 0.42 m** (`y += t`) làm cột chết ngay lúc dựng. Tầng phải đặt sát mặt sàn.
- **Đường cong phẳng** (12 bom vẫn 3%): mọi cột đều hrc. Cột giữa dùng `rc`, chỉ cột góc dùng hrc.
- **drop7 v1 vẫn thắng trong 1 lần nổ**: khối rơi giữa loạt nổ. Phải xét trạng thái **lúc bấm BLAST**.
- **Thùng thuốc súng không nổ**: đặt ở tầng trệt thì bị vùi. Đặt ở tầng trên cùng thì sàn sụp, thùng rơi mạnh và nổ.
- **Tip rule chia 8 hướng** (góc, giữa, góc trên mỗi mặt). Nếu một mặt chỉ có 2 chân góc thì toà **không bao giờ nghiêng** về mặt đó. Luôn dùng `nx:3, nz:3`.
- **Chân giữa nằm trong khe hẹp** (≤ 2 m) bị chân góc phía trước che đúng một đường nhìn. Dùng khe ≥ 2.5 m và `reach4` có lấy mẫu điểm sát mặt.
- **Toà xanh bị toà khác che** ở góc camera mở màn: thu hẹp toà chính hoặc đặt toà xanh lộ ra hai bên.
- **Domino quá nhạy**: mảnh vách bay sang cũng kích hoạt chuỗi, 1 bom làm sập 99%. Chỉ tính khi **đỉnh nhà còn nguyên** nghiêng **theo hàng** (|dx| > |dz|), còn cao > 35% chiều cao ban đầu, và đã chồm qua mép nhà kế bên.
- **Tháp đổ ra trước trôi sang ngang** kích hoạt dãy bên cạnh: thêm điều kiện |dx| > |dz|.
- **Nhà cuối dãy nhảy qua quảng trường**: chiều cao nhà phải nhỏ hơn khoảng cách tới dãy bên kia, nhưng lớn hơn khoảng cách tới tháp giữa.
- **hit7 phá nhầm chân đá** khi mảnh vỡ rơi gần. Ở màn domino đặt `hit7.f = 0`.
- **Kẽ hở "nổ một lần"**: hai chuỗi cùng đổ vào một lúc kẹp tháp đứng yên mà vẫn thắng. Chân nhà khởi động phải là hrc (cần nhiều lần nổ).
- **Bộ test treo**: không có lệnh `timeout` trên Mac. Dùng `perl -e 'alarm 2700; exec @ARGV' node run.mjs`. **Không chạy 2 Chrome headless song song**: chậm và dễ treo.
- **Đồng bộ (20/11):** máy ảo đã sửa `cdp.mjs`, còn Mac lại copy từ thư mục cũ sang repo nên suýt ghi đè sửa đổi đó. Từ nay **làm thẳng trong repo** (Mac: `~/Desktop/games/blast/{levels-gd,pipeline7}` là symlink vào repo) và **`git pull --rebase` trước mỗi lần push**. Tester trên Linux: `CHROME=<đường dẫn chromium>` (máy ảo: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`).
- **Mái lơ lửng (Khai 20/11, Màn 4):**
  - Lỗi: mái dốc và đầu hồi cao hơn 3 m chỉ là decor gắn vào sàn trên cùng nên trông hở ngay lúc mở màn, và nhô ra không trung khi nhà đổ.
  - Luật mới: **mái là một khối thật** (tầng áp mái, `wwall`), còn decor mái phải **nằm sát, trong đường bao của khối nó gắn vào**. Không để decor lớn chìa ra khỏi khối chủ.
  - Kiểm bằng `pipeline7/closeup.mjs` (camera cận cảnh) và `floatcheck.mjs` (khe hở tĩnh). Dùng `hangcheck.mjs` để tìm khối còn treo trên cao sau khi nổ.
- **Lõi nhiều tầng (Màn 5):** trụ lõi tầng trên mà dùng `rc` (khối cứng) thì nằm trong đống đổ nát vẫn bị tính là "còn đứng", nên không thắng nổi. Còn dùng bê tông thường thì 1 lần nổ cắt ngang thân tháp là xong. Giải pháp là key `core7`: bóc 1 nấc mỗi lần nổ (layer7) nhưng tính là đã đổ khi rơi xuống.
- **Domino bị gạch vụn kích hoạt (21/11, H4):**
  - Lỗi: sau khi mái thành khối thật, "đỉnh nhà" mà `dom7` theo dõi là khối mái. Gạch vụn của dãy trái văng qua quảng trường xô lệch nhà D bên phải 1.5 m. Luật coi D đang đổ nên kéo E, F đổ ra ngoài, đè lên bệnh viện (toà xanh hư 63%).
  - Lỗi chỉ hiện khi vật lý lệch một chút: có bài test chạy trước thì có, chạy riêng thì không. Máy ảo và Mac đều gặp. Nghĩa là người chơi thật cũng sẽ gặp.
  - Luật mới: **chỉ nhà đã mất ít nhất 1 chân** (do người chơi nổ hoặc do chuỗi làm gãy) mới được kéo nhà kế tiếp. Khối mái (`dom7roof`) không bao giờ là đỉnh để đo.
  - Cách dò: `pipeline7/out/probe4.mjs` (không commit) ghi % điểm, hư hại từng toà xanh và độ cao từng nhà sau mỗi đợt nổ. Thêm `PRE=1` để chạy một bài test trước, tái hiện lỗi do vật lý lệch.
- **Đổi base thì điểm đổi (21/11, H5):** trên base bản chính, đường đúng của H5 chỉ được 83%: tháp sụp cho 79%, sau đó dọn mãi không lên vì hai nhà kính 3 tầng vẫn đứng. Thêm bom không giúp được. Sửa bằng thiết kế: nhà kính còn 2 tầng để tháp lõi chiếm phần lớn điểm (đúng bài học của màn). **Màn khó mới phải dựng và test trên base bản chính** (`SYNC.md`, mục base), không dùng `base-1811` nữa.
- **Sửa toàn game có thể phá màn đã PASS:** bản sửa "bom đi theo khối" (20/11) và mái khối thật ra đời sau lần H4 PASS mà chưa chạy lại. Sau mỗi thay đổi engine hay base: **chạy lại cả 5 màn** bằng `run.mjs` với `LEVEL_JSON=../release/g7-hard-levels.json`.
- `T.chargeHosts` không tồn tại; dùng `__blast.chargeHosts()`, `__blast.members()`, `__blast.test.pickAt(x, y)`.

## 6. Trạng thái các màn khó (20/11). Mã H1–H5 không phải vị trí; vị trí do Agents-Game (main) quyết định

| Mã | Tên | Bài học | Trạng thái |
|---|---|---|---|
| H1 | Five Eaves (chùa 5 mái) | làm rơi trước, phá sau | PASS, 37 TNT, Khai duyệt |
| H2 | Watch Keep | ngắm hướng đổ, chuỗi đè sảnh, kho thuốc súng | PASS, 25 TNT |
| H3 | Grand Stage (nhà hát) | giữ toà xanh: dỡ sảnh và khán phòng, tháp đổ dọc trục | PASS, 24 TNT, bố cục v2 đối xứng |
| H4 | Canal Row (dãy nhà phố) | domino đối xứng: phá tháp giữa trước, đẩy hai dãy vào trong | PASS trên base bản chính (21/11), 21 TNT, SH; luật domino chỉ tính nhà đã gãy chân |
| H5 | Glass Spine (tháp kính lõi bê tông) | bóc vỏ bệ, đục lõi 3 lần nổ | PASS trên base bản chính (21/11), 27 TNT, SH; nhà kính hai bên 2 tầng |

Link test (artifact, private): https://claude.ai/artifact/CDNLd5gsjLaTaPGT7W4pes. Không sửa artifact chính W6863… khi chưa có OK của Khai.

- **20/11 (Agents-Game):** H1–H5 đã vào bản chính (bước `g7-hard`, `dde36bb`), base mới = `src/` (floormen 20/11). Vị trí: H2 = 4, H3 = 6, H1 = 8, H4 = 10, H5 = 12, màn cũ xen giữa (SYNC.md). `run.mjs` trên base mới: H1–H3 PASS, H4 FAIL (cả trên base-1811), H5 FAIL 83% (PASS trên base-1811). Bài học: chạy tester trên đúng base sẽ đăng; và không chuyển nhánh trong thư mục repo người khác đang dùng (một lần build đã đọc nhầm engine.js của nhánh khác).

## 7. Chia việc giữa máy chủ (Mac) và máy ảo

- **Repo này là nguồn sự thật.** Bắt đầu phiên thì `git pull`. Xong một việc thì commit và push (không force).
- **Mỗi máy một màn, một thư mục `levels-gd/Lxx/`.** Không sửa thư mục màn của máy kia.
- `engine.js` và `tester.js` là file chung. Sửa thì đặt khối mới vào **đúng vị trí đánh dấu** (trước `// ---- levels ---` và trước `window.P7 = {`), commit sớm, ghi một dòng vào mục 5.
- Gợi ý:
  - Mac: thiết kế, Figma, chốt bản lên link test.
  - Máy ảo: chạy bộ test nặng (mỗi lần 4–11 phút, chỉ 1 Chrome), làm song song màn tiếp theo trên nhánh `level/Lxx`.
