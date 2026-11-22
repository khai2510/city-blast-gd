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
- **Máy ảo Linux không tải được three.js và rapier (20/11, E01):** proxy chặn cdnjs và jsdelivr, nên trang game không có `__blast`. Sửa trong `cdp.mjs`: đặt `CB_LIBS=<thư mục>` có `three-r128.min.js` và `rapier3d-compat-0.19.3.mjs`, cdp sẽ chặn hai request CDN và trả file local (DevTools `Fetch`). Không đặt `CB_LIBS` thì chạy như cũ (Mac). Trên máy ảo dùng `timeout 2700` thay cho perl alarm.
- **Sàn hero chống nổ (`a1mdC`, do `boxSt` tự đổi `mdC`) nằm trong đống đổ nát thì không bom nào phá được** (E01 lượt A: máy chơi kẹt ở 82–84% dù có 40 TNT, vì sàn nằm cao hơn 1.5 m vẫn bị tính một nửa). Màn dễ: đổi sàn về `mdC` thường và bật `drop7 {keys:['mdC']}`. Sàn còn đứng thì miễn nhiễm TNT, nên bom vào mặt tiền chỉ được 2%; sàn đã rơi thì 1 TNT là vỡ.
- **Chân còn đứng bị đống đổ nát che** thì không chạm được từ góc mở màn, nhưng vẫn bị tính đủ khối lượng. Máy chơi không bao giờ nhắm tới chúng (pha "heap" chỉ nhắm khối đã đổ). Giữ chân nhẹ (E01: trụ 1.05 m) để chân sót lại không giữ % ở dưới ngưỡng.
- **Mái lơ lửng (Khai 20/11, Màn 4):**
  - Lỗi: mái dốc và đầu hồi cao hơn 3 m chỉ là decor gắn vào sàn trên cùng nên trông hở ngay lúc mở màn, và nhô ra không trung khi nhà đổ.
  - Luật mới: **mái là một khối thật** (tầng áp mái, `wwall`), còn decor mái phải **nằm sát, trong đường bao của khối nó gắn vào**. Không để decor lớn chìa ra khỏi khối chủ.
  - Kiểm bằng `pipeline7/closeup.mjs` (camera cận cảnh) và `floatcheck.mjs` (khe hở tĩnh). Dùng `hangcheck.mjs` để tìm khối còn treo trên cao sau khi nổ.
