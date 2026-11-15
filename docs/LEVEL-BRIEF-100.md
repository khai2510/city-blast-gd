# City Blast!: brief màn L1–100 (nhịp, launch, mục tiêu, thư viện toà biểu tượng)

Viết 11/11/2026 theo lệnh Owner: "lên brief về nhịp, gameplay, cái gì ra lúc nào, mục tiêu từng màn, rồi theo brief build tới L100".
Agent viết đã nạp skill `game-designer`. Đây là **brief cho agent tạo màn (generator)**: brief không sửa code, không build màn.
Nguồn: `levels6/PLAN.md` §12–13 (thang vật liệu `L6_LADDER`, gộp bom, kiểu màn), `levels6/sim/curve-r4c.csv` + `metrics-r4.json`,
`02_decisions.md` (D-blast-THRESH), `06_status.md` 11/11 (Owner: nhiều đợt, thắng khi đạt PASS, 2 loại toà xanh, giãn nhịp dạy),
`boosters2/PORT.md` + `THIRD-BOOSTER.md`, `research/smashfest-brief/INSIGHT-*.md`, `games/playbook/GAME-DESIGN.md`,
`LEGAL-LANDMARKS.md`, `LANDMARKS-V2.md`, `GTM-PLAN.md`, `TEST-PLAN-V1.md`, `STYLE-GUIDE.md`, `BOOSTERS.md`.

Ký hiệu: hạng **T** hướng dẫn · **N** thường · **H** Hard (nhãn tím) · **SH** Super Hard (không phải boss) · **R** nghỉ · **B** boss (nhãn Super Hard, đỏ).
Mọi con số bot là mục tiêu làm việc (bot, 0 nâng cấp), chưa phải dữ liệu người chơi thật.

---

## 1. Kim chỉ nam và luật cố định

| # | Luật |
|---|---|
| 1 | Mỗi màn có **1 ý** (mẹo ≤6 chữ), **1 toà biểu tượng theo dáng địa danh nổi tiếng, nhìn là nhận ra**, chiếm 60–75% chiều cao màn hình (§5.2), toà phụ và toà xanh **đồ sộ** (40–70% toà chính), **1 cú sập đáng quay clip**, ~2 phút một lượt chơi. |
| 2 | **Ngưỡng cố định toàn game (D-blast-THRESH):** PASS 85%, toà xanh hỏng ≤5%, ra đường ≤10%. Không chỉnh theo màn. Thắng ngay khi đạt PASS sau một lần nổ ổn định; còn TNT thì nổ tiếp bao nhiêu đợt cũng được; hết TNT mà chưa đạt là thua. |
| 3 | **Không có độ khó động (DDA)**, không "suýt thua" ép theo người chơi. Vật lý tất định (seed, bước cố định). Trợ giúp phải hiện ra và do người chơi chọn. |
| 4 | **Mỗi lúc chỉ dạy 1 bài chính.** Sau mỗi bài có 3–4 màn trải nghiệm (có màn domino/hứng khởi) rồi mới dạy bài tiếp. Tối đa 1 thứ mới mỗi màn. |
| 5 | **Hard / SH / Boss không bao giờ giới thiệu thứ mới**, chỉ kết hợp thứ đã dạy (H ≤3 cơ chế, boss ≤4). Không có 2 màn H/SH/B liền nhau. |
| 6 | **Luôn có màn nghỉ ngay sau Boss** và sau phần lớn Hard. Màn nghỉ là chỗ tốt nhất để ra thứ mới hoặc booster mới. |
| 7 | **Chữ ≤6 từ** (mẹo, thẻ NEW). Lần đầu một thứ mới: 1 thẻ + 1 chỉ tay. Sau đó không chữ. Cùng vẻ ngoài thì cùng luật, luôn luôn. |
| 8 | **Không dùng bài học thì thua:** mỗi màn dạy/kết hợp phải có kế hoạch "bỏ qua bài học" thua rõ ràng (bot kiểm). |
| 9 | Booster chỉ đẩy ở chỗ có lý do (màn thua sát, Hard/boss). Booster giúp kế hoạch đúng, không cứu kế hoạch sai. |

---

## 2. Lịch launch L1–100 (cái gì ra lúc nào)

### 2.1 Khuôn 10 màn (dùng cho mọi dải từ L11)

| Vị trí trong dải | x1 | x2 | x3 | x4 | x5 | x6 | x7 | x8 | x9 | x10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Hạng | R | N | N | N | H (SH ở dải 6, 8, 9, 10) | R | N | H | N | B |
| Vai trò | nghỉ sau boss; booster mới (L11/21/31) | **dạy bài A** | trải nghiệm A (hứng khởi) | trải nghiệm A (biến tấu) | kết hợp A + cũ | **dạy bài B / biến thể** (nghỉ) | trải nghiệm B | kết hợp | bất ngờ: cú sập lớn nhất dải | boss khép khu |

Tỉ lệ 100 màn: N 50 · R 19 · H 15 · SH 4 · B 10 · T 2. Từ L61 chỉ còn 1 bài chính mỗi dải (x2); x6 là biến thể hoặc kiểu màn mới.

### 2.2 Bài học chính (mỗi bài có 3–4 màn trải nghiệm theo sau)

| # | Bài (mẹo ≤6 chữ) | Dạy | Trải nghiệm | Kết hợp lần đầu | Ghi chú |
|---|---|---|---|---|---|
| 1 | Chạm cột, bấm BLAST (đếm trụ) | L1 | L2–L4 | L7 | gạch L2, bê tông L3 là biến thể cùng luật "đếm trụ" |
| 2 | "Blue ahead? Turn and blast." xoay 3D | L5 | L6, L7, L9 | L7 H | toà xanh (trường) là lý do phải xoay: 1 ý. Nút xoay 90° + chỉ tay lần đầu, không bắt vuốt camera |
| 3 | "Steel band? Stack two TNT." | L8 | L9, L10, L13 | L10 B | gộp đôi trên dải thép giữa tầng / chân thép |
| 4 | "Blast, look, blast again." nhiều đợt | L12 | L13–L15 | L15 H | lõi ẩn sau mặt tiền chỉ lộ sau đợt 1 |
| 5 | "Keep the road clear." phố | L16 | L17–L19 | L18 H | ra đường ≤10% |
| 6 | "Glass holds nothing. Hit frames." kính | L22 | L23–L25 | L25 H | kính vỡ rộng, không chịu lực |
| 7 | "Barrels blast for free." thùng nhiên liệu | L26 | L27–L29 | L28 H | engine có (`fuel_cookoff`) |
| 8 | "Drop it in the lot." lô đích | L32 | L33–L35 | L35 H | dựng bằng luật đường/toà xanh bao 3 phía, không thêm chỉ số mới |
| 9 | "Heavy end tips first." đua (cantilever) | L36 | L37–L39 | L38 H | |
| 10 | "Keep the tracks clear." cắt đường ray | L42 | L43–L45 | L45 H | luật như phố, mặt đường là ray trong hào |
| 11 | "Heavy tank drops first." bồn nước mái | L52 | L53–L55 | L55 SH | bồn `rtank` đã có trong builder |
| 12 | "Order matters: this one first." thứ tự đợt | L62 | L63–L65 | L65 H | đổ A lên B rồi mới nổ B |
| 13 | "Shield wall: blast around it." tường chắn BTCT không vỡ | L72 | L73–L75 | L75 SH | **chờ Owner (nhóm B, Q3)**; nếu không: L72 dạy "lõi xoắn: cắt lõi trước" |

Biến thể (thứ mới nhỏ, dùng lại luật đã có, chỉ trên N/R): gạch L2 · bê tông L3 · bệnh viện L9 · BTCT L13 · tấm đúc sẵn L46 · đá L56 · siêu cụm 6 toà L76 · twist domino 3 khối vào lô L82 · ôn tập L91–99.

### 2.3 Vật liệu (thang `L6_LADDER`)

| Vật liệu | Lần đầu | Luật nhìn là hiểu | Mẹo lần đầu |
|---|---|---|---|
| Gỗ | L1 | 1 quả gãy mọi thứ trong 3,3 m | Tap a post. Then BLAST! |
| Gạch | L2 | 1 quả/trụ (các trụ trong 2,5 m) | Brick: one TNT per pier. |
| Bê tông thường | L3 | 1 quả/cột | Grey: one TNT per column. |
| Thép (dải/chân) | L8 | 1 quả không gãy, **gộp 2** thì gãy; dải thép sàn gộp 3 | Steel band? Stack two TNT. |
| BTCT (trụ tối) | L13 | chỉ gãy khi đặt sát trụ | Dark piers: TNT right on them. |
| Kính | L22 | vỡ rộng 3,6 m, không đỡ gì | Glass holds nothing. Hit frames. |
| Tấm đúc sẵn | L46 | mối nối yếu: 1 quả tháo cả mảng mặt tiền | Panels unzip. Hit a joint. |
| Đá | L56 | như BTCT (sát trụ), vụn như gạch; chỉ khác vẻ ngoài | Thick stone: TNT on each pier. |

### 2.4 Kiểu màn (archetype), toà xanh, phố

| Thứ | Lần đầu | Thứ | Lần đầu |
|---|---|---|---|
| pair (cặp toà) | L1 | jetty (cầu tàu + kho + đường ven) | L18 |
| tall-low (cao cạnh thấp) | L2 | plaza (4 toà quanh quảng trường + đường) | L25 |
| row (dãy domino) | L3 | zone (lô đích) | L32 |
| yard (cụm nhiều toà thấp) | L4 | cant (toà đua) | L36 |
| c4 (cụm 4 quanh toà xanh) | L6 | railcut (cắt đường ray) | L42 |
| canyon (hẻm phố, toà xanh 2 bên) | L7 | arc (dãy vòm/cột) | L56 |
| legs (tháp trên chân thép) | L8 | mega6 (siêu cụm 6 toà) | L76 |
| bridge (tháp bằng nhau + cầu thép) | L9 | set piece boss (mỗi boss 1 lần, không tái dùng) | L10…L100 |
| hidden (mặt tiền + lõi ẩn) | L12 | toà xanh: **trường** L5, **bệnh viện** L9 (luật như nhau; gán cố định theo màn, mỗi dải có cả 2) | |
| inner (toà trong toà) | L13 | đường/phố là luật | L16 |

