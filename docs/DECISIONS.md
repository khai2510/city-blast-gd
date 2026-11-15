# City Blast! decisions (D-blast-*)

Extracted verbatim from the project's decision log: only the City Blast entries, in the order they were taken (11/11/2026 to 15/11/2026).
Most entries are written in Vietnamese (the owner's working language); the ID line and the English docs in `docs/` restate the rules that matter for
the game design. "Owner" = the product owner who takes the decisions; "Lead" = the coordinating AI agent. Links to private pages are removed.
A newer entry wins over an older one when they conflict (each entry names what it replaces).

- **D-blast-THRESH (11/11/2026, Owner):** City Blast — ngưỡng cố định toàn game: PASS 85% mọi màn; toà được bảo vệ hỏng tối đa 5%; đống đổ nát ra đường tối đa 10%. Độ khó đến từ cấu trúc toà và số bom, không chỉnh PASS từng màn.

- **D-blast-UI-1 (11/11/2026, Owner):** City Blast UI — giữ No Ads + các nút "sắp có" (Shop, "+" xu, Daily); nút Home ghi "PLAY"; giữ bản đồ nhưng một giao diện chung, không đổi theme theo khu; booster chọn trong màn; giữ tag "+" xu trên đồ thưởng.

- **D-blast-BRIEF-100 (11/11/2026, Owner):** Brief L1–100: Q1 thưởng xu 20/50/100 theo thường/Hard/Boss, thua 0 xu — ĐỒNG Ý; Q2 7 khu phố + 4 bảng màu mới — ĐỒNG Ý; Q3 tường chắn BTCT không phá ở L72 — ĐỒNG Ý; Q4 KHÔNG bỏ các dáng toà nhãn hiệu (giữ — Lead đã lưu ý rủi ro pháp lý); Q6 chưa quan trọng — làm mới tới L100.

- **D-blast-ART-1 (11/11/2026, Owner):** Duyệt chữ combo v2 (combo-words-v2.png, màu City Blast) và hướng toà chính kiểu nơi nổi tiếng (tấm F1: tháp nghiêng, tháp lưới sắt, tháp kim đĩa, nhà hát cánh buồm, kim tự tháp kính, 2 toà chọc trời nối cầu). Thêm toà đồ sộ bên cạnh khi cần để tăng độ khó. Toà công nghiệp (S1) làm toà phụ. Toà có dáng nhãn hiệu: chỉ trong màn chơi, không dùng trong ảnh store/quảng cáo (Lead đề xuất, chờ Owner xác nhận).

- **D-blast-ART-2 (11/11/2026, Owner):** Toà nổi tiếng dùng bản biến tấu F1b để thử trong game (Owner: "biến tấu hơi quá, nhưng thử đi"). Các toà sau: biến tấu nhẹ hơn — giữ nhận ra ngay, chỉ đổi MỘT điểm rõ (số tháp/chân/đĩa, tỉ lệ, hoặc kiểu mái).

- **D-blast-HERO-PROC (12/11/2026, Owner):** Quy trình toà nổi tiếng (thay cách cũ "chỉnh toà để giữ độ khó"): (1) dựng toà chính GIỐNG ô Figma trước (hình khối, tỉ lệ, chi tiết đặc trưng) — không thoả hiệp vì độ khó; (2) cho bot chơi thử, đo số liệu; (3) chỉnh độ khó CHỈ bằng toà bên cạnh, toà xanh, yếu tố xung quanh (đường, cây, xe, địa hình, số TNT, vị trí), KHÔNG đụng vào toà chính. Áp dụng L1–36 và các màn sau. Owner: "ko giống, quy trình, dựng lại giống với các toà nhà nổi tiếng trước -> chơi thử, xem metrics -> adjust độ khó bằng cách thêm các toà bên cạnh, yếu tố xung quanh, ko tác động vào toà nhà".

- **D-blast-HERO-MONUMENT (12/11/2026, Owner):** Toà nổi tiếng phải đồ sộ, nhiều tầng/lớp, mặt kính thấy được kết cấu bên trong từng tầng; người chơi vuốt lên/xuống và zoom để xem; không làm kiểu hình trụ đồ chơi. Được bê nguyên biểu tượng (ô Figma), làm thật to. Thử trước ở L32 (Sky Saucer F04) rồi mới nhân ra các màn khác.

- **D-blast-MODEL (12/11/2026, Owner):** Chọn model cho agent: Fable cho việc nặng/phức tạp (dựng toà nổi tiếng, tháp L32, làm lại màn, cân độ khó); việc còn lại (kiểm tra, chạy bot/đo, viết báo cáo, sửa nhỏ) dùng model khác (Sonnet/Opus). Thay quy tắc cũ "mọi agent chạy Fable".

- **D-blast-NOCAP (12/11/2026, Owner):** Bỏ giới hạn số khối (BODY_CAP 400). Không giới hạn chi tiết toà vì số khối; không còn cắt bớt ô kính. Huỷ việc đo giới hạn khối. Owner: "Đâu cần giới hạn khối đâu".

### D-blast-RC — Toà chính chịu lực như bê tông cốt thép thật (Owner, 12/11/2026)
- Owner thích hình L32 tháp đồ sộ, giữ nguyên hình. Nhưng chưa đủ khó: đặt 4 TNT là sập cả tháp.
- Toà chính phải kiên cố như bê tông cốt thép thật: 1 TNT gần như không hề hấn, 2 TNT cùng chỗ mới bắt đầu nứt, phải dồn/lặp nhiều lần mới suy sụp; ≤4 TNT không được làm sập tháp. Hư hại hiện dần (nứt → bong bê tông lộ thép → trụ gãy, nghiêng, sập).
- Ngoại lệ có chủ đích cho D-blast-HERO-PROC: được đổi ĐỘ BỀN vật liệu của toà chính, KHÔNG đổi hình. Thông số RC dùng lại cho mọi toà sau. Giữ PASS 85%, TNT 7–12, sóng không giới hạn, ~2 phút/màn.

### D-blast-TNTTIGHT — Người chơi giỏi cũng vừa hết bom (Owner, 12/11/2026)
- Kể cả người chơi giỏi, thắng màn là vừa dùng hết (hoặc gần hết, dư ≤1) TNT. Không đặt mục tiêu "dư TNT".
- Làm dễ màn bằng cách làm lời giải dễ tìm và chắc ăn hơn, không bằng cách cho thêm TNT. Áp vào skill blast-level-standard.

### D-blast-ONELINK — Một link game duy nhất (Owner, 12/11/2026)
- Gom mọi bản City Blast về link chính (main game link, private) Mọi cập nhật đều lên đó (đây là bản làm việc, chưa phải bản upload cuối).
- Gộp nhánh UI v32 + nhánh levels6 (L1–36, L32 tháp RC) + feel Q1–Q9 + nút LV chọn màn vào 1 bản dựng: tools/build-main.js → checkpoints/index-main.html.
- Các link thử khác ngừng cập nhật; xoá vĩnh viễn chỉ khi Owner xác nhận.

### D-blast-ROLLOUT (13/11/2026, Owner)
Làm lại L1–36 (trừ L32) dựa trên: (1) curve của mình (LEVEL-BRIEF-100.md + levels6/PLAN.md §3), (2) định nghĩa nhu cầu từng màn (vai trò trong curve, bài dạy, hạng, mục tiêu số), (3) chuẩn L32 (skill blast-level-standard). L32 tiếp tục được chỉnh và chuẩn đổi liên tục: skill có số phiên bản chuẩn (STD-vN); mỗi lô màn ghi nó làm theo STD nào, khi chuẩn đổi thì lô chạy lại cổng theo bảng mới trước khi nộp.

### D-blast-K1..K5 (13/11/2026, Owner — từ LEVEL-NEEDS.md §6)
- K1: toà RC xuất hiện từ L17 (bài riêng "chân to: lấp đầy chấm ở 2 chân"); L1–16 toà đồ sộ nhưng vật liệu theo thang (gỗ/gạch/bê tông/thép).
- K2: màn hướng dẫn (T) được 4–6 TNT, dưới dải 7–12.
- K3: toà RC: ≤3 TNT không bao giờ sập; 4 TNT chỉ sập khi đặt đúng chỗ đã dạy (chốt câu A/B L32 = A; sửa D-blast-RC "≤4 không sập").
- K5: cho chạy 2 lô song song (làn tháp A + làn sảnh/cầu B/C) trong khi lô trước chờ duyệt; A1 (L1–5) vẫn chạy riêng trước.
(K4 giữ thứ tự bài đã build, K7 L9 dùng chung ô toà với L32: theo khuyến nghị LEVEL-NEEDS, chưa hỏi riêng.)

### D-blast-INTRO-BTF (13/11/2026, Owner)
Giới thiệu booster / obstacle mới theo cách Bus Traffic Fever (research/busfever-scan/SCAN.md):
1. Khay booster hiện từ L1 với các ô khoá ghi "Lv.N" (báo trước lịch mở).
2. Mỗi lần mở đúng 1 thứ: thẻ "X Unlocked!" (icon tròn, 1 câu ≤8 từ, nút FREE), tặng 2 lượt.
3. Bắt dùng lần đầu: đầu màn tối đi, bàn tay chỉ vào booster/vật mới, người chơi phải dùng 1 lần.
4. Màn 1 dạy bằng bàn tay chỉ, 0 chữ.
5. Mở booster đúng lúc độ khó bắt đầu tăng.
Obstacle/vật liệu mới dùng cùng khuôn (thẻ NEW + bắt chạm lần đầu). Phần còn lại (chất lượng màn: độ khó, nhịp, cảm giác, hình) vẫn so với Smash Fest.

### D-blast-NOHINT (14/11/2026, Owner)
"Loại bỏ gợi ý chỗ đặt bom." Mọi màn, mọi tier: không còn gợi ý chỗ đặt TNT.
- Bỏ: chấm nhấp nháy từ đầu (cue dots); chấm còn trống trên cột đã trúng (damage dots); dòng tip "Fill the dots…"; camera tự đẩy vào chân/điểm giải (mở màn nhìn cả toà); câu thua chỉ chỗ ("Dots on the front legs…") → câu thua chỉ nói nguyên lý, không nêu chỗ.
- Giữ (Lead giả định, Owner đổi được): bàn tay chỉ ở L1 (dạy thao tác chạm, D-blast-INTRO-BTF) và bàn tay bắt dùng booster/vật liệu mới lần đầu. Vết nứt/khói trên cột trúng nổ vẫn hiện (là phản hồi vật lý, không phải gợi ý).
- STD-v3: gate chạy không có chấm; newcomer bot chơi mù; T/R tier cần chỉnh lại nếu tụt dưới mục tiêu.

- **D-blast-MATCURVE (14/11/2026, Owner):** City Blast — giữ cách dựng/thiết kế toà học từ L32, nhưng vật liệu và kiểu chân đế của từng toà đi theo một kế hoạch dọc theo đường độ khó và lịch giới thiệu (mỗi màn tối đa 1 thứ mới), KHÔNG phải toà nào cũng chân cứng + bê tông cốt thép (RC). Màn đầu dùng vật liệu mềm, chân đơn giản, 1–2 TNT ở chân là đổ/nghiêng thấy rõ. Kế hoạch: `games/blast/levels6/MATERIAL-CURVE.md`. Thay phần "mọi hero trên tầng RC" của STD v1–v3.

- **D-blast-THRESH-2 (14/11/2026, Owner — comment trên trang thứ tự quyết định, mục 0.1):** City Blast — chốt luật thắng/thua: PASS 85%, toà bảo vệ hỏng ≤5%, không giới hạn số lần nổ, ~2 phút. **Không có luật % mặt đường** (bỏ phần "đường ≤10%" của D-blast-THRESH). Gỡ chấm thua "street", đồng hồ đường và câu "Keep the road clear" khỏi game trong đợt chỉnh màn; bài L21 "đường" trong MATERIAL-CURVE đổi sang bài khác.

- **D-blast-TAP2 (14/11/2026, Owner — comment trên trang thứ tự quyết định):** City Blast — cách đặt bom mới: (1) bom đã đặt **không gỡ được**; (2) **chạm 1 lần = đặt bom, chưa nổ** (đặt nhiều bom rồi bấm BLAST); **chạm 2 lần = đặt bom và nổ ngay**; (3) **màn đầu là màn chơi thử, không có nút BLAST**: chạm 1 lần là bom nổ luôn; nút BLAST (đặt nhiều bom rồi nổ) giới thiệu ở màn sau. Lead giả định (Owner đổi được): chạm 2 lần nổ luôn cả các bom đã đặt trước; đặt lại camera chuyển khỏi cử chỉ chạm 2 lần.
  - *Sửa (Owner, 14/11 04:25):* không có màn "chạm 1 lần là nổ". Ngay từ L1 dạy **chạm 2 lần = nổ ngay** (L1 không có nút BLAST). **Chạm 1 lần = chỉ đặt bom**, cần nút BLAST để nổ nhiều bom cùng lúc → dạy ở L2. Lead đề xuất lịch: L1 chạm 2 lần; L2 chạm 1 lần + BLAST (vẫn gỗ, toà cần 2 bom cùng lúc); gạch dời sang L3.

- **D-blast-PERF (14/11/2026, Lead theo ý Owner "chỉnh để tối ưu fps tốt nhất"):** City Blast — ngân sách hiệu năng: máy thấp nhất iPhone 11; lên kế hoạch/xoay camera 60 fps; nổ/sập ≥30 fps; ≤150 lệnh vẽ; ≤100k tam giác (gồm bóng); vật lý ≤8 ms/bước lúc sập; độ phân giải tối đa ×2. Mỗi màn mới phải nằm trong ngân sách (thêm vào DoD của skill blast-level-standard).

- **D-blast-NOLOT (14/11/2026, Owner):** City Blast — bỏ bãi vàng "Target Lot" (L36 "Sail Lot", `lot6`, thẻ "New: Target Lot"). L36 dạy bằng các toà bảo vệ xung quanh.

- **D-blast-NONEW (14/11/2026, Owner):** City Blast — **không agent nào (kể cả Lead) tự quyết rồi thêm yếu tố mới vào game** (luật, vật liệu, chướng ngại, cơ chế, nút/màn hình, vật trang trí có ý nghĩa chơi, bài học mới). Muốn thêm → ghi đề xuất, Owner duyệt (ghi D-xxx) rồi mới làm. Chỉnh/sửa/bỏ cái đã có theo quyết định thì vẫn làm theo D-NOASK.

- **D-blast-TAPEXACT (14/11/2026, Owner — comment mục 0.3):** City Blast — người chơi chạm đâu thì bom nằm đúng chỗ đó. Bỏ trợ chạm (`mon:1` tap assist): không tự nhảy sang cột mảnh gần ngón tay, không chuyển chạm trên kính sang trụ phía sau.

- **D-blast-LEGALSKIP (14/11/2026, Owner — comment mục 0.5):** City Blast — bỏ bước kiểm lại pháp lý các toà giống nơi nổi tiếng trước khi lên store, vì toà chỉ lấy cảm hứng, không giống hoàn toàn. (Ghi nhận: báo cáo store prep đã nêu rủi ro với nhóm toà nhạy cảm — mái vòm quốc hội L6/16/35, khải hoàn môn L7, tháp đôi L28 — Owner chấp nhận.)

- **D-blast-SCHED (14/11/2026, Owner — "chốt" mục 1.3):** City Blast — chốt lịch giới thiệu theo `levels6/MATERIAL-CURVE.md` (mỗi màn tối đa 1 thứ mới, thẻ New ở màn dạy trước Hard; booster L12/L22/L33; RC L31/L32/L35; bẫy thùng L34), điều chỉnh theo D-blast-TAP2 (L1 chạm 2 lần, L2 chạm 1 lần + BLAST, các thứ mới L2–6 lùi 1 màn) và D-blast-NOLOT, THRESH-2 (không bài "đường", không bãi vàng). Bảng chọn booster trước màn: còn chờ Owner.

- **D-blast-COIN (14/11/2026, Owner — comment mục 1.4):** City Blast — thưởng xu khi thắng: **10 / 20 / 30** cho màn thường / Hard / Boss (thay 20/50/100 của D-blast-BRIEF-100 Q1). Thua 0 xu.

- **D-blast-NOSTACK (14/11/2026, Owner — comment mục 2.2):** City Blast — game **không có tính năng chồng bom** (đặt nhiều TNT lên cùng một chỗ). Mỗi chỗ chạm một bom. Bỏ bài "chồng 2 TNT lên chân thép" (L13 trong MATERIAL-CURVE); thép và RC được phá bằng nhiều lần nổ (RC giữ hư hại giữa các lần nổ) hoặc phá thứ nó đứng lên. Bot không chồng bom.

- **D-blast-NAME (14/11/2026, Owner — comment mục 4.1):** City Blast — giữ tên **"City Blast!"** trên store (không đổi sang tên tự đặt như NAME-CLEARANCE đề xuất), vì là game đầu tiên làm thể loại này.

- **D-blast-FIGMAFIRST (14/11/2026, Owner):** City Blast — mọi việc thiết kế giao diện/hình ảnh làm trong Figma trước (file <figma-file>, mỗi chủ đề một trang, tách theo từng element thành component), rồi mới làm vào game cho khớp Figma.

- **D-blast-ADOPT (14/11/2026, Owner "ok adopt lên game đi"):** City Blast — Owner đồng ý các đề xuất đang chờ của Lead: (1) chạm 2 lần khi đã có bom đặt sẵn = **nổ tất cả bom đang đặt**; (2) **làm bảng chọn booster trước màn** Hard/Boss (theo Figma "Booster Intro" 6a/6b); (3) **ẩn các nút "sắp có"** (Daily, No Ads, "+" xu) ở Home cho tới khi có tính năng (thay một phần D-blast-UI-1); (4) giữ hiệu ứng mảng tường cạnh chân vỡ theo (`sag`). Chưa duyệt: pháo hoa màn thắng, Shop đơn giản, rọi sáng L1.

## D-blast-PROPS (Owner 15/11/2026)
Cây, xe (props) chỉ là trang trí: không tính %, không phải mục tiêu. Owner chọn B ("bỏ") nhưng giao Lead tự quyết theo từng level: bỏ chỗ gây rối/chắn tầm nhìn hoặc chỗ đặt toà, chỉ giữ ít khi giúp cảnh và cảm giác tỉ lệ. Áp dụng ở đợt chỉnh level (MATERIAL-CURVE). Editor: props hiển thị mờ + ghi chú "trang trí, không tính %".

## D-blast-SHOP (Owner 15/11/2026: "Tất cả các thiết kế đều ok rồi, để lên đi")
Duyệt toàn bộ gói Shop · Upgrades · No Ads (design/shop/SPEC.md, Figma 131-2): 5 gói xu $1.99–$49.99, 3 bundle $4.99–$19.99, Starter $2.99, No Ads $6.99 (chỉ tắt interstitial, giữ rewarded), Restore Purchases ở Shop + Settings; Upgrades hạ còn ~3.400 xu tổng; Coin Bonus áp vào thưởng thắng (sửa D-blast-COIN: 10/20/30 là mức gốc, nhân theo Coin Bonus); thêm upgrade "Booster Pocket"; Fail Offer $4.99; No Ads nút Home từ L15; interstitial chỉ sau khi thắng, từ L15; rewarded +1 TNT (thua) / ×2 xu (thắng) từ L5. Duyệt cả các thiết kế khác đã gửi (Home fix, tutorial, editor). Tài khoản RevenueCat/AdMob + tạo IAP trong ASC = Owner (nhóm C); tới khi có, mua bằng tiền thật ẩn trên native.

## D-blast-0115 (Owner 15/11/2026, trả lời danh sách đề xuất)
1. Kịch bản quảng cáo v3: chờ Owner feedback, chưa quay.
2. Logo HitMaker v2: OK — dùng B "Bounce Tile" (design/studio/v2/).
3. Icon app mới (toà nhà đồ chơi + TNT, không chữ, theo H2H Car Sort): OK — làm.
4. Bảng màu toà pastel: gửi sample trước, chưa đưa vào game.
5. Shop/booster khoá hiện sớm: Owner hỏi "cần gì để giữ hiện" — giữ hiện, Lead đề xuất điều kiện để không còn là ngõ cụt.
6. Home lớn dần (UX-13): làm demo trước, Owner xem rồi mới quyết.
7. Chơi tiếp khi thua (UX-14): KHÔNG làm.