- **Lõi nhiều tầng (Màn 5):** trụ lõi tầng trên mà dùng `rc` (khối cứng) thì nằm trong đống đổ nát vẫn bị tính là "còn đứng", nên không thắng nổi. Còn dùng bê tông thường thì 1 lần nổ cắt ngang thân tháp là xong. Giải pháp là key `core7`: bóc 1 nấc mỗi lần nổ (layer7) nhưng tính là đã đổ khi rơi xuống.
- `T.chargeHosts` không tồn tại; dùng `__blast.chargeHosts()`, `__blast.members()`, `__blast.test.pickAt(x, y)`.
- **Thư mục repo dùng chung (20/11, gói dễ):** máy ảo có nhiều agent cùng làm trong `/home/user/city-blast-gd` (agent tích hợp bản chính để sửa dở trong `src/` và build đọc thẳng `city-blast/pipeline7/engine.js` trong thư mục đó). **Không checkout nhánh khác trong thư mục chung.** Làm màn trong worktree riêng: `git worktree add <thư mục> level/<nhánh>`.
- **`hit7.armor: 0` không có nghĩa là "TNT phá bình thường"** (E02/E06): engine viết `L.hit7.armor || 0.97`, nên 0 bị đổi thành 0.97 và khối hit7 miễn nhiễm TNT. Muốn khối vừa bị toà đổ đè phá, vừa bị TNT phá: đặt `armor: 0.001`. Lưu ý thêm: khối đang rơi mà có key nằm trong `hit7.keys` thì không tính là "vật đè", nên toà đổ và toà bị đè phải khác key (E06: gạch ống khói dùng key riêng `g7bk` / `g7bkw`).
- **Khối nặng (hard7v) giấu trong toà còn đứng làm máy chơi kẹt** (E06 lượt đầu: nồi hơi đặt trong nhà lò). Máy chơi đánh "chân" là khối thấp nhất, tức là nồi hơi nằm sau tường, nên không chạm được và kẹt ở 47–50% với 40 TNT. Khối nặng phải đặt trên cao hoặc nhìn thấy được (két nước trên mái).
- **Cảnh rộng quá ~35 m thì chân nhỏ trên màn hình** (E06 hai ống khói, 42 m): quả bom (sprite ≥ 34 px) che luôn chân bên cạnh, lần chạm sau chọn trúng quả bom chứ không đặt quả mới. Người chơi thật cũng bị vậy. Giữ cảnh ≤ 35 m hoặc chân cách nhau ≥ 3 m.
- **Mái gỗ nhẹ rơi xuống còn nguyên tấm che mất khối nặng** (E03 lượt D: máy chơi còn 11 TNT mà không chạm được két nước nằm dưới tấm mái). Mái kho xe điện dùng key `g7roofD` (vỡ khi chạm đất, `shatter` 3.5).
- **allFoot trúng cả khối nặng đang rơi** (E03): bom trong một lần nổ nổ cách nhau 0,2 giây, nên với 17+ quả, mấy quả cuối trúng két nước vừa rơi xuống chân và làm vỡ nó. Cách giữ allFoot < 80%: phần khối nặng ≥ 30% khối lượng, ngân sách sát.
- **Probe lỗi giữa chừng để lại Chrome mồ côi** (20/11, `curveprobe.mjs` gặp exception trước `proc.kill()`): vòng chờ "chỉ một Chrome" của mọi agent kẹt theo. Thấy Chrome chạy lâu mà không có node nào của mình thì kiểm `--user-data-dir` rồi kill đúng tiến trình đó.
- **Khối nặng rơi ra ngoài khung hình thì máy chơi kẹt** (E04: nắp đá nặng trên nhà cân ở mép cảnh lăn ra ngoài, máy chơi dừng ở 83–84% còn 26 TNT). Khối nặng phải nằm ở giữa cảnh hoặc rơi vào trong.
- **Màn dạy luật nghiêng không đạt được "không nhảy quá 40 điểm"** (E02): 1 bom ở chân thì 1%, 2 bom cạnh nhau thì cả tháp đổ (56%). Cú nhảy đó chính là bài học. Muốn đạt thì phải thêm rất nhiều khối nặng (+8 TNT dọn dẹp). Chờ Khai quyết.
- **Old polish (22/11, Agents-Game): tutorial and early levels.** (1) A rebuilt level REPLACES its old level in place (`release/g7-old-levels.json`, `LV7O.isO`, `?oldlv=1` = the old one): the slot, save, seed, intro card and L1 / L2 hand stay, because they key on the old level's index; the hand and the material spotlight read `L.sol`, so every rebuild carries one. (2) Normal levels open front-on (`sflay.js` S6): only the front row of legs can be tapped before the rotate lesson, so a main building always falls TOWARDS the camera; its chain target ("landing") stands in front on the axis. (3) A squat hero (height < ~3× its base) does not fall over: the near piers go, it drops the storey height and sits (O02 / O03 / O10 run A). Slender heroes (≥ 3.5×) and the BASE `shove` (2.5 m/s, an existing option) lay it down across a landing 4 m in front, low enough (≤ 4 m) that the legs stay in view. (4) `boxSt` / `octSt` decks come out as A1's blast-proof hero floors (mdC → a1mdC): the g7o builders turn them back to plain floors after building (E01 lesson). (5) The fair bot spends up to 3 TNT a building a blast, so a 4-building scene needs ~12 TNT for the bot; at the tutorial budget (5, D-blast-K2) it only wins if the main building's fall takes the others (O01), and with 2 buildings the base score's height term makes one bomb win (oneBomb 88–100 %). (6) Before the dark card (slot 17) there is no heavy piece that counts until broken, so "all TNT at the foot" wins on every early level (allFoot 88–100 %): reported, not enforced, until 17 (OLD-POLISH.md).
- **/dev/shm fills up with headless profiles (22/11, Agents-Game):** `pipeline7/cdp.mjs` makes a `cb-headless-*` profile per launch in TMPDIR and never deletes it; with TMPDIR=/dev/shm, 182 of them held 7.1 GB of the shared memory and the kernel started killing processes. Clean the ones no running Chrome uses (`ps -eo args | grep user-data-dir`) and older than 10 min.

## 6. Trạng thái các màn khó (20/11). Mã H1–H5 không phải vị trí; vị trí do Agents-Game (main) quyết định