### 2.5 Booster và mốc kinh tế

| Thứ | Mở | Dùng lần đầu (miễn phí, chỉ tay) | Đẩy lần đầu có mục đích | Sau đó |
|---|---|---|---|---|
| +1 TNT (thẻ thua) | L4 | — | L7 H (thua sát) | chỉ khi thua sát (≤5 điểm dưới PASS), không khi trúng toà xanh |
| Wrecking Ball | thắng L10 (3 miễn phí) | L11 | L13 (lõi đứng), L15 H picker | picker H/SH/B + sau 2 lần thua |
| Safety Net | thắng L20 (2 miễn phí) | L21 | L23 (thua sát vì đường), L25 H | thẻ thua khi trượt đường/toà xanh ≤5 điểm |
| Sky Strike | thắng L30 (2 miễn phí) | L31 | L34 (đỉnh còn đứng), L35 H | picker H/SH/B |
| Xu thưởng 20 / 50 / 100 (N·R·T / H / SH·B) | L1 | — | — | **chờ Owner (Q1)**; thua 0 xu |
| Thẻ mở khu mới | thắng L10, 20, 30, 50, 70, 90 | — | — | mốc bản đồ; rương mốc L50/L100 chờ Owner |

### 2.6 Khu phố (mỗi khu một skyline và bảng màu)

| Khu | Màn | Bảng màu (STYLE-GUIDE §3) | Toà biểu tượng (mã §5.4) | Boss |
|---|---|---|---|---|
| 1 Phố Cũ (Old Quarter) | L1–10 | Old Quarter, sáng sớm | F27 cối xay, F28 hải đăng, F01 tháp đồng hồ, F02 tháp nghiêng, F14 sảnh vòm, F10 khải hoàn môn, F03 tháp lưới, F07 tháp cầu trời | L10 F09 cầu cất 2 tháp |
| 2 Bến Cảng (Harbour) | L11–20 | **mới**: trưa biển, xanh ngọc nhạt (không lấn xanh toà bảo vệ) | F05 nhà hát, F21 bệ tượng, F30 khách sạn buồm, F17 cầu dây văng, F24 toà nêm, F35 nhà khối (toà phụ: bảng S1) | L20 F32 cầu vòm thép |
| 3 Trung Tâm (Downtown) | L21–30 | Downtown, giữa trưa | F22 tháp cột buồm, F06 kim tự tháp kính, F25 tháp viên đạn, F31 tháp mảnh kính, F16 tháp Deco, F04 tháp đĩa, F26 tháp chóp, F34 tháp bó ống | L30 F12 tháp bậc siêu cao |
| 4 Ga & Xưởng (Rail Yard) | L31–50 | **mới**: chiều khói ấm, gạch đỏ sẫm | F19 tháp tầng đoạn, F01, F03, F04, F14, F30, F02, F26, F31, F27, F33 cầu máng, F17, F10, F34, F24 | L40 F08 đấu trường, L50 F15 cầu treo |
| 5 Ven Sông (Riverside Park) | L51–70 | **mới**: xanh lá, đá mật ong | F27, F04, F06, F05, F18 sân bát, F33, F29 cổng cột, F10, F28, F35, F02, F01, F21, F14, F19, F24 | L60 F13 vòng quay, L70 F20 lâu đài |
| 6 Chân Trời (Skyline) | L71–90 | Skyline, hoàng hôn | F31, F25, F06, F07, F16, F22, F30, F03, F34, F26, F36 bảo tàng xoắn, F21, F05, F02, F04 | L80 F11 tháp xoắn, L90 F23 tháp + sàn trời |
| 7 Vương Miện (Metro Crown) | L91–100 | **mới**: xanh chạng vạng (không đèn đêm trên toà biểu tượng) | ôn tập: F17, F01, F14, F18, F16, F27, F30, F33, F31 | L100 F07 bản lớn nhất |

Cần thêm 4 bảng màu mới (việc `design`, không chặn generator: tạm dùng 3 bảng cũ xoay vòng).

---

## 3. Đường cong độ khó

### 3.1 Mục tiêu bot theo hạng (4 seed, 0 nâng cấp; sensible = 8 biến thể)

| Hạng | Expert | Sensible thắng | Naive | Chỉ nổ chân (random) | Lượt tìm mù (median) | TNT dư so với expert | TNT cho | Thời gian ước tính / màn |
|---|---|---|---|---|---|---|---|---|
| T | 4/4, biên ≥+10 | 100% | thắng được | không xét | ≤3 | 25–40% | 4–5 | 60–75 s |
| R | 4/4, biên ≥+8 | 100% | ≥50% | ≤30% | ≤5 | 20–30% | 7 → 11 | 80–95 s |
| N | 4/4, biên +3…+8 | 70–95% (6–8/8) | 0–25% | ≤10% (0/16 tốt nhất) | 4–12 | 10–20% | 7 → 12 | 95–140 s |
| H | 4/4, biên ≥+3 | 30–60% (3–5/8) | 0% | 0/16 | >12 | 0–12% | 10 → 14 | 220–270 s |
| SH | 4/4, biên ≥+3 | 15–40% (2–3/8) | 0% | 0/16 | >12 | 0–8% | 13 → 15 | 270–290 s |
| B | 4/4, biên ≥+3 | 10–40% (1–3/8) | 0% | 0/16 | >12 | 0–8% | 12 → 16 | 290–340 s |

Vòng 4 cho thấy Hard L7 sensible 0/4: quá gắt. Từ nay Hard phải có 3–5/8.
Thời gian ước tính theo công thức `time-bot.js` hiện có: (40 s × (1 + 0,1 × TNT) + sập) × số lần thử.

### 3.2 Giữ PASS 85 cố định mà vẫn khó dần (các đòn bẩy, theo thứ tự dùng)

1. **Cấu trúc:** số mảng/toà tăng từ 2–3 lên 6–7; đường truyền lực ẩn (đế che chân, lõi sau mặt tiền, tháp trên chân thép); số đợt cần thiết tăng từ 1 lên 2–3.
2. **Kinh tế TNT:** độ dư giảm (T 40% → B 0–8%); TNT tuyệt đối tăng 4 → 16 nhưng mỗi quả phải có việc.
3. **Vật liệu:** tỉ lệ thép/BTCT/đá tăng (cần gộp đôi hoặc đặt sát) nên cùng số trụ cần nhiều bom hơn và cần biết vật liệu.
4. **Khoảng cách toà xanh:** từ 2,0 m (L5) xuống 1,2 m (đáy an toàn đã đo ở vòng 4: 1,0 m bị lệch theo thứ tự nổ).
5. **Phố / lô / ray:** biên mảnh vụn hẹp dần (mục tiêu expert còn 2–4 điểm dưới 10%).
6. **Mặt cần xoay:** từ 1 mặt khuất (L5) lên 2–3 mặt khác nhau trong 1 màn.
7. **Không bao giờ dùng:** đổi PASS, ẩn HP, mục tiêu nhỏ lại, độ trễ, ngẫu nhiên quyết định thắng thua.

### 3.3 Hình răng cưa

```
khó
 10 |         B         B         B         B         B         B         B         B         B         B
  8 |       H     H   H     H   H     H   H     H   S     H   H     H   S     H   S     H   S     H
  6 |   N N   N  N N N  N  N N N  N  N N N  N  N N N  N  N N N  N  N N N  N  N N N  N  N N N  N  N N N
  4 |  N    R  R   R    R  R   R   R  R   R   R  R   R   R  R   R   R  R   R   R  R   R   R  R   R   R
  2 | T
    +-----------------------------------------------------------------------------------------------------
      1   10   20   30   40   50   60   70   80   90   100      (S = SH)
```

### 3.4 Bảng 100 màn

Cột "Toà" là toà biểu tượng chính, mã F trong §5.4 (toà phụ và toà xanh đồ sộ theo §5.3). Giờ = thời gian ước tính trung bình kể cả thử lại. L1–12: vòng 5 đang làm (giáo trình của Owner);
bảng dưới là hướng cho vòng 5, generator **không** dựng lại L1–12.