| Mã | Tên | Bài học | Trạng thái |
|---|---|---|---|
| H1 | Five Eaves (chùa 5 mái) | làm rơi trước, phá sau | PASS, 37 TNT, Khai duyệt |
| H2 | Watch Keep | ngắm hướng đổ, chuỗi đè sảnh, kho thuốc súng | PASS, 25 TNT |
| H3 | Grand Stage (nhà hát) | giữ toà xanh: dỡ sảnh và khán phòng, tháp đổ dọc trục | PASS, 24 TNT, bố cục v2 đối xứng |
| H4 | Canal Row (dãy nhà phố) | domino đối xứng: phá tháp giữa trước, đẩy hai dãy vào trong | PASS, 21 TNT, SH; mái là khối thật |
| H5 | Glass Spine (tháp kính lõi bê tông) | bóc vỏ bệ, đục lõi 3 lần nổ | PASS, 26 TNT, SH |
| E01 | Long Legs (gói dễ, toà ở nâng trên cột) | đánh vào chân; chuỗi: khối đầu đổ, thùng đỏ nổ, nhà câu lạc bộ sập | PASS, 19 TNT, N, nhánh `level/easy-pack`; kế hoạch E02–E10 ở `levels-gd/EASY-PACK.md` |
| E03 | Tram Depot (gói dễ, slot 4, FEEL: kho xe điện 3 gian, 2 trạm tín hiệu) | thùng đỏ nổ miễn phí: 1 TNT cạnh thùng, 11 thùng nổ dây chuyền dọc mặt tiền, 3 gian đổ về trước; két nước trên mái rơi nguyên và vẫn tính | PASS (thanh gói dễ), 19 TNT, N, lượt H và I; oneBomb 51%, allFoot 72%, đường cong nhảy tối đa +31 |
| E02 | Shot Tower (gói dễ, slot 6, TEACH: tháp bắn chì trên 8 chân, 2 kho hàng gỗ hai bên) | phá 2 chân cạnh nhau thì tháp đổ về phía đó; đổ sang bên thì đè bẹp kho; đổ ra trước thì rơi xuống bãi trống | PASS thanh gói dễ trừ đường cong (1 → 2 bom: +54, chờ Khai), 23 TNT, N |
| E06 | Boiler Stack (gói dễ, slot 7, COMBINE: ống khói gạch trên 8 chân cạnh nhà lò hơi) | chân + hướng đổ: mở phía nhà lò thì ống khói nằm dọc mái, 1 cú đổ phá 2 toà (48% so với 33%) | PASS (thanh gói dễ), 17 TNT, N, lượt B và C; đường cong nhảy tối đa +32 |
| E04 | Market Hall (gói dễ, slot 9, TEACH: chợ gỗ 3 gian sau dãy vòm gạch, 2 nhà cân) | gỗ đổ dễ, gạch là lá chắn: 1 TNT vào gỗ gập cả gian, 1 TNT vào gạch chỉ mất một trụ; mái ngói rơi nguyên và vẫn tính | PASS (thanh gói dễ), 19 TNT, N, lượt I và J; đường cong nhảy tối đa +26 |

- **21/11 (Khai quyết):** H4 và H5 giữ bản 20/11. Bản sửa của Mac (`a7c92bf`: luật `dom7` chỉ tính nhà đã gãy chân; H5 nhà kính 2 tầng, 27 TNT) đã revert. Trên base bản chính, `run.mjs` cho H4 và H5 FAIL như trước; không tự sửa lại khi Khai chưa yêu cầu.

Link test (artifact, private): https://claude.ai/artifact/CDNLd5gsjLaTaPGT7W4pes. Không sửa artifact chính W6863… khi chưa có OK của Khai.

- **20/11 (Agents-Game):** H1–H5 đã vào bản chính (bước `g7-hard`, `dde36bb`), base mới = `src/` (floormen 20/11). Vị trí: H2 = 4, H3 = 6, H1 = 8, H4 = 10, H5 = 12, màn cũ xen giữa (SYNC.md). `run.mjs` trên base mới: H1–H3 PASS, H4 FAIL (cả trên base-1811), H5 FAIL 83% (PASS trên base-1811). Bài học: chạy tester trên đúng base sẽ đăng; và không chuyển nhánh trong thư mục repo người khác đang dùng (một lần build đã đọc nhầm engine.js của nhánh khác).
- **22/11 (Agents-Game, old polish):** 12 early slots rebuilt to the easy-pack bar and wired in place of their old levels (`levels-gd/OLD-POLISH.md`, `?oldlv=1` = the old ones): 1 O01 Ranger Lookout · 4 O04 Fire Station · 5 O05 Valley Station · 6 O06 Harbour Crane · 7 O07 Pit Head · 9 O09 Floodlit Stand · 10 O10 Pier Pavilion · 12 O12 Drive-in · 13 O13 Monorail Station · 15 O15 Gas Works · 17 O17 Car Park · 18 O18 Roadside Motel. Built, not wired: O02 / O03 (tutorial TNT vs the fair bot, Khai), O14, O19 (misses).

## 7. Chia việc giữa máy chủ (Mac) và máy ảo

- **Repo này là nguồn sự thật.** Bắt đầu phiên thì `git pull`. Xong một việc thì commit và push (không force).
- **Mỗi máy một màn, một thư mục `levels-gd/Lxx/`.** Không sửa thư mục màn của máy kia.
- `engine.js` và `tester.js` là file chung. Sửa thì đặt khối mới vào **đúng vị trí đánh dấu** (trước `// ---- levels ---` và trước `window.P7 = {`), commit sớm, ghi một dòng vào mục 5.
- Gợi ý:
  - Mac: thiết kế, Figma, chốt bản lên link test.
  - Máy ảo: chạy bộ test nặng (mỗi lần 4–11 phút, chỉ 1 Chrome), làm song song màn tiếp theo trên nhánh `level/Lxx`.

## 8. Gói dễ đợt 2: E05, E07–E10 (22/11, Agents-Game)

| Mã | Tên | Bài học | Trạng thái |
|---|---|---|---|
| E05 | Star Dome (đài thiên văn: trống gạch 8 cạnh, vòm, trụ kính thiên văn) | phá vỏ trước, lõi sau: trụ `hard7p` không chạm được khi trống còn đứng | PASS, 22 TNT, N; đường cong tối đa +6 |
| E07 | Bathhouse (nhà tắm công cộng mái vòm, 2 dãy cột, trường học xanh) | giữ toà xanh (nhẹ): nghiêng về phía trường là thua, nổ nhỏ phía trước thì vòm rơi tại chỗ | PASS, 18 TNT, N; đường cong +40 (đúng ngưỡng) |
| E08 | Grain Elevator (nhà đầu silo bê tông, 2 × 2 silo, nhà cân) | góc bê tông cốt thép `hrc` phải đánh nhiều lần: 5 % → 5 % → 61 % | PASS, 20 TNT, N |
| E09 | High Cistern (tháp nước gạch, bồn sắt trên giá thép) | làm rơi trước (nhẹ): bom vào bồn trên cao 0 %, rơi rồi 1 bom +27 | PASS, 20 TNT, N |
| E10 | Rail Terminus (nhà ga đầu mối + nhà chờ tàu, thùng đỏ, trường học) | tổng hợp: chân, hướng, thùng đỏ, toà xanh | PASS, 14 TNT, N |

- **TNT với tới 3,8 m.** Lõi giấu trong vỏ mà nằm trong 3,8 m của cột vỏ thì bom vào vỏ làm nứt lõi luôn (E05 lượt 1–2: allFoot 83–90 %). Lõi mảnh và đặc (`hard7p` = `hard7v` 7 800 kg/m³), cách mặt ngoài cột vỏ hơn 3,8 m, đứng trên bệ đá (anchor) để bài "foot" không coi nó là chân.
- **Khối nặng đặt sát sàn trên cao**: bom vào khối đó làm vỡ tầng ngay dưới (E09: 3 TNT vào bồn làm sập tầng trên cùng, bồn rơi 2–3,6 m và thành "đã rơi"). Kê khối nặng lên giá thép 1,6 m và dùng cột RC bọc gạch (`g7bk`) cho các tầng trên.
- **Khối nặng rơi từ 24 m vỡ khi chạm đất** (E08: mái nặng `hard7v`, `fail hard7v impact fell24.4`) và thành điểm miễn phí. Đặt khối nặng thấp hơn (thùng chứa trong tầng trên cùng) thay vì làm mái nặng.
- **Đường cong của màn dạy luật nghiêng**: khi toà chính là phần lớn khối lượng, 1 → 2 bom nhảy +47…+52 (E07, E10). Giảm bằng cách làm toà chính nhẹ đi (mặt kính thay tường gạch) và toà phụ nặng hơn (tường hậu gạch, mái ngói nặng), không đụng luật.
- **Lô gọn ≤ ≈ 24 m, rộng và sâu gần bằng nhau** (Lead 22/11: bước khung camera của bản chính coi màn có `hard7` như màn khó và mở xa). Chụp ảnh duyệt ở 393 × 852.
- **Kết quả máy chơi `fair` lệch theo phiên**: E05 đứng một mình thắng ở 20 TNT, chạy chung 10 màn thì cần 22. Đặt ngân sách theo lần chạy chung (bản chính).
- `run.mjs` in FAIL cho E05 / E07 chỉ vì oneWave (91–100 %), như E03 / E04 / E06: với màn dễ chỉ báo.