| L | Hạng | Khu | Mới / luyện | Kiểu màn | Cơ chế chính | Toà | TNT | Giờ s | Mục đích | Booster | Mục tiêu |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | T | Phố Cũ | **MỚI: chạm + BLAST, gỗ** | pair | đếm cột | F27 | 4 | 60 | giới thiệu | — | Chạm cột, BLAST, xem toà đổ |
| 2 | T | Phố Cũ | biến thể: gạch | tall-low | 1 quả/trụ | F28 | 5 | 70 | trải nghiệm | — | Đếm đủ trụ gạch là thắng |
| 3 | N | Phố Cũ | biến thể: bê tông | row | domino | F01 | 7 | 90 | trải nghiệm (hứng khởi) | — | Đổ toà cao, cả dãy ngã theo |
| 4 | N | Phố Cũ | luyện | yard | chia bom theo vật liệu | F35 | 7 | 100 | trải nghiệm | +1 TNT xuất hiện (thua sát) | 7 quả hạ 4 toà, không phí |
| 5 | N | Phố Cũ | **MỚI: xoay 3D (trường chắn mặt trước)** | tall-low | hướng đổ | F02 | 7 | 105 | giới thiệu | — | Xoay ra sau, nổ mặt xa trường |
| 6 | N | Phố Cũ | luyện xoay | c4 | đổ ra ngoài | F14 | 8 | 120 | trải nghiệm | +1 TNT khi thiếu % | 3 khối đổ ra ngoài, trường nguyên |
| 7 | H | Phố Cũ | kết hợp | canyon | domino + hướng | F10 | 10 | 240 | thử thách | +1 TNT (đẩy chính đầu tiên) | Hai tháp đổ dọc phố |
| 8 | R | Phố Cũ | **MỚI: thép, gộp đôi** | legs | dải thép giữa tầng | F03 | 7 | 85 | giới thiệu (nghỉ) | — | Gộp 2 quả phá dải thép |
| 9 | N | Phố Cũ | biến thể: bệnh viện | bridge | gộp hay nổ cao hơn | F07 | 9 | 110 | trải nghiệm | +1 TNT khi còn 1 tháp | Một quả dưới mỗi tháp, cầu kéo cả hai |
| 10 | B | Phố Cũ | kết hợp | set piece | đếm + xoay + gộp | F09 | 12 | 290 | boss | +1 TNT; thắng → Wrecking Ball | Hạ cầu cất, 2 toà xanh nguyên |
| 11 | R | Bến Cảng | booster: Wrecking Ball | yard | dùng Ball | F05 | 7 | 80 | nghỉ + booster | Ball miễn phí, chỉ tay | Một cú Ball, một mảng sập |
| 12 | N | Bến Cảng | **MỚI: nhiều đợt** | hidden | lộ lõi sau đợt 1 | F21 | 8 | 130 | giới thiệu | — | Nổ mặt tiền, thấy lõi, nổ tiếp |
| 13 | N | Bến Cảng | biến thể: BTCT | inner | đợt + đặt sát trụ | F30 | 9 | 120 | trải nghiệm | Ball khi lõi đứng (thua sát) | Đế đổ trước, đợt 2 hạ tháp |
| 14 | N | Bến Cảng | luyện | row | domino 2 đợt | F28 | 9 | 115 | trải nghiệm (hứng khởi) | — | Đợt 1 mở dãy, đợt 2 dứt điểm |
| 15 | H | Bến Cảng | kết hợp | c4 | đợt + xoay + gộp | F14 | 11 | 245 | thử thách | picker Ball; +1 TNT | 4 khối đổ ra ngoài, 2 đợt |
| 16 | R | Bến Cảng | **MỚI: phố** | tall-low | đổ vào sân | F02 | 7 | 90 | giới thiệu (nghỉ) | — | Đổ vào sân, đường sạch |
| 17 | N | Bến Cảng | luyện phố | canyon | mũi chỉ ra đường | F24 | 9 | 120 | trải nghiệm | — | Mũi nêm chỉ ra đường: đổ ngược |
| 18 | H | Bến Cảng | kết hợp | jetty | phố + toà xanh + thép | F17 | 11 | 250 | thử thách | picker Ball; +1 TNT | Không ra đường, không chạm viện |
| 19 | N | Bến Cảng | luyện (bất ngờ) | row | domino xa đường | F35 | 9 | 110 | bất ngờ | — | Dãy nhà khối đổ dây chuyền |
| 20 | B | Bến Cảng | kết hợp | set piece | đợt + gộp + phố | F32 | 13 | 300 | boss | +1 TNT; thắng → Safety Net | Hạ cầu vòm thép, đường ven sạch |
| 21 | R | Trung Tâm | booster: Safety Net | canyon | Net bắt mảnh | F22 | 8 | 85 | nghỉ + booster | Net miễn phí, chỉ tay | Bật Net, mảnh không ra đường |
| 22 | N | Trung Tâm | **MỚI: kính** | inner | tìm khung | F06 | 8 | 120 | giới thiệu | — | Kính không đỡ gì: nổ khung |
| 23 | N | Trung Tâm | luyện kính | tall-low | kính + gộp | F25 | 9 | 125 | trải nghiệm | Net khi thua sát vì đường | Phá khung, đường sạch |
| 24 | N | Trung Tâm | luyện kính | row | domino qua 3 vật liệu | F31 | 9 | 120 | trải nghiệm (hứng khởi) | — | Domino kính, bê tông, gạch |
| 25 | H | Trung Tâm | kết hợp | plaza | phố + toà xanh + kính | F16 | 12 | 250 | thử thách | picker Net/Ball; +1 TNT | 4 toà đổ vào quảng trường |
| 26 | R | Trung Tâm | **MỚI: thùng nhiên liệu** | yard | chuỗi nổ miễn phí | F04 | 8 | 90 | giới thiệu (nghỉ) | — | Một quả cạnh thùng: chuỗi nổ |
| 27 | N | Trung Tâm | luyện thùng | legs | thùng thay quả gộp | F26 | 9 | 120 | trải nghiệm | — | Thùng phá chân thép giúp bạn |
| 28 | H | Trung Tâm | kết hợp | canyon | thùng + phố + toà xanh | F34 | 12 | 255 | thử thách | picker; +1 TNT | Thùng giúp, sai hướng trúng viện |
| 29 | N | Trung Tâm | luyện (bất ngờ) | row | domino → thùng | F07 | 10 | 115 | bất ngờ | — | Domino chạm thùng, cuối dãy nổ |
| 30 | B | Trung Tâm | kết hợp | set piece | kính + thùng + đợt + phố | F12 | 14 | 310 | boss | +1 TNT; thắng → Sky Strike | Hạ tháp bậc siêu cao từng đoạn |
| 31 | R | Ga & Xưởng | booster: Sky Strike | tall-low | đánh từ trên | F19 | 8 | 85 | nghỉ + booster | Sky miễn phí, chỉ tay | Sky Strike nghiền từ đỉnh |
| 32 | N | Ga & Xưởng | **MỚI: lô đích** | zone | đổ vào lô | F01 | 9 | 125 | giới thiệu | — | Đổ trọn vào lô vàng |
| 33 | N | Ga & Xưởng | luyện lô | row | domino vào lô | F03 | 10 | 125 | trải nghiệm (hứng khởi) | — | Cả dãy nằm gọn trong lô |
| 34 | N | Ga & Xưởng | luyện lô | pair | gộp + lô hẹp | F04 | 10 | 125 | trải nghiệm | Sky khi đỉnh còn đứng | Phá khung thép, đổ vào lô |
| 35 | H | Ga & Xưởng | kết hợp | c4 | lô + toà xanh + thép | F14 | 12 | 250 | thử thách | picker Sky; +1 TNT | 4 khối vào lô, trường nguyên |
| 36 | R | Ga & Xưởng | **MỚI: toà đua** | cant | cắt phía đua | F30 | 9 | 95 | giới thiệu (nghỉ) | — | Cắt phía đua: toà tự lật |
| 37 | N | Ga & Xưởng | luyện đua | tall-low | lật ngược phía đua | F02 | 10 | 125 | trải nghiệm | — | Đua chỉ vào trường: lật về sau |
| 38 | H | Ga & Xưởng | kết hợp | cant | đua + lô + phố | F26 | 12 | 255 | thử thách | picker Ball/Sky | Lật đúng hướng, vào lô |
| 39 | N | Ga & Xưởng | luyện (bất ngờ) | row | domino 7 toà | F31 | 10 | 115 | bất ngờ | — | 7 toà đổ dây chuyền vào lô |
| 40 | B | Ga & Xưởng | kết hợp | set piece | lô + đua + thùng + thép | F08 | 14 | 310 | boss | +1 TNT | Đấu trường đổ vào lòng sân |
| 41 | R | Ga & Xưởng | nghỉ | row | domino | F27 | 9 | 85 | nghỉ (hứng khởi) | — | Một quả, cả dãy đi |
| 42 | N | Ga & Xưởng | **MỚI: cắt đường ray** | railcut | ray sạch | F33 | 10 | 130 | giới thiệu | — | Nhịp cầu rơi, ray sạch |
| 43 | N | Ga & Xưởng | luyện ray | legs | đổ ra xa ray | F04 | 10 | 125 | trải nghiệm | — | Tháp tín hiệu đổ xa ray |
| 44 | N | Ga & Xưởng | luyện ray | bridge | gộp + ray | F17 | 11 | 130 | trải nghiệm | Net khi thua sát vì ray | Hai trụ cầu cạn, ray sạch |
| 45 | H | Ga & Xưởng | kết hợp | railcut | ray + lô + đua | F10 | 12 | 255 | thử thách | picker; +1 TNT | Nhà quạt vào lô, ray sạch |
| 46 | R | Ga & Xưởng | biến thể: tấm đúc sẵn | pair | tháo mặt tiền | F34 | 9 | 90 | giới thiệu (nghỉ) | — | Một quả tháo cả mặt tấm |
| 47 | N | Ga & Xưởng | luyện tấm | tall-low | tấm + phố | F01 | 10 | 125 | trải nghiệm | — | Tháo mặt sau, đường sạch |
| 48 | H | Ga & Xưởng | kết hợp | canyon | tấm + thùng + toà xanh | F24 | 12 | 255 | thử thách | picker Sky | Ống khói đổ dọc hẻm |
| 49 | N | Ga & Xưởng | luyện (bất ngờ) | row | tấm domino + thùng | F19 | 11 | 120 | bất ngờ | — | 5 khối tấm sập liên hoàn |
| 50 | B | Ga & Xưởng | kết hợp | set piece | ray + lô + đua + tấm | F15 | 15 | 320 | boss (mốc 50) | +1 TNT | Hạ 2 trụ cầu treo, ray sạch |
| 51 | R | Ven Sông | nghỉ | yard | — | F27 | 9 | 85 | nghỉ | — | Cối xay gió đổ ra cánh đồng |
| 52 | N | Ven Sông | **MỚI: bồn nước mái** | tall-low | đầu nặng rơi trước | F04 | 10 | 130 | giới thiệu | — | Bồn rơi trước, kéo toà theo |
| 53 | N | Ven Sông | luyện bồn | c4 | bồn + kính | F06 | 10 | 125 | trải nghiệm | — | Nhà kính đổ, bồn không lăn vào viện |
| 54 | N | Ven Sông | luyện bồn | plaza | bồn lăn về đường | F05 | 11 | 130 | trải nghiệm (hứng khởi) | — | Bồn lăn vào sân, không ra đường |
| 55 | SH | Ven Sông | kết hợp | canyon | bồn + tấm + lô | F18 | 13 | 275 | thử thách | picker; +1 TNT | Sân bát đổ vào lòng sân |
| 56 | R | Ven Sông | biến thể: đá | arc | trụ dày, sát trụ | F33 | 9 | 90 | giới thiệu (nghỉ) | — | Mỗi trụ đá một quả |
| 57 | N | Ven Sông | luyện đá | pair | đá + gộp | F29 | 10 | 125 | trải nghiệm | — | Cổng đá và tháp đổ cùng lúc |
| 58 | H | Ven Sông | kết hợp | arc | đá + phố + đợt | F10 | 12 | 255 | thử thách | picker Ball | Cổng vòm đổ, đường sạch |
| 59 | N | Ven Sông | luyện (bất ngờ) | row | domino nhà thuyền | F28 | 11 | 120 | bất ngờ | — | Hải đăng mở đầu cả dãy |
| 60 | B | Ven Sông | kết hợp | set piece | bồn + đá + đợt + phố | F13 | 15 | 320 | boss | +1 TNT | Vòng quay lăn vào lô |
| 61 | R | Ven Sông | nghỉ | row | domino | F35 | 10 | 85 | nghỉ (hứng khởi) | — | Một quả, cả dãy nhà khối |
| 62 | N | Ven Sông | **MỚI: thứ tự đợt** | pair | A đổ lên B | F02 | 10 | 135 | giới thiệu | — | Đổ tháp nghiêng lên kho trước |
| 63 | N | Ven Sông | luyện thứ tự | row | 2 đợt có thứ tự | F01 | 11 | 130 | trải nghiệm | — | Đầu dãy trước, cuối dãy sau |
| 64 | N | Ven Sông | luyện thứ tự | tall-low | thứ tự + bồn | F21 | 11 | 130 | trải nghiệm | — | Bệ tượng đè lên nhà thấp |
| 65 | H | Ven Sông | kết hợp | c4 | đá + thứ tự + toà xanh | F14 | 13 | 260 | thử thách | picker; +1 TNT | Cầu vòm đổ theo thứ tự |
| 66 | R | Ven Sông | nghỉ | inner | — | F19 | 10 | 90 | nghỉ | — | Tháp tầng đổ gọn trong sân |
| 67 | N | Ven Sông | luyện | canyon | đá + phố | F24 | 11 | 130 | trải nghiệm | — | Toà nêm đá đổ vào trong |
| 68 | H | Ven Sông | kết hợp | railcut | đá + ray + thứ tự | F33 | 13 | 260 | thử thách | picker; +1 TNT | Cầu máng đổ, ray sạch |
| 69 | N | Ven Sông | luyện (bất ngờ) | arc | hàng cột domino | F29 | 11 | 120 | bất ngờ | — | 9 cột đổ như phím đàn |
| 70 | B | Ven Sông | kết hợp | set piece | đá + thứ tự + bồn + lô | F20 | 15 | 320 | boss | +1 TNT | Hạ lâu đài vào sân trong |
| 71 | R | Chân Trời | nghỉ | row | domino kính | F31 | 10 | 90 | nghỉ (hứng khởi) | — | Kính vỡ tung cả dãy |
| 72 | N | Chân Trời | **MỚI: tường chắn (chờ Owner)** | tall-low | nổ vòng qua tường | F25 | 11 | 135 | giới thiệu | — | Tường không vỡ: nổ phía sau |
| 73 | N | Chân Trời | luyện tường | c4 | tường + kính | F06 | 11 | 130 | trải nghiệm | — | Kim tự tháp đổ vào sân |
| 74 | N | Chân Trời | luyện tường | bridge | tường + gộp | F07 | 11 | 130 | trải nghiệm | — | Hai tháp và cầu trời đổ cùng nhau |
| 75 | SH | Chân Trời | kết hợp | plaza | đua + tường + thùng | F16 | 14 | 280 | thử thách | picker; +1 TNT | Tháp Deco đổ vào quảng trường |
| 76 | R | Chân Trời | biến thể: siêu cụm 6 toà | mega6 | — | F22 | 11 | 95 | nghỉ | — | 6 toà, sập dây chuyền lớn |
| 77 | N | Chân Trời | luyện | cant | đua kính + phố | F30 | 12 | 135 | trải nghiệm | — | Đua kính lật vào sân |
| 78 | H | Chân Trời | kết hợp | legs | chân thép + tường + bồn | F03 | 13 | 260 | thử thách | picker Sky | Tháp lưới đổ đúng khe |
| 79 | N | Chân Trời | luyện (bất ngờ) | row | 8 tháp kính domino | F34 | 12 | 125 | bất ngờ | — | 8 tháp kính đổ liên hoàn |
| 80 | B | Chân Trời | kết hợp | set piece | gộp + thứ tự + tường + phố | F11 | 15 | 320 | boss | +1 TNT | Tháp xoắn: cắt lõi trước |
| 81 | R | Chân Trời | nghỉ | pair | — | F26 | 10 | 90 | nghỉ | — | Hai tháp, một cú |
| 82 | N | Chân Trời | twist: domino 3 khối vào lô | zone | domino + lô + phố | F25 | 12 | 135 | bất ngờ | — | Chuỗi qua đường, vào lô |
| 83 | N | Chân Trời | luyện | inner | kính trong vỏ BTCT | F36 | 12 | 135 | trải nghiệm | — | Vỏ trước, lõi kính sau |
| 84 | N | Chân Trời | luyện | hidden | lõi ẩn + thứ tự | F21 | 12 | 135 | trải nghiệm | Ball khi lõi đứng | Bệ tượng: lõi sau cùng |
| 85 | SH | Chân Trời | kết hợp | mega6 | đua + tường + 2 loại toà xanh | F05 | 14 | 285 | thử thách | picker; +1 TNT | Nhà hát vỏ sò giữa 2 toà xanh |
| 86 | R | Chân Trời | nghỉ | row | domino | F31 | 10 | 90 | nghỉ (hứng khởi) | — | Dãy kính đổ trong 2 giây |
| 87 | N | Chân Trời | luyện | cant | đua + thứ tự | F02 | 12 | 135 | trải nghiệm | — | Hai toà đua, đúng thứ tự |
| 88 | H | Chân Trời | kết hợp | plaza | kính + bồn + 2 loại toà xanh | F04 | 13 | 265 | thử thách | picker | Quảng trường kính, không trúng ai |
| 89 | N | Chân Trời | luyện (bất ngờ) | zone | lô giữa 2 đường | F03 | 12 | 125 | bất ngờ | — | Tháp lưới rơi giữa lô |
| 90 | B | Chân Trời | kết hợp | set piece | lõi + gộp + đua + phố | F23 | 16 | 330 | boss | +1 TNT | 4 tháp + sàn trời vào lô |
| 91 | R | Vương Miện | ôn: gộp đôi | bridge | — | F17 | 10 | 95 | nghỉ | — | Cầu đàn hạc lớn, gộp đôi |
| 92 | N | Vương Miện | ôn: xoay + phố | canyon | — | F01 | 12 | 135 | trải nghiệm | — | Ba mặt khuất, xoay đủ |
| 93 | N | Vương Miện | ôn: nhiều đợt | hidden | — | F14 | 12 | 135 | trải nghiệm | — | Ba đợt, ba lớp vỏ |
| 94 | N | Vương Miện | ôn: thùng + lô | zone | — | F18 | 12 | 135 | trải nghiệm | — | Sân bát vào lô |
| 95 | SH | Vương Miện | kết hợp | mega6 | 4 cơ chế | F16 | 15 | 290 | thử thách | picker; +1 TNT | Cả khu tháp Deco, một lần |
| 96 | R | Vương Miện | nghỉ | row | domino 8 silo | F27 | 11 | 95 | nghỉ (hứng khởi) | — | 8 cối xay đổ liên hoàn |
| 97 | N | Vương Miện | ôn: đua + thứ tự | cant | — | F30 | 12 | 135 | trải nghiệm | — | Đua đôi lật ngược nhau |
| 98 | H | Vương Miện | kết hợp | railcut | đá + kính + ray | F33 | 14 | 270 | thử thách | picker | Cầu dàn lớn, ray sạch |
| 99 | N | Vương Miện | bất ngờ | row | chuỗi lớn nhất game | F31 | 12 | 125 | bất ngờ | — | Một cú, cả khu phố đổ |
| 100 | B | Vương Miện | kết hợp | set piece | ≤4 cơ chế, 3 đợt | F07 | 16 | 340 | boss cuối | +1 TNT | Hạ cặp tháp chọc trời lớn |

Tổng ước tính: ≈ 15 600 s cho L1–100 ≈ 2,6 phút/màn. 70 phút/ngày ≈ 27 màn/ngày. **L100 hết sau ≈ 4 ngày** với người chơi
chăm: trước khi tăng chi UA (GTM-PLAN: cần 100+ màn) phải có pipeline L101+ (Q6).

---

## 4. Cung trải nghiệm người chơi

| Dải | Cảm giác muốn có | Khoảnh khắc "wow" | Điểm dừng / thưởng | Mốc bản đồ |
|---|---|---|---|---|
| L1–10 Phố Cũ | "mình giỏi" ngay 30 s đầu, rồi "à ra thế" khi phải xoay | L3 tháp đồng hồ mở màn domino; L5 tháp nghiêng kéo về phía an toàn; L8 tháp lưới 3 chân gộp đôi là sụp; L9 cầu trời kéo cả cụm tháp; L10 cầu cất gãy đôi | L7 Hard (50 xu), L10 boss + Wrecking Ball | mở Bến Cảng |
| L11–20 Bến Cảng | sức mạnh (Ball), rồi "nổ, nhìn, nổ tiếp" | L12 vỏ bệ tượng rơi để lộ lõi; L19 nhà khối đổ dây chuyền; L20 cầu vòm thép sụp | L15 Hard, L20 boss + Safety Net | mở Trung Tâm |
| L21–30 Trung Tâm | kính vỡ tung, chuỗi thùng nổ "miễn phí" | L24 domino qua 3 vật liệu; L29 domino chạm thùng nổ cuối dãy; L30 tháp bậc siêu cao hạ từng đoạn | L25, L28 Hard; L30 boss + Sky Strike | mở Ga & Xưởng |
| L31–40 Ga & Xưởng | chính xác: đổ đúng vào lô | L33 cả dãy nằm gọn trong lô; L36 toà đua tự lật; L40 đấu trường đổ vào lòng sân | L35, L38 Hard; L40 boss | — |
| L41–50 Ga & Xưởng | kỹ sư: cắt ray, tháo tấm | L42 nhịp cầu rơi xuống hào; L49 mặt tấm "tháo khoá" liên hoàn; L50 cầu treo 3 trụ | L45, L48 Hard; L50 boss (rương mốc chờ Owner) | nửa đường: mở Ven Sông |
| L51–60 Ven Sông | thư giãn sau khu công nghiệp, đồ vật "nặng đầu" | L52 đĩa tháp quan sát rơi trước kéo thân; L59 hải đăng mở đầu cả dãy; L60 vòng quay lăn vào lô | L55 SH (100 xu), L58 H, L60 boss | — |
| L61–70 Ven Sông | chiến thuật: thứ tự đợt | L62 tháp nghiêng đè lên kho; L69 cổng cột đổ như phím đàn; L70 lâu đài sập vào sân trong | L65, L68 H; L70 boss | mở Chân Trời |
| L71–80 Chân Trời | quy mô lớn, kính và thép | L76 siêu cụm 6 toà; L79 8 tháp kính; L80 tháp xoắn: lõi rồi vỏ | L75 SH, L78 H; L80 boss | — |
| L81–90 Chân Trời | thành thạo, nhiều mặt, nhiều đợt | L82 chuỗi qua đường vào lô; L90 4 tháp + sàn trời | L85 SH, L88 H; L90 boss | mở Vương Miện |
| L91–100 Vương Miện | "mình đã học hết": ôn tập ở dạng khó nhất | L96 8 cối xay; L99 chuỗi lớn nhất game; L100 cụm tháp cầu trời lớn nhất | L95 SH, L98 H; L100 boss (rương cuối chờ Owner) | hết khu: báo "sắp có khu mới", không lặp im lặng |

Nhịp phiên: 1 dải 10 màn ≈ 25 phút ≈ 1 phiên (TEST-PLAN: ≥3 phiên/ngày). Boss ở cuối dải là điểm dừng tự nhiên có thưởng lớn;
Hard ở x5 là điểm dừng giữa dải (~12 phút). Quảng cáo xen kẽ (khi có) ≥5 màn/lần, chỉ sau thắng, không trước màn đầu phiên.
Phiên đầu ≥15 phút đã có trong L1–8 (TEST-PLAN P1).

---

## 5. Thư viện toà biểu tượng (hero library) L1–100

Quyết định Owner 11/11 (sau bản đầu của brief này): **mỗi màn có 1 toà biểu tượng chính theo dáng địa danh nổi tiếng, nhìn là nhận ra**,
**giữ cả các dáng đã đăng ký nhãn hiệu**. Bảng F1 đã duyệt: `art-brief/heroes/F1-famous-6.png` (Figma node 53:3).
Các thiết kế công nghiệp/cảng cũ (bảng S1: cần cẩu, hải đăng sọc, kho răng cưa, toà nêm, ga phà, silo) chuyển thành **toà phụ đồ sộ**.

### 5.1 Pháp lý (Lead ghi, Owner chấp nhận rủi ro)

| Luật | Áp dụng |
|---|---|
| **Chỉ trong game** | Mọi toà F01–F36 **không** được dùng trong ảnh store, video preview, icon, quảng cáo, playable, bài đăng mạng xã hội. Clip quảng cáo chỉ dùng toà phụ (S), toà xanh và L1 khi đã thay toà F bằng toà phụ. |
| Tên | Tên tự đặt, không tên thật, không biệt danh thật, không chơi chữ trên tên thật (không "Big Ben", "Iron Lady", "Coat Hanger", "Eiffel"…) |
| Không | đèn trình diễn ban đêm, logo, chữ, biển hiệu, cờ, quốc huy/con dấu, bối cảnh skyline thật hay tên thành phố thật |
| Không dấu tôn giáo / tưởng niệm | tháp nghiêng: không chuông, không thánh giá, không nhà thờ cạnh bên; khải hoàn môn: không chữ khắc, không phù điêu chiến tranh, không ngọn lửa, không mộ; bệ tượng: **không có tượng**; sảnh mái vòm kiểu capitol: không cờ, không con dấu, không tượng trên đỉnh |
| Tháp đôi + cầu trời | Owner đã duyệt (F1). Giữ: không máy bay, không khói cột, không chữ "collapse/attack"; hiệu ứng như mọi toà khác |
| Vẫn bỏ | nơi thờ tự đang hoạt động (nhà thờ, chùa, đền, tháp nhiều mái chùa), đài tưởng niệm thật, nơi gắn khủng bố/thảm hoạ được gọi tên, trụ sở chính phủ có nhận diện thật, Landmark 81 / Bitexco |
| Kiểm tra | Trước khi phát hành rộng: luật sư xem danh sách F (LEGAL-LANDMARKS §5.6); trước đó chỉ soft launch |

**Danh sách loại khỏi quảng cáo/store (toàn bộ F):** F01–F36. Những toà có rủi ro cao nhất (chủ sở hữu từng kiện hoặc có nhãn hiệu hình dáng):
F04 (kim + đĩa), F05 (nhà hát vỏ sò), F07 (tháp đôi cầu trời), F12 (tháp bậc siêu cao), F15 (cầu treo), F16 (tháp Deco), F19 (tháp tầng đoạn),
F22 (tháp bậc cột buồm), F23 (3 tháp + sàn), F26 (tháp kim tự tháp), F06 (kim tự tháp kính), F09 (cầu cất 2 tháp), F13 (vòng quay), F03 (tháp lưới sắt).

### 5.2 Luật kích thước (Owner: toà biểu tượng phải TO hơn nhiều)

| Luật | Giá trị |
|---|---|
| Toà biểu tượng là khối lớn nhất màn | cao 15–30 "tầng tương đương" (45–90 m) **hoặc** rộng 6–10 bay; tối thiểu 15 tầng tương đương từ L11, 20 từ L31, 25–30 cho boss |
| Chiếm màn hình | ở góc mở màn trên 390×844: **60–75% chiều cao vùng chơi** (không tính thanh HUD trên/dưới); camera lùi ra cho vừa cả lô |
| Toà phụ đồ sộ | cao 40–70% toà biểu tượng (hoặc rộng ≥ ½ toà biểu tượng); không dùng kiốt/lán làm mục tiêu chính |
| Toà xanh lớn | trường/bệnh viện 3–6 tầng, 4×2 đến 6×3 bay, theo dải §5.3 |
| Điều khiển khi camera lùi xa | vùng chạm vô hình ≥44 pt cho mọi cột (skill §4), hút về cột hợp lệ gần nhất trong 24 pt; nếu cột trên màn < 12 pt thì phải dùng module lớn hơn, không thu nhỏ vùng chạm |

**Module lớn (giữ ≤ ~400 bodies):** "tầng tương đương" là tầng nhìn thấy; tầng vật lý có thể là module 2 tầng.

| Công thức module | Thông số đề xuất | Ghi chú đo |
|---|---|---|
| M1 tầng đôi | `fh` 6.0 (2 tầng nhìn, 1 tầng vật lý), đường sàn giữa chỉ vẽ | vòng 4 đã dùng `fh` 3.0; 6.0 chưa đo |
| M2 bay lớn | `bay` 4.0–4.5 + `colk` ×1,6 + `st` ×1,5 | vòng 4: bay 3,2–3,6 với cột cỡ thường nứt khi đứng yên → **phải đo trước** với cột to |
| M3 tấm gộp | 1 tấm tường/kính cho cả bay × 2 tầng; sàn 1 khối/tầng | giảm ~40% bodies mặt tiền |
| M4 chi tiết chỉ vẽ | lưới sắt, dây cáp, cabin, cửa sổ, gờ, mái vòm bậc nhỏ = render-only (`lmRod`) | đã có ở LANDMARKS-V2 |
| Ngân sách | toà biểu tượng ≤180 bodies · mỗi toà phụ ≤60 · toà xanh ≤35 · tổng ≤400 | 1 tầng khung 3×3 ≈ 17 bodies (16 cột + 1 sàn) |

Toà **không đạt** kích thước dưới 400 bodies với module thường (cần M1+M2+M4, đo lại trước khi dựng):
F07 tháp đôi cầu trời (2 × 25 tầng), F12 tháp bậc siêu cao (30 tầng), F23 3 tháp + sàn, F15 cầu treo (sàn dài + 2 trụ), F08 đấu trường (vòng 16 trụ × 3 tầng),
F09 cầu cất boss, mọi màn mega6 (L76, L85, L95) và L100. Công thức đề xuất cho nhóm này: M1 tầng đôi + lõi 2×2 bay (8 cột thay vì 16) + vỏ M3 + chi tiết M4;
F03/F04/F13 dùng 4 chân vật lý + khối sàn, lưới/cabin chỉ vẽ.

### 5.3 Toà phụ và toà xanh đồ sộ theo dải

| Dải | Toà phụ (mục tiêu) | Cỡ toà phụ | Toà xanh | Cỡ toà xanh | Dùng để làm khó |
|---|---|---|---|---|---|
| L1–10 | 1–2 | 5–8 tầng, ≥3×2 bay | 0–2 | 2–3 tầng, 4×2 | hướng đổ (L5–7) |
| L11–30 | 2–3 | 8–12 tầng, 4×3 | 1–2 | 3–4 tầng, 5×2 | 1 toà phụ cao ≥50% toà chính đứng sát, toà xanh ôm chân |
| L31–50 | 3 | 10–15 tầng, 1 toà ≥60% | 1–2 | 4 tầng, 5×3 | lô/ray hẹp giữa toà chính và toà phụ |
| L51–70 | 3–4 | 1 khối dài 10 tầng × 6–8 bay + 2 khối 8–12 tầng | 2 | 4–5 tầng, 6×3 | toà xanh lớn ở hướng đổ tự nhiên của toà chính |
| L71–100 | 4–6 (mega6) | 2 toà ≥12 tầng (≥60%), còn lại 8–10 | 2 (trường + viện) | 5–6 tầng, 6×3 | 2 phía bị chặn, chỉ 1 khe đổ |

Thư viện toà phụ (S): S01 cần cẩu cổng · S02 hải đăng sọc · S03 kho mái răng cưa · S04 toà nêm văn phòng · S05 ga phà mái sóng · S06 dãy silo
(bảng S1 có sẵn: `art-brief/heroes/S1-H11-H16.png`) · S07 khối văn phòng 12 tầng · S08 khu nhà tấm · S09 xưởng gạch + ống khói · S10 khách sạn ban công ·
S11 sảnh ga · S12 tháp nước · S13 khán đài · S14 dãy nhà phố · S15 tháp kính phẳng · S16 nhà xe nhiều tầng · S17 trường lớn 5 tầng · S18 bệnh viện lớn 6 tầng.
Toà phụ được làm to theo bảng trên (bảng S1 hiện quá nhỏ: dựng lại cao gấp 2–3).

### 5.4 Thư viện toà biểu tượng F01–F36

**Luật twist (Owner 11/11):** 6 toà đầu tiên đưa vào game là bản **F1b** (`art-brief/heroes/F1b-famous-twist.png`, node 54:2:
tháp đồng hồ vuông nghiêng, tháp lưới 3 chân, tháp quan sát 2 đĩa, nhà hát mái quạt gấp, kim tự tháp kính bậc, 3 tháp cầu vòng tam giác) để thử
trong game (Owner: "twist hơi nhiều, nhưng cứ thử"). **Mọi toà còn lại: twist nhẹ, đúng 1 thay đổi rõ** (số tháp/chân/đĩa, tỉ lệ, hoặc
kiểu mái), giữ dáng nhận ra ngay; không đổi nhiều thứ cùng lúc. Bản F1 (gốc, `F1-famous-6.png`) giữ làm tham chiếu dáng.
Các luật pháp lý §5.1 (không chữ, logo, cờ, tượng, dấu tôn giáo/tưởng niệm) không tính là "thay đổi" và luôn áp dụng.

"Đọc ra ở 390 px" = nét nhận ra khi toà cao ~450 px trên màn. "Câu đố cài sẵn" = bài học nằm trong kết cấu toà. Màn = các màn toà là toà chính (§3.4).

| Mã | Dáng nổi tiếng (gợi nhớ) | Tên của mình | Đọc ra ở 390 px | Twist nhẹ (đúng 1 thay đổi) | Vật liệu + kết cấu, chỗ yếu | Câu đố cài sẵn | Khu / màu | Màn |
|---|---|---|---|---|---|---|---|---|
| F01 | tháp đồng hồ lớn | Old Tock | thân vuông cao, mặt đồng hồ 4 phía, mái chóp nhọn | thấp mập hơn (tỉ lệ cao:rộng 4:1 thay 7:1) | gạch thân, đỉnh đá nặng; đế bê tông | đổ theo 1 khe: khía chân phía an toàn | Phố Cũ kem/gạch | 3, 32, 47, 63, 92 |
| F02 | tháp chuông tròn nghiêng | The Tilt | tháp nghiêng rõ trên đế gạch, đồng hồ trên đỉnh | **F1b**: tháp VUÔNG có đồng hồ thay trụ tròn hành lang cột | đá kem, trụ bậc 8 cạnh, nghiêng sẵn 5° | nghiêng về phía toà xanh: phải kéo đổ về phía an toàn (xoay ra sau) | Phố Cũ → Chân Trời | 5, 16, 37, 62, 87 |
| F03 | tháp lưới sắt 4 chân | Rivet Tower | chân lưới xoè, sàn tròn, thân thon lên kim | **F1b**: 3 chân thay 4, cabin kính trên sàn | 3 chân thép (gộp 2), sàn bê tông; lưới chỉ vẽ | gộp TNT trên chân | Phố Cũ / Ga / Chân Trời | 8, 33, 78, 89 |
| F04 | tháp kim có đĩa | Sky Saucer | thân trụ cao, đĩa tròn quan sát, kim | **F1b**: 2 đĩa trên 1 thân trụ | chân thép trên móng; đĩa = khối nặng (rtank) | đĩa nặng rơi trước, đổ về khe; gộp chân | Trung Tâm → Chân Trời | 26, 34, 43, 52, 88 |
| F05 | nhà hát mái vỏ sò/cánh buồm | Shell Hall | mái nhọn cong xếp lớp trên bệ có bậc | **F1b**: mái quạt gấp thay vỏ sò | mỗi vỏ = chồng lớp bậc trên 4 chân bê tông; bệ BTCT | 1 quả mỗi vỏ, đúng thứ tự | Bến Cảng / Ven Sông / Chân Trời | 11, 54, 85 |
| F06 | kim tự tháp kính trước cánh cung điện | Glass Point | khối kính tháp bậc trước dãy cung điện mansard | **F1b**: kim tự tháp kính BẬC (ziggurat) thay chóp nhọn | kính (không chịu lực) trên khung thép; cánh nhà gạch đá là mục tiêu chính | kính không đỡ gì: nổ khung và cánh nhà | Trung Tâm / Ven Sông / Chân Trời | 22, 53, 73 |
| F07 | tháp đôi chọc trời nối cầu trời | Sister Spires | tháp kính bậc nhọn nối nhau bằng cầu trời | **F1b**: 3 tháp + cầu vòng tam giác thay 2 tháp | 3 tháp bằng nhau (M1+M2), cầu vòng thép gộp 3 | 1 quả dưới mỗi tháp: cầu kéo cả cụm (domino qua cầu) | Phố Cũ / Trung Tâm / Chân Trời / Vương Miện | 9, 29, 74, 100 |
| F08 | đấu trường vòng cổ | The Ring | vòng 3 tầng vòm, 1 phía cao hơn | vòng hoàn chỉnh 4 tầng đều (không phần sụp) | vòng trụ đá (1 quả/trụ sát), vòm chỉ vẽ | đổ vào lòng sân (lô = sân) | Ga & Xưởng | 40 (boss) |
| F09 | cầu cất 2 tháp | Lift Bridge | 2 tháp vuông có chóp, lối đi cao, 2 cánh cầu | mái chóp đất nung thấp thay tháp nhọn Gothic | 2 tháp 4 chân, lối đi thép (gộp 3), cánh cầu | chân sau của cả 2 tháp + xoay | Phố Cũ | 10 (boss) |
| F10 | khải hoàn môn | Grand Arch | khối vuông lớn có vòm xuyên giữa đường | 3 vòm (1 lớn + 2 nhỏ hai bên) thay 1 vòm | đá/gạch, 2 trụ dày, xà trên | vòm trên đường: đổ sang bên, đường sạch | Phố Cũ / Ga / Ven Sông | 7, 45, 58 |
| F11 | tháp xoắn | The Twister | các tầng xoay dần | đỉnh bằng có vườn thay kim | lõi BTCT (cắt trước) + sàn xoay (M1) | 2 đợt: lõi rồi vỏ | Chân Trời | 80 (boss) |
| F12 | tháp bậc siêu cao có kim | Sky Steps | nhiều lần lùi bậc, kim mảnh rất cao | mặt bằng chữ thập 4 cánh thay chữ Y | dải thép ở mỗi lần lùi (gộp 2), lõi BTCT | hạ từng đoạn theo đợt; Sky Strike đáng dùng | Trung Tâm | 30 (boss) |
| F13 | vòng quay quan sát | Sky Wheel | vòng tròn lớn, cabin, chân chữ A | 2 chân chữ A đối xứng thay chân xiên 1 phía | chân bê tông là chỗ yếu; vòng/cabin chỉ vẽ | lăn vòng vào lô | Ven Sông | 60 (boss) |
| F14 | sảnh mái vòm kiểu capitol | Dome Hall | vòm cao trên trống cột, 2 cánh | thêm 2 vòm nhỏ trên 2 cánh | cánh bê tông, trống đá, lõi BTCT trong trống | mặt tiền trước, lõi sau (nhiều đợt) / cụm 4 đổ ra ngoài | Phố Cũ → Vương Miện | 6, 15, 35, 65, 93 |
| F15 | cầu treo 2 trụ cổng | Hang Bridge | 2 trụ cổng cao, dây võng | 3 trụ cổng thay 2 | trụ BTCT (sát), sàn thép không gãy; cáp chỉ vẽ | 2 trụ cổng, đổ ra xa ray | Ga & Xưởng | 50 (boss) |
| F16 | tháp Deco đỉnh vương miện | Deco Needle | thân bậc, vương miện bậc nhọn, kim | vương miện bậc vuông thay vòm tia nắng | dải thép ở vương miện (gộp 2), thân bê tông | đổ vào quảng trường, không ra đường | Trung Tâm / Chân Trời / Vương Miện | 25, 75, 95 |
| F17 | cầu dây văng 1 trụ | Harp Span | 1 trụ chữ A cao, dây toả quạt | 2 trụ chữ A thay 1 | trụ trên chân thép (gộp 2), dây chỉ vẽ | gộp ở chân trụ, nhịp rơi xa | Bến Cảng / Ga / Vương Miện | 18, 44, 91 |
| F18 | sân bát | The Bowl | bát thấp rộng, mái vòng | mái vòng răng cưa | khán đài bê tông, mái thép | đổ vào lòng sân (lô) | Ven Sông / Vương Miện | 55, 94 |
| F19 | tháp tầng đoạn (không mái chùa) | Stack Tower | 6–8 đoạn loe xếp chồng | 5 đoạn thay 8 | mỗi đoạn có dải BTCT giữa tầng | dải cứng giữa tầng: nổ trên/dưới dải; Sky Strike từ đỉnh | Ga & Xưởng / Ven Sông | 31, 49, 66 |
| F20 | lâu đài cổ tích | Snowcap Keep | tháp tròn mũ nón, tường thành | thấp: 1 tháp chính + 4 tháp tròn | đá (sát trụ), sân trong là lô | đổ vào sân trong theo thứ tự | Ven Sông | 70 (boss) |
| F21 | bệ tượng khổng lồ (không có tượng) | The Pedestal | bệ vuông cao trên nền pháo đài sao | không có tượng (nền sao giữ nguyên) | vỏ đá + lõi BTCT trong bệ | nhiều đợt: vỏ rồi lõi | Bến Cảng / Ven Sông / Chân Trời | 12, 64, 84 |
| F22 | tháp bậc có cột buồm | The Stepper | thân thon bậc, cột buồm đỉnh | đèn lồng bậc trên đỉnh thay cột buồm | dải thép ở lần lùi, thân bê tông | cả hàng sau / Net bắt mảnh | Trung Tâm / Chân Trời | 21, 76 |
| F23 | 3 tháp + sàn trời | The Surfboard | 3 tháp đứng, 1 sàn dài trên đỉnh | 4 tháp thay 3 | 3 tháp M1, sàn thép gộp 3 | sàn trói 3 tháp: nổ mặt sau mỗi tháp | Chân Trời | 90 (boss) |
| F24 | toà nêm góc phố | The Doorstop | mặt bằng tam giác, mũi nhọn | mũi cắt bằng thay nhọn | lưới hẹp dần | mũi chỉ ra đường: đổ ngược lại | Bến Cảng / Ga / Ven Sông | 17, 48, 67 |
| F25 | tháp viên đạn lưới chéo | The Bullet | thân phình nhọn đầu, lưới chéo kính | mập hơn, đỉnh bằng | kính trên khung thép chéo | kính không đỡ gì: nổ khung; tường chắn | Trung Tâm / Chân Trời | 23, 72, 82 |
| F26 | tháp kim tự tháp có cánh | The Pencil | tháp chóp thon, 2 cánh | 1 cánh thay 2 | lõi BTCT giữ chóp, cánh bê tông | lõi giữ cả kim: cắt lõi | Trung Tâm / Ga / Chân Trời | 27, 38, 81 |
| F27 | cối xay gió Hà Lan | Old Whirly | thân thon, 4 cánh lớn | 6 cánh thay 4 | gỗ, cánh chỉ vẽ | màn nghỉ: chạm trụ là đổ | Phố Cũ / Ga / Ven Sông / Vương Miện | 1, 41, 51, 96 |
| F28 | hải đăng sọc nổi tiếng | Stripey Light | trụ cao sọc, phòng đèn | sọc ngang thay sọc xoắn | gạch trên đế | đổ khỏi đường/lối đi | Phố Cũ / Bến Cảng / Ven Sông | 2, 14, 59 |
| F29 | cổng cột thành phố | Pillar Gate | hàng cột lớn dưới xà, cỗ xe trống | 4 cột thay 6, không tượng cỗ xe | 6 cột đá dưới 1 xà | 1 quả không đủ: cột 2 đầu giữ xà | Ven Sông | 57, 69 |
| F30 | khách sạn cánh buồm | The Sail | tháp hình buồm, mặt cong | 2 buồm đôi thay 1 | khối nặng lệch (đua) | đua: lật về phía an toàn | Bến Cảng / Ga / Chân Trời / Vương Miện | 13, 36, 77, 97 |
| F31 | tháp mảnh kính nhọn | The Splinter | kim tự tháp kính rất cao, đỉnh tách mảnh | đỉnh tách 2 mảnh | kính + khung, lõi bê tông | domino kính | Trung Tâm → Vương Miện | 24, 39, 71, 86, 99 |
| F32 | cầu vòm thép bến cảng | Big Bow | vòm thép lớn trên sàn, 4 trụ đá | 2 vòm song song thay 1 | vòm thép (gộp 3), trụ đá | boss: đợt + gộp + phố | Bến Cảng | 20 (boss) |
| F33 | cầu máng La Mã 3 tầng | The Long Drink | 3 tầng vòm, tầng trên nhỏ | 2 tầng vòm thay 3 | trụ đá (1 quả/trụ sát) | ray dưới vòm: đổ ra xa ray | Ga & Xưởng / Ven Sông / Vương Miện | 42, 56, 68, 98 |
| F34 | tháp bó ống | Tube Bundle | các ống vuông cao thấp bó lại | 5 ống thay 9 | ống bê tông riêng (thứ tự cao → thấp) | cắt từng ống theo đợt | Trung Tâm / Ga / Chân Trời | 28, 46, 79 |
| F35 | nhà khối lập phương trên cột | Cube Grove | khối lập phương nghiêng trên cột | 7 khối xếp vòng cung | khối trên 1 cột bê tông | domino khối | Phố Cũ / Bến Cảng / Ven Sông | 4, 19, 61 |
| F36 | bảo tàng xoắn ốc | The Coil | các vòng rộng dần lên trên | vòng vuông bo góc thay tròn | vòng nặng trên lõi | toà trong toà: vòng trên rơi trước | Chân Trời | 83 |

Boss dùng toà chỉ xuất hiện 1 lần (F08, F09, F11, F12, F13, F15, F20, F23, F32); riêng L100 là bản lớn nhất của F07 (khác hẳn L9/L29/L74: 30 tầng tương đương, 4 toà phụ).

### 5.5 Kế hoạch bảng Figma

Hai loại bảng, mỗi bảng 6 toà, **cùng góc máy và phong cách bảng F1** (đồ chơi gạch khối isometric, nền kem).

**F-sheet (toà biểu tượng)**

| Bảng | Toà | Ưu tiên |
|---|---|---|
| F1 ✔ duyệt (tham chiếu dáng) · **F1b ✔ thử trong game** | F02, F03, F04, F05, F06, F07 (dùng bản F1b) | — |
| F2 | F01, F09, F10, F14, F27, F28 | 1 (L1–20, boss L10) |
| F3 | F32, F12, F21, F30, F24, F35 | 2 (boss L20, L30) |
| F4 | F08, F15, F16, F17, F22, F25 | 3 (boss L40, L50) |
| F5 | F13, F20, F18, F19, F26, F29 | 4 (boss L60, L70) |
| F6 | F11, F23, F31, F33, F34, F36 | 5 (boss L80, L90) |

**Câu lệnh chung F (đặt đầu):** "Isometric 3/4 view from front-left, about 30° above, chunky toy model built from small rounded bevelled
blocks (brick-toy look, every curve made of stepped boxes), plain warm cream background #FBF6EA, soft studio light from top-left, soft
contact shadow, daytime, no text, no logos, no flags, no people, no night lighting. Materials: sandstone honey-yellow, cream stone, red
brick, light grey concrete, dark grey reinforced concrete, gunmetal steel, glass dusty teal #6F9DB5. Show the ground-storey columns and
legs clearly. Never use the light-blue/royal-blue of protected buildings. Same style as sheet F1. Draw it TALL and massive. Keep the landmark instantly recognisable and change exactly the ONE thing stated."

**Prompt riêng:**
- F01 Old Tock: "big square clock tower in red brick with cream stone trim, four clock faces, steep pointed slate roof with a small spire; ONE change: squatter proportion (height about 4× width)."
- F09 Lift Bridge: "twin-tower bascule bridge, two square stone towers, high walkway joining their tops, two lifting road leaves; ONE change: low terracotta pyramid caps instead of gothic pinnacles."
- F10 Grand Arch: "massive stone triumphal-style arch over a road; ONE change: one big arch flanked by two small arches; plain, no inscriptions, reliefs, statues or flame."
- F14 Dome Hall: "large hall with a tall dome on a ring of columns and two long wings in cream stone; ONE change: a small dome on each wing; no flag, no statue."
- F27 Old Whirly: "classic Dutch windmill, tapering timber tower, cap and lattice sails; ONE change: six sails instead of four."
- F28 Stripey Light: "tall round lighthouse with gallery and glass lamp room; ONE change: horizontal cream and coral bands instead of a spiral."
- F32 Big Bow: "huge steel arch bridge over a long deck with stone pylons at the ends; ONE change: two parallel arches."
- F12 Sky Steps: "very tall stepped supertall in teal glass, many setbacks narrowing to a thin spire; ONE change: cross-shaped four-wing plan."
- F21 The Pedestal: "giant stone pedestal on an eight-pointed star fort base; ONE change: NO statue, only an empty flat top."
- F30 The Sail: "sail-shaped hotel tower with a curved face on a podium; ONE change: two sails side by side."
- F24 The Doorstop: "triangular flatiron-style corner building, cream and terracotta; ONE change: the prow is cut flat."
- F35 Cube Grove: "tilted cube houses each on one thick pole; ONE change: seven cubes in an arc."
- F08 The Ring: "oval arena with tiers of arches in honey stone; ONE change: complete and even, four tiers all round, not a ruin."
- F15 Hang Bridge: "suspension bridge with tall portal towers and draped cables over a dry cut; ONE change: three towers instead of two."
- F16 Deco Needle: "Art Deco skyscraper with a pointed crown and needle; ONE change: crown of square stepped terraces instead of a sunburst."
- F17 Harp Span: "cable-stayed bridge with A-shaped pylon and fan cables; ONE change: two pylons."
- F22 The Stepper: "setback skyscraper in sand stone; ONE change: a stepped lantern on top instead of a mast."
- F25 The Bullet: "rounded bullet-shaped glass tower with diagonal grid; ONE change: fatter with a flat top."
- F13 Sky Wheel: "giant observation wheel with many cabins; ONE change: two symmetrical A-frame legs."
- F20 Snowcap Keep: "fairy-tale castle with round towers and cone roofs; ONE change: squat, one main tower and four round towers."
- F18 The Bowl: "wide stadium bowl with a ring roof; ONE change: saw-tooth ring roof."
- F19 Stack Tower: "tall tower of flared stacked segments; ONE change: five segments instead of eight; no curved pagoda roofs."
- F26 The Pencil: "slender pyramid skyscraper with wings near the top; ONE change: one wing instead of two."
- F29 Pillar Gate: "monumental city gate of columns under a heavy beam; ONE change: four columns, empty top (no chariot, no flags)."
- F11 The Twister: "tower whose floors rotate step by step around a core; ONE change: flat garden top instead of a spire."
- F23 The Surfboard: "towers joined by one long sky deck on their roofs; ONE change: four towers instead of three; no pool."
- F31 The Splinter: "very tall glass pyramid tower with a split top; ONE change: the top splits into two shards."
- F33 The Long Drink: "stone arched aqueduct; ONE change: two tiers instead of three."
- F34 Tube Bundle: "skyscraper of square tubes of different heights bundled together; ONE change: five tubes instead of nine."
- F36 The Coil: "spiral museum of rings widening upward; ONE change: rounded-square rings."

**S-sheet (toà phụ đồ sộ, cùng phong cách, cao gấp 2–3 bảng S1)**

| Bảng | Toà |
|---|---|
| S1 ✔ có (làm lại to hơn) | S01–S06 |
| S2 | S07 khối văn phòng 12 tầng · S08 khu nhà tấm 10 tầng · S09 xưởng gạch + ống khói · S10 khách sạn ban công 12 tầng · S11 sảnh ga dài · S12 tháp nước lớn |
| S3 | S13 khán đài · S14 dãy nhà phố 8 tầng · S15 tháp kính phẳng 14 tầng · S16 nhà xe 6 tầng · S17 trường lớn 5 tầng (nóc tháp chuông đã duyệt) · S18 bệnh viện lớn 6 tầng (nóc bãi đáp đã duyệt) |

Câu lệnh chung S: như F, thêm "a big secondary building, wide and heavy, 8–14 storeys, plain and readable, less ornament than a landmark".

Chữ khen combo (đã duyệt): `art-brief/figma-ui/combo-words-v2.png`.
Duyệt: Owner chọn/sửa trên `level-review` hoặc Planner. Generator chỉ dựng toà đã duyệt; chưa duyệt thì dựng khối chung và đánh dấu `heroPending`.

---

## 6. Spec cho generator (agent kế tiếp)

### 6.1 Công thức dưới dạng dữ liệu

```
level = {
  n, tier: T|N|H|SH|R|B, district, palette,
  lesson: {id, stage: teach|exp|twist|combine}, newThing: null|id,
  archetype, heroId (F01–F36), heroScale: {storeysEq, bays, module: M1|M2|M3|M4}, secondaries: [{id: S01–S18, heightRatio}], protected: [{type: school|hospital, side, gap_m}], street|zone|rail: {side, limit: 10},
  materials: {...share}, waves: "free" (thắng khi ≥85 sau 1 lần nổ),
  tnt: {given, expert, minFound}, tip (≤6 chữ), boosterPush, goal, intent, feel
}
```
Nguồn hàng: bảng §3.4 → `levels6/sim/curve-r6.csv` (cùng cột `curve-r4c.csv`: purpose, goal, feel, booster_push).

### 6.2 Khuôn theo kiểu màn

| Kiểu | Diện tích nền (bay 2,7 m) | Tầng | Toà | Vật liệu chính | Dải cứng | Toà xanh | Đường/lô |
|---|---|---|---|---|---|---|---|
| pair | 3×2 … 5×3 | 4–9 | 2 + 1 kiốt | theo bài | 0–1 | 0–1 | tuỳ |
| tall-low | tháp 3×3, thấp 4×2 | 8–12 / 2–4 | 3 | bê tông + 1 | 0–1 | ôm chân 1,2–2,0 m | tuỳ |
| row | 4–8 khối 3×2 | 4–9 giảm dần | 4–8 | trộn | 0 | ≤1 ở cuối dãy hoặc giữa (bỏ qua) | lô/đường 1 bên |
| yard | 4–6 toà thấp | 2–5 | 4–6 | gỗ/gạch/BTCT | 0 | 0 | — |
| c4 | 4 khối quanh 1 toà xanh | 4–8 | 4 | trộn | 0–1 | giữa, cách 1,2 m | — |
| canyon | 2 hàng dọc phố | 5–10 | 3–5 | bê tông | 0–1 | 2 bên | phố giữa |
| bridge | 2 tháp **bằng nhau** + cầu thép | 6–10 | 3 + 2 nhà phụ | bê tông + thép | sàn cầu (gộp 3) | 0–1 | tuỳ |
| legs | tháp trên 2 tầng chân thép | 8–10 | 3–4 | thép + bê tông | chân (gộp 2) | 0–1 | tuỳ |
| hidden / inner | vỏ + lõi riêng (chỉ nối với chính nó) | 6–10 | 3–4 | BTCT + bê tông | lõi | 0–1 | tuỳ |
| plaza | 4 toà quanh quảng trường | 5–10 | 5 | trộn | 1 | giữa | đường 1 bên |
| zone | 2–4 toà quanh lô | 5–9 | 3–4 | trộn | 0–1 | bao 2 phía | đường bao lô |
| cant | khối trên lệch 1,5–2 bay | 6–10 | 3 | bê tông | 0 | phía đua hoặc sau | tuỳ |
| railcut | cầu/mố qua hào ray | 3–6 | 3 | thép + bê tông | sàn | 0–1 | ray = đường ≤10% |
| arc | dãy vòm/cột | 2–4 | 2–3 | đá/bê tông | 0 | 0–1 | đường dưới vòm |
| mega6 | 6 toà + toà biểu tượng | 4–12 | 7 | trộn | 1–2 | 2 (cả 2 loại) | 1 |
| set piece | riêng mỗi boss | — | ≥4 phần rơi ở thời điểm khác nhau | — | ≤4 cơ chế | ≥2 | ≥1 |

Bằng chứng đã đo (PLAN §1, §12–13): khoảng cách toà xanh ≥1,2 m; cầu chỉ nối tháp bằng nhau; gỗ 2 hàng cột sâu; gạch cao tối đa 9 tầng trên 3×2; dải thép trên 1 khung sẽ sập xuyên (muốn "sập theo tầng" phải dựng thành phần riêng); bay 3,2–3,6 m nứt khi đứng yên.

**Toà chính và toà phụ đồ sộ:** bảng trên là cận dưới cho toà phụ (tầng = tầng vật lý). Toà chính theo luật kích thước §5.2 (15–30 tầng tương đương hoặc 6–10 bay, chiếm 60–75% màn hình), toà phụ và toà xanh theo §5.3; đạt kích thước bằng module lớn M1–M4 (§5.2), **không** bằng thêm mảnh. Toà không đạt dưới ~400 bodies thì ghi rõ trong báo cáo và dùng công thức M1+M2+M4.

### 6.3 Luật ngân sách TNT

1. Expert = kế hoạch đúng theo mẹo; minFound = bỏ dần quả khỏi expert tới khi trượt 85.
2. `given = max(expert, minFound + dư)` với dư theo hạng: T +2, R +2, N +1 (≈10–20%), H +0–1, SH/B +0–1.
3. Ghìm trong khoảng TNT theo dải (bảng §3.4 ± 1). Muốn tăng độ khó thì thêm cấu trúc, không bớt dư dưới 0.
4. Màn dạy: expert ≤ given − 2 (thử sai không bị phạt).

### 6.4 Cổng duyệt (phải xanh hết mới gửi Owner)

| Cổng | Ngưỡng |
|---|---|
| Bot | bảng §3.1 theo hạng; 4 seed; expert biên ≥3 điểm trên PASS và ≥2 điểm dưới giới hạn toà xanh/đường |
| Không dùng bài học thì thua | bot "bỏ bài": không gộp (L thép), chỉ mặt trước (L xoay), 1 đợt (L đợt), sai thứ tự (L thứ tự)… phải thua 4/4 |
| Chỉ nổ chân | theo hạng (N ≤10%, H/B 0/16) |
| Hiệu năng | ≤400 bodies (N nhắm ≤360); bước vật lý trung bình ≤7 ms, p95 ≤10 ms (headless); đứng yên 3 s: 0 liên kết gãy |
| Tất định | cùng kế hoạch, cùng seed = cùng pose hash |
| Đa dạng | không 2 màn liền nhau cùng kiểu màn hoặc cùng loại toà; mã công thức (kiểu × bài × toà × toà xanh × mục tiêu) khác 5 màn trước; màu tấm xoay theo bảng màu khu; mỗi dải có cả trường và bệnh viện |
| Chữ | mẹo ≤6 chữ, cùng từ cùng nghĩa ở mọi màn; ghi "Wave 1/2" khi thứ tự đợt quan trọng |
| Pháp lý | toà chính có mã F trong §5.4; mọi toà F có cờ `adsBlocked` (không vào store/quảng cáo); tên tự đặt; không chữ, logo, cờ, tượng, dấu tôn giáo/tưởng niệm; twist đúng 1 thay đổi (trừ 6 toà F1b) |
| **Kích thước (scale check)** | chụp góc mở màn 390×844: toà chính chiếm 60–75% chiều cao vùng chơi (đo bbox chiếu lên màn, không tính HUD); cả lô nằm trong khung; toà phụ 40–70% chiều cao toà chính; cột nhỏ nhất ≥12 pt trên màn (vùng chạm vẫn ≥44 pt). Ghi `screenFillPct`, `secondaryRatio` vào `curve-r6.csv` |
| Thời gian | ước tính trong dải của hạng (§3.1) |

### 6.5 Cần người xem (trang `level-review`, Owner duyệt)

Mọi màn dạy · mọi H/SH/B · lần đầu mỗi toà F trong game · 6 toà F1b (Owner thử) · màn cần >2 vòng chỉnh bot · 1/5 màn N chọn ngẫu nhiên · bảng concept Figma F/S (§5.5) trước khi dựng toà.

### 6.6 Việc engine cần (cho Lead)

Lô đích và ray: dựng bằng luật đường hiện có (không thêm chỉ số). Thùng nhiên liệu: có (`fuel_cookoff`). Bồn mái: có (`rtank`). Tấm đúc sẵn, đá: dùng họ vật liệu có sẵn, chỉ đổi vẻ.
Tường chắn BTCT không vỡ: **mới**, chờ Owner (Q3). **Module lớn** (tầng đôi `fh` 6.0, bay 4–4,5 m với `colk`/`st` to, tấm gộp): đo nứt khi đứng yên trước khi dựng L13+ (Q4). Đo `screenFillPct` từ ảnh góc mở màn: thêm vào `time-bot.js` hoặc công cụ chụp `level-review`. Bảng màu 4 khu mới: việc `design`.

---

## 7. Câu hỏi cho Owner

| # | Câu hỏi | Khuyến nghị |
|---|---|---|
| Q1 | Thưởng xu theo hạng 20 / 50 / 100 (N·R·T / H / SH·B), thua 0? | **Có** (giống Smash Fest, giá booster giữ ≈1,5 màn thu nhập) |
| Q2 | 7 khu (10/10/10/20/20/20/10 màn), cần 4 bảng màu mới? | **Có**; trong lúc chờ bảng màu thì xoay 3 bảng cũ |
| Q3 | Tường chắn BTCT không vỡ (L72) là cơ chế mới (nhóm B) | **Có**, với điều kiện nhìn là biết (tối, dày, có vạch) và không hấp lực ngầm; nếu không thì L72 dạy "lõi xoắn" |
| Q4 | ~~Bỏ dáng đã đăng ký?~~ **Owner đã quyết 11/11: GIỮ**, chỉ trong game (§5.1). Câu mới: cho phép đo module lớn (tầng đôi `fh` 6, bay 4–4,5 m cột to) để đạt kích thước §5.2, và nếu nứt khi đứng yên thì nâng trần bodies lên ~480 cho boss/mega6? | **Có**: đo module lớn trước; chỉ nâng trần cho boss/mega6 nếu khung hình đạt p95 ≤10 ms |
| Q5 | Generator dựng L13–100 mới, **thay** stub L13–36 cũ (không chỉnh lại)? | **Thay** (stub không hợp thang vật liệu, 11/24 qua) |
| Q6 | L100 hết sau ≈4 ngày chơi; làm luôn L101–200 trước khi tăng chi UA? | **Có**, cùng công thức; dải 11+ lặp khuôn §2.1 với biến thể khó hơn, không lặp im lặng |
