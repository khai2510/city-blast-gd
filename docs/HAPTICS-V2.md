# City Blast!: kịch bản rung (haptics) v2, iPhone trước

Viết 11/11/2026 theo yêu cầu của Owner: "lên kịch bản rung, haptic cho con game này". **Chỉ là tài liệu:** chưa sửa code game, chưa sửa AHAP, chưa ai cảm nhận trên máy thật.
Thay cho phần thiết kế sự kiện của `HAPTICS-MAP.md` (v1, 07/11). Nghiên cứu và nguồn vẫn ở `games/playbook/HAPTICS.md`; facade, AHAP và plugin phác thảo vẫn ở `games/blast-haptics/`.
Đã đối chiếu với bản game mới nhất: `checkpoints/index-v16b-ui-h2h.html` (v31 + uiclean + boosters2 + metrics), `index-v16-voice.html`, cùng `materials-fx/PORT.md`, `boosters2/PORT.md` và `uiclean/COMPARE-AFTER.md`. `sfx/SOUND-BRIEF.md` chưa có, nên cột "âm" bên dưới ghi theo âm thanh đang có trong game.

**Thay đổi so với v1.** Game giờ chỉ còn TNT, nên bỏ hẳn Cutter, Cluster, chip chọn bom, sao, combo, `win_3star` và tick xu trong lúc sập. Thêm mới: đặt chồng, tự đếm khi đặt quả cuối, nhiều đợt nổ, mốc PASS 85 %, kết cấu riêng cho từng vật liệu, cảnh báo toà xanh (5 %) và cảnh báo ra đường (10 %), Wrecking Ball, Sky Strike, Safety Net, xu bay vào ô xu, popup thua, cứu +1 TNT và thẻ mở booster.

---

## 0. Bản iOS hôm nay rung thế nào (đọc từ code, chưa đo trên máy)

`native/src/native-bridge.js` chuyển `navigator.vibrate(pattern)` của bộ âm thanh sang `@capacitor/haptics`. Mỗi nhịp "on" của pattern thành 1 cú impact, chọn mức theo độ dài: ≤12 ms ra LIGHT, ≤30 ms ra MEDIUM, dài hơn ra HEAVY. Cầu nối giữ khoảng cách ≥40 ms giữa 2 cú và tối đa 10 cú/giây; **cú đến trước được giữ, cú đến sau bị bỏ, bất kể ưu tiên**.

| # | Vấn đề | Chỗ trong code | Hệ quả |
|---|---|---|---|
| H1 | Rung gắn liền với tắt tiếng | `vibrate()` của SFX: `if (E.offline \|\| !pat \|\| muted) return` | Tắt âm thì mất luôn rung. Settings chưa có mục "Rung" |
| H2 | Không có ưu tiên | native-bridge `fire()` | Một cú `pancake` [30 ms] đến trước 40 ms là cướp mất cú nổ hay TIMBER |
| H3 | Thua rung quá mạnh | `fail` hap [60,80,120] | Ra HEAVY rồi HEAVY sau 140 ms: cảm giác bị phạt, trái nguyên tắc "thua nhẹ nhàng" |
| H4 | Mẫu cảnh báo bị dùng sai nghĩa | băng rôn Hard gọi `snd("protected_hit",{gain:.5})` | Đầu màn Hard rung 3 cú MEDIUM y như lúc phạm toà xanh |
| H5 | Rung 2 lần trùng nhau | `b2Card()`: `SFX.haptic("upgrade")` và `snd("unlock")` | 2 pattern chồng lên nhau, cầu nối cắt ngẫu nhiên |
| H6 | Booster mượn rung của Cutter (đã bỏ) | `ballPower`, `skyImpact`: `SFX.haptic("boom_cutter")`, cùng lúc với `boom_tnt` | HAP [25,10,40]: cú thứ 2 cách cú đầu 35 ms nên bị bỏ; cú đập booster không có dấu ấn riêng |
| H7 | Lệnh rung không làm gì | `SFX.haptic("booster_arm")`: tên này không có trong `ROUTE` | Chạm nút booster không rung |
| H8 | Không phân biệt vật liệu | `@capacitor/haptics` chỉ có 3 mức, không có độ sắc | Kính, gạch, thép rung giống nhau; không có rung kéo dài (rumble) |

---

## 1. Nguyên tắc

1. **Rung theo tiếng.** Cú rung trùng điểm "hit" của âm thanh, lệch tối đa ±20 ms và không bao giờ đến sau âm quá 10 ms. Khi dùng AirPods (âm trễ 100–200 ms) thì bám theo hình (flash), không bám theo âm.
2. **Ngân sách.** Tối đa 10 cú/giây, mỗi cú cách nhau ít nhất 40 ms. Ưu tiên chia 1–5 (1 = quan trọng nhất). Hai cú gần nhau hơn 40 ms thì giữ cú ưu tiên cao hơn. Sau mỗi "chữ ký" có một cửa sổ tập trung 300–500 ms, trong đó mọi cú ưu tiên ≥3 bị bỏ.
3. **Mỗi lần nổ chỉ có 1 chữ ký.** Mỗi lần BLAST, mỗi cú Ball, mỗi cú Sky chỉ có đúng 1 rung đầy đủ kèm rumble. Các quả sau trong cùng đợt chỉ là bản "follow", nhẹ dần. Cảm giác đi theo đường: yên khi đặt bom, hồi hộp khi đếm, chữ ký, kết cấu vụn, phần thưởng.
4. **Thất bại thì nhẹ nhàng.** Không bao giờ dùng `notification(.error)`. Mẫu `warning` chỉ mang **một nghĩa duy nhất**: toà xanh (trường học, bệnh viện) đang bị hại. Thua chỉ là 1–2 chạm nhẹ, độ sắc thấp.
5. **Một mẫu, một nghĩa.** Đặt, chồng, PASS, thắng, mở khoá và nâng cấp mỗi thứ có mẫu riêng. Độ sắc (sharpness) đi theo vật liệu: kính và thép sắc, gỗ giòn, gạch và bê tông tròn, đục.
6. **Tôn trọng người chơi.** Có công tắc **Rung** riêng trong Settings, độc lập với Âm thanh. Tôn trọng cài đặt System Haptics của iOS và Reduce motion (Reduce motion thì rút ngắn rumble). Không rung khi xoay camera, kéo map hay tự về Home. Tắt rung thì game vẫn phải trọn vẹn.

---

## 2. Bảng sự kiện v2

**Ký hiệu**
- **(a) Capacitor**: dùng được ngay với `@capacitor/haptics` đang có. `L`/`M`/`H` = impact LIGHT/MEDIUM/HEAVY. `Sel` = `selectionChanged`. `N✓` = `notification SUCCESS`. `N!` = `notification WARNING`. `@ms` = độ lệch so với t0, mọi bước cách nhau ≥40 ms. Plugin này không có soft/rigid và không chỉnh được cường độ: soft hạ thành L, rigid thành M.
- **(b) Core Haptics** (làm sau, plugin Swift): `T(t,I,S)` = cú chạm ngắn (transient) tại t giây, cường độ I, độ sắc S. `C(t,I,S,d)` = rung kéo dài (continuous) d giây. `↘` = đường cong cường độ giảm dần. **AHAP v1** = file có sẵn trong `games/blast-haptics/ahap/`, vẫn dùng được. **AHAP mới** = file cần viết thêm.
- **Âm ↔ rung**: thời điểm tiếng hit so với hình, và rung đặt ở đâu.
- **Giới hạn**: `cd` = khoảng nghỉ tối thiểu giữa 2 lần cùng sự kiện, `cap` = tối đa mỗi giây. **Ưu tiên**: 1 cao nhất.

### 2.1 Home, map, UI

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `ui_tap` | Chạm mọi nút (menu, node map, GOT IT, Try again…) | 0 / 0 | L@0 | T(0,.35,.70) | cd 50 | 5 |
| `play_tap` | Nút "Level n" trên Home | 0 / 0 | M@0 | T(0,.55,.60) | cd 300 | 4 |
| `toggle` | Bật/tắt trong Settings hoặc Pause. Khi bật Rung: phát 1 cú mẫu | 0 / 0 | Sel@0 (bật Rung: M@0) | T(0,.40,.90) | cd 100 | 5 |
| `invalid` | Chạm chỗ trống (lời nhắc "Tap a building"); Ball báo "Can't reach / Blocked" | Không có âm riêng | L@0 | T(0,.40,.20) + T(.09,.28,.20) | cd 300 | 3 |
| `hard_intro` | Băng rôn Hard/boss khi vào màn (thay cho rung cảnh báo, H4) | 0 / 0 | M@0 · L@180 | T(0,.55,.30) + T(.18,.35,.30) | 1 lần/màn | 3 |
| Lúc toà rơi xuống đầu màn, kéo map, xoay/zoom camera | — | — | không rung | không rung | — | — |

### 2.2 Đặt bom (pha plan)

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `place_tnt` | Đặt 1 TNT vào chỗ mới | 0 / 0 | M@0 · L@70 | AHAP v1 `place_charge` ("ngồi" xuống, rồi "cạch") | cd 80 | 2 |
| `place_stack` **MỚI** | Quả thứ 2 đặt trong vòng 1,5 m quanh 1 quả chưa nổ (cùng phép thử chồng của levels6 `detonateAll`) | 0 / 0 (brief âm: thêm tiếng "clunk" nặng) | H@0 · M@60 | AHAP mới `place_stack`: T(0,.90,.35) + C(0,.50,.12,.08)↘ + 2 cú khoá T(.06,.55,.85), T(.11,.45,.95) | cd 80 | 2 |
| `place_stack3` | Quả thứ 3 trên cùng chỗ (dải thép cần 3 quả) | 0 / 0 | H@0 · M@60 · M@120 | `place_stack` + T(.16,.40,1.0) | cd 80 | 2 |
| `remove` | Gỡ 1 TNT, hoặc chạm 1 quả để dừng fuse tự động | 0 / 0 | L@0 | T(0,.35,.30) (đục hơn mọi kiểu đặt) | cd 80 | 3 |
| `protected_tap` | Chạm vào toà xanh (bị từ chối); Sky hoặc Ball nhắm vào toà xanh | `protected_hit` 0 / 0 | L@0 · L@120 | T(0,.45,.15) + T(.12,.35,.15) | cd 600 | 2 |
| `protected_near` | Đặt TNT mà vùng nổ chạm toà xanh (`pulseShields` trả về true) | +140 sau cú đặt | thêm L@140 sau cú đặt | thêm T(.14,.40,.15) vào `place_charge` | cd 600 | 2 |
| `booster_arm` | Chạm nút Ball, Net hoặc Sky (sửa H7) | `ui_tap` 0 | Sel@0 | T(0,.45,.85) | cd 100 | 4 |
| `wave_ready` | Một đợt xong, còn TNT, quay lại đặt bom | `dust_tail` | L@0 | T(0,.35,.40) | 1 lần/đợt | 3 |

### 2.3 Đếm ngược và nổ

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `blast_press` | Bấm BLAST bằng tay: 3 tiếng bíp ở 0/150/300 ms, nổ ở 500 ms | khớp 3 tiếng bíp | H@0 · M@150 · H@300, sau đó **im 200 ms** ("hít vào") | AHAP v1 `blast_countdown` (gộp luôn 3 cú countdown) | cd 400 | 1 |
| `auto_fuse` **MỚI** | Đặt quả cuối thì game tự đếm `L6.fuse` = 1,0 s: bíp 200/450/700 ms, nổ 1000 ms | khớp bíp (tiếng horn ở 0 không rung, vì `place_tnt` đã rung ở 0) | L@200 · L@450 · M@700, im 300 ms | AHAP mới `auto_fuse`: fuse C(0,.20,.30,.95) (attack .6, độ sắc tăng dần) + T(.20,.40,.70), T(.45,.50,.80), T(.70,.80,.95); kéo giãn theo `L6.fuse` | 1 lần | 2 |
| `boom_first` | Quả đầu tiên của mỗi đợt: **chữ ký** | Âm +25 ms (khoảng hít của SFX), rung cũng +25 | H@0 · H@60 · M@450 · L@700 | AHAP v1 `tnt_detonation` (nổ giòn, thân nặng, hẫng 60 ms, rumble dâng). Đợt 1 ×1, các đợt sau ×0,85 | focus 350 | 1 |
| `boom_stack` | Nhóm chồng nổ (`c.stack`). Nếu là quả đầu đợt thì thay `boom_first` | +25 / +5 | đầu đợt: H@0 · H@50 · H@110 · M@450 · L@700. Không phải đầu đợt: H@0 · M@50 | `tnt_detonation` ×1,25 (kẹp ở 1) + cú "đấm" T(.05,1.0,.25), rumble dài ×1,2. Không phải đầu đợt: follow ×1,0 | focus 400 | 1 |
| `boom_follow` | Quả thứ 2 trở đi trong đợt (cách nhau 200 ms). Quả còn lại của nhóm chồng cũng dùng mẫu này | +5 | quả 2–3: M@0. Quả 4+: L@0 | follow v1: T(0,.85,.60) + C(0,.80,.22,.22)↘, mỗi quả ×0,9 so với quả trước | ≥150 ms | 1 |
| `fuel_cookoff` | Bồn nhiên liệu nổ theo (chỉ khi màn có bồn) | 0 / 0 | L@0 | v1 (tiếng "phừng", không có cú giòn) | cap 4/s | 3 |

### 2.4 Sập và kết cấu vật liệu

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `groan` | Khung bắt đầu oằn (`metal_groan`) | 0 / 0 | L@0 · L@220 | v1 `groan` (rung trầm + cọ trượt) | cd 3 s | 3 |
| `timber` | Slow-mo bắt đầu (mọi lần TIMBER trong màn). Giọng thu "TIMBER!" vào sau 10 ms (không rung riêng cho giọng) | 0 / 0 | **H@0 · H@80 · H@160** = 3 cú `impact HEAVY` native ("da-da-dam", Owner 15/11/2026), không giãn theo slow-mo. Cú 2 và 3 tính từ cú trước đã rung thật (giữ đúng thứ tự, cách ≥ 80 ms khi khung hình bị trễ) | AHAP v1 `timber_rumble` (chưa làm, bước (b)) | **Solo:** từ cú đầu đến 150 ms sau cú cuối, mọi rung khác (mảnh vụn, sập, chạm UI, combo, xu, kể cả ưu tiên 1) đều bị bỏ, cú đã hẹn trong khoảng đó bị huỷ; cửa sổ giữ mở nếu cú cuối bị trễ. Gộp: nhiều toà TIMBER trong 400 ms = 1 lần (`cdKey` chung với `timber_short`, giờ là bí danh). Tắt Vibration = không rung. Reduce motion giữ nguyên 3 cú (cú ngắn). Kiểm: `ONLY=hap` H1–H6 | 1, solo 150 |
| `timber_catch` | Hết slow-mo, thời gian về 1× | 0 / 0 | M@0 | T(0,.70,.50) | cd 2 s | 2 |
| `pancake` | Một tầng bị đè sập (`audPancake`) | 0 / 0 | M@0 (tầng 0–1: H@0) | v1 (tầng thấp nặng hơn, đục hơn) | cd 100, cap 5/s, ≤8 lần/đợt | 3 |
| `mat_wood` | Gỗ gãy (`beam_snap`, tiếng gõ gỗ) | 0 / 0 | L@0 · L@45 | "lách tách": T(0,.35,.75) + T(.045,.25,.85) + T(.08,.18,.90) | cd 200 | 4 |
| `mat_brick` | Gạch hoặc đá vỡ, vỡ vụn khi rơi xuống (`concrete_crack` + `gravel`) | 0 / 0 | L@0 | "vụn": T(0,.40,.40) + C(.01,.22,.35,.12)↘ | cd 250 | 4 |
| `mat_concrete` | Dầm hoặc sàn bê tông, BTCT rơi (`debris` thud, khối nặng) | 0 / 0 | M@0 | "thịch": T(0,.60,.20) + C(0,.35,.10,.10)↘ | cd 200 | 4 |
| `mat_steel` | Thép kêu (`steel_clang`), bị cong hoặc văng | 0 / 0 | M@0 · L@60 | "keng": T(0,.55,.95) + C(.005,.25,.85,.18)↘ (ngân) | cd 300 | 4 |
| `mat_glass` | Kính vỡ (`glass_shatter`) | 0 / 0 | L@0 | "lăn tăn": T(0,.30,1.0) + T(.04,.20,1.0) + T(.09,.14,1.0) | cd 250 | 4 |
| `coin_burst` | Mảnh rơi bật ra xu | 0 / 0 | không rung | T(0,.25,.85), chỉ khi ngoài cửa sổ tập trung | cd 500 | 5 |
| `combo` | Đã bỏ (chữ COMBO bị uiclean xoá; âm vẫn giữ) | — | — | — | — | — |

Các `mat_*` chia chung trần **4 cú/giây**. Với Capacitor, kính, gạch và gỗ đều ra L nên gần như không phân biệt được; khác biệt vật liệu chỉ thực sự có khi lên Core Haptics (H8).

### 2.5 Luật màn: PASS, toà xanh, đường phố

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `pass_cross` **MỚI** | Thanh % vượt mốc 85 % trong lúc sập (`setMeter`, lần đầu `clearedShown`) | `snd("star",{index:2})` + flash, cùng 0 ms; slow-mo `passSlow` 0,5 s | M@0, sau đó **im 500 ms** | AHAP mới `pass_cross`: T(0,.85,1.0) + C(.005,.30,.70,.15)↘. Đây là cú sắc nhất game. Kèm "hush" 500 ms: bỏ mọi cú ưu tiên ≥3 | 1 lần/màn | 1 |
| `protected_warn` | Toà xanh bị hại vượt 2,5 % (một nửa ngưỡng 5 %), pill chuyển đỏ (`liveBad`) | `protected_hit` (nếu brief âm thêm) | N!@0 | v1 `protected_hit`: T(0,.65,.15) · T(.12,.65,.15) · T(.24,.45,.15) | 1 lần/đợt, chờ hết cửa sổ tập trung | 2 |
| Mái trường bị trúng (chuông) | Mảnh trúng phần mái chuông | (tuỳ chọn: tiếng "boong" đục) | không có mẫu riêng: tính vào `protected_warn` | như trên | — | — |
| `street_warn` | Rác ra đường vượt 6 % (60 % của ngưỡng 10 %) | — | M@0 · L@100 | T(0,.50,.20) + T(.10,.35,.20) (2 chạm, không phải 3 như toà xanh) | 1 lần/đợt | 3 |
| Thanh "gần tới PASS" | Thanh % đổi màu `near` | — | không rung | không rung | — | — |

### 2.6 Booster

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `ball_swing` | Thả quả tạ (tiếng vút 0,7 s) | 0 / 0 | L@0 | C(0,.15,.30,.60), cường độ ↗ .2 lên 1 trong .6 s, độ sắc ↗ (gió rít dần) | 1 lần/cú | 2 |
| `ball_impact` | Tạ đập vào toà (hit-stop 120 ms). Thay cho `boom_cutter` (H6) | 0 / 0 | H@0 · H@50 · M@130 · L@400. Nếu đập thép trước: H@0 · M@60 | AHAP mới `ball_impact`: T(0,1.0,.45) + C(0,.90,.15,.12) giữ suốt hit-stop + T(.13,.65,.50) + C(.25,.40,.10,.60)↘. Bản thép: T(0,.90,.95) + C(0,.35,.90,.25)↘ | focus 400 | 1 |
| `sky_marker` | 0,75 s vòng ngắm đỏ + tiếng rít, sau đó bom rơi | khớp tiếng rít | L@0 · L@120 · L@400 · L@500, rồi **im từ 500 đến 750 ms** | AHAP mới `sky_marker`: "nhịp tim" T(0,.30,.20) T(.12,.22,.20) T(.40,.38,.25) T(.50,.30,.25) | 1 lần/cú | 2 |
| `sky_impact` | Bom chạm mái (hit-stop 130 ms). Thay cho `boom_cutter` | `boom_tnt` 0 / 0 | H@0 · H@45 · M@140 · M@260 · L@500 | AHAP mới `sky_impact`: T(0,1.0,.70) + C(0,1.0,.20,.13) + "đấm xuyên tầng" T(.14,.70,.35) T(.26,.55,.35) T(.38,.45,.35) + C(.45,.40,.10,.80)↘ | focus 450 | 1 |
| `net_deploy` | Lưới bật lên khi bấm BLAST | `place_cutter` | không rung riêng (gộp vào `blast_press`) | T(0,.30,.60) | — | 4 |
| `net_catch` **MỚI** | Mảnh đầu tiên chạm lưới trong đợt (cần hook mới, §4) | (brief âm: tiếng "bịch" lưới) | L@0 | "nảy": C(0,.45,.15,.18), cường độ 0 lên 1 trong 60 ms rồi về 0, + T(.16,.25,.60) | cd 500, ≤3 lần/đợt | 3 |

### 2.7 Kết quả và meta

| Sự kiện (id) | Kích hoạt | Âm ↔ rung | (a) Capacitor | (b) Core Haptics | Giới hạn | Ưu tiên |
|---|---|---|---|---|---|---|
| `win` | `showResult` khi thắng (không còn thẻ thắng) | `snd("win")` 0 / 0 | N✓@0 | T(0,.45,.50) + T(.09,.65,.60) | 1 | 1 |
| `coin_fly` | Xu bay vào ô xu: bắt đầu sau 550 ms, 4–12 xu cách nhau 45 ms, mỗi xu bay 600 ms, nên tới nơi trong khoảng 1,15–1,65 s | tiếng `coin` mỗi 2 xu | Sel ở xu thứ 1, 3, 5… (cách nhau ≥90 ms), xu cuối M (ô xu nảy) | AHAP v1 `coin_shower` (7 tick nhanh dần + "ting"), t0 = lúc xu đầu tới nơi | ≤8 tick | 3 |
| Tự về Home sau 2 s | — | — | không rung (người chơi không bấm gì) | — | — | — |
| `lose` | Popup thua vì thiếu % (một popup duy nhất) | `snd("fail")` 0 / 0 | L@0 | "xì hơi": C(0,.35,.05,.30)↘ (v1). Không có cú chạm ngắn | 1 | 1 |
| `lose_rule` | Thua vì toà xanh hoặc đường phố | `fail` 0 / 0 | L@0 · L@140 | T(0,.50,.20) + T(.14,.35,.15) | 1 | 1 |
| `rescue` | Bấm "+1 TNT ◎150" trong popup thua | `snd("upgrade")` 0 / 0 | M@0 · L@80 ("nạp đạn") | T(0,.55,.60) + T(.08,.40,.85) | 1 | 2 |
| `unlock_card` | Thẻ NEW! booster (`#bNew`) hiện ra 1,1 s sau khi thắng boss. Bỏ lệnh rung bị trùng (H5) | `snd("unlock")` | L@0 · M@120 · H@240 | v1 `unlock` (3 bậc đi lên) | 1 | 2 |
| `upgrade` | Mua nâng cấp | `snd("upgrade")` | M@0 · L@80 | v1 `upgrade` | cd 300 | 2 |
| `tutorial_ok` | Bàn tay hướng dẫn ở L1–2, mỗi bước xong (tuỳ chọn) | — | L@0 · L@70 | v1 | cd 500 | 3 |

**Thắng boss:** thẻ mở khoá (ưu tiên 2) hiện ra đúng lúc xu đang bay. Khi đó chỉ chơi `unlock_card` và cú M của xu cuối, bỏ các tick ở giữa.

**Bỏ hẳn khỏi v1:** `place_cutter`, `place_cluster`, `boom_cutter`, `boom_cluster`, `select_charge`, `star`, `combo`, `coin` (trong lúc sập), `steel_shear` (chỉ Cutter tạo ra), `horn` (nay nằm trong `auto_fuse`) và file `win_3star.ahap`.

---

## 3. Kịch bản một màn

### 3.1 L5 thắng: 6 TNT, có 1 chỗ chồng, 2 đợt (bản Capacitor (a); thời gian tính bằng giây từ cú chạm đầu)

| t (s) | Chuyện xảy ra | Cú rung (a) | Cảm giác |
|---|---|---|---|
| 0.00 | Đặt TNT #1 | M 0.000 · L 0.070 | **Yên, lên kế hoạch.** Mỗi lần chạm chỉ 1 "cạch" |
| 1.40 | Đặt TNT #2 | M 1.400 · L 1.470 | |
| 2.60 | Đặt #3 chồng lên #2 (`place_stack`) | **H 2.600 · M 2.660** | Nặng hơn hẳn: "khoá đôi" |
| 4.00 | Đặt #4, vùng nổ chạm toà xanh | M 4.000 · L 4.070 · L 4.140 | Chạm đục báo "cẩn thận" (không phải cảnh báo hệ thống) |
| 5.50 | Bấm BLAST | H 5.500 · M 5.650 · H 5.800 | **Hồi hộp:** 3 nhịp |
| 5.80–6.03 | Im lặng | — | "Nín thở" |
| 6.025 | #1 nổ: **chữ ký** | **H 6.025 · H 6.085** (rumble M 6.475 · L 6.725) | Cú lớn nhất trong đợt |
| 6.225 | #2 nổ (nhóm chồng, không phải đầu đợt) | H 6.225 · M 6.275 | Vẫn nặng |
| 6.35 | Khung oằn (`groan`) | bị bỏ (trong cửa sổ tập trung) | |
| 6.425 | #3 nổ (follow) | M 6.425 | Nhẹ dần |
| 6.625 | #4 nổ (follow, quả 4+) | L 6.625 | |
| 6.90 | TIMBER + giọng thu (slow-mo 1,05 s) | **H 6.900 · H 6.980 · H 7.060** (solo đến 7.210) | Chữ ký thứ hai: 3 cú nặng dồn dập, đứng một mình |
| 7.10 | `pancake` | bị bỏ (cửa sổ solo của TIMBER) | |
| 7.35–8.70 | `pancake`, gạch vụn, `timber_catch`, kính, bê tông | M 7.350 · M 7.550 · L 7.750 · M 7.950 (`timber_catch`; cú kính 7.97 bị bỏ vì cách < 40 ms) · M 8.150 · M 8.400 · L 8.700 | **Kết cấu:** thưa dần, đa dạng |
| 10.20 | Đợt 1 xong ở 72 %, quay lại đặt bom | L 10.200 | |
| 12.00 / 13.20 | Đặt #5, rồi #6 là quả cuối nên game tự đếm | M 12.000 · L 12.070 · M 13.200 · L 13.270 | |
| 13.40–13.90 | Fuse tự động | L 13.400 · L 13.650 · M 13.900 | Hồi hộp (ngắn hơn) |
| 14.225 | Đợt 2, #5 nổ (chữ ký ×0,85) | H 14.225 · H 14.285 (rumble M 14.675; L 14.925 bị bỏ, xem 14.90) | |
| 14.425 | #6 nổ (follow) | M 14.425 | |
| 14.90 | **Thanh vượt 85 %** | **M 14.900**, rồi hush 500 ms | Một cú "tách" sắc, rồi lặng |
| 15.50–16.50 | Kết cấu cuối | M 15.500 · M 15.800 · M 16.100 · L 16.160 (thép) · L 16.500 | |
| 17.20 | Đổ xong, thắng | **N✓ 17.200** | **Phần thưởng** |
| 18.35–18.67 | 8 xu bay vào ô xu | Sel 18.350 · 18.440 · 18.530 · 18.620 · **M 18.665** | "tích tích tích… ting" |
| 19.20 | Tự về Home | — | Lặng |

**Kiểm ngân sách:** cửa sổ 1 s dày nhất là 5,50–6,50 s với 9 cú (5.5, 5.65, 5.8, 6.025, 6.085, 6.225, 6.275, 6.425, 6.475). Cửa sổ 5,95–6,95 và 6,0–7,0 cũng 9 cú, 6,9–7,9 có 8 cú, nên luôn ≤10. Hai cú liền nhau luôn cách ≥45 ms. Cả màn khoảng 56 cú trong 19 s. Có 3 chữ ký (2 lần BLAST, 1 TIMBER) và 1 "tách" PASS; rung nặng chỉ xuất hiện ở các lần nổ.
**Với Core Haptics (b),** cùng các mốc đó nhưng gọi AHAP. Mỗi lời gọi tính là 1 cú trong ngân sách, kể cả khi bên trong có nhiều cú chạm nhỏ. Tổng thời gian có rung khoảng 4 s/màn (TIMBER 1,05 s, 2 lần rumble nổ 1,1 s mỗi lần, còn lại là các cú ngắn).

### 3.2 L7 thua (thiếu 6 %)

| t | Chuyện xảy ra | (a) | Ghi chú |
|---|---|---|---|
| … | Đặt 7 TNT, đếm, nổ, sập | như 3.1 | |
| 0.00 | Đổ xong ở 79 %, hết TNT, popup thua | **L 0.000** | Chỉ một chạm nhẹ. Không N✗, không H |
| 1.8 | Bấm "+1 TNT ◎150" | M 1.800 · L 1.880 | Cảm giác "nạp đạn"; ô TNT nảy |
| 3.0 | Đặt quả TNT cứu (cũng là quả cuối, game tự đếm) | M · L, rồi `auto_fuse` | Quay về vòng như 3.1 |
| biến thể | Toà xanh bị hại vượt 2,5 % giữa lúc sập | N! (sau cửa sổ tập trung, 1 lần) | Lần duy nhất trong game có rung "warning" |
| biến thể | Cuối cùng toà xanh 6,1 % (>5 %): `lose_rule` | L 0.000 · L 0.140 | Hai chạm đục |

### 3.3 Dùng Sky Strike (L31)

| t (s) | Chuyện xảy ra | (a) | Cảm giác |
|---|---|---|---|
| 0.00 | Chạm nút Sky | Sel 0.000 | Đã chọn |
| 1.20 | Chạm mái toà: vòng ngắm + tiếng rít | L 1.200 · L 1.320 · L 1.600 · L 1.700 | Nhịp tim nhẹ, nhanh dần |
| 1.70–1.95 | Bom rơi nốt quãng cuối | — | Lặng: hồi hộp |
| 1.95 | **Chạm mái** (hit-stop 130 ms) | **H 1.950 · H 1.995** · M 2.090 · M 2.210 · L 2.450 | Đập từ trên xuống, xuyên 2–3 tầng |
| 2.40+ | Kết cấu (cửa sổ tập trung 450 ms đã qua) | M 2.520 … tối đa 4 cú `mat_*`/s | |
| ~5 | Toà đứng yên, tính luật | PASS: `win`. Chưa đạt: quay lại đặt bom, không rung thêm | |

Cửa sổ dày nhất (1,20–2,20 s) có 7 cú, cách nhau ≥45 ms.

---

## 4. Kế hoạch làm (chưa làm)

### 4.1 Hook trong code (tên trong `index-v16b-ui-h2h.html` và các patch). Mọi thay đổi làm bằng patch có neo (anchor) như `boosters2/patch.js`, không sửa tay `index.html`

| Sự kiện | Hook | Hôm nay đang gọi gì |
|---|---|---|
| `ui_tap`, `play_tap`, `toggle` | 38 chỗ `snd("ui_tap")`; nút Level ở Home; `sfxTog`/`musTog`/`rmTog` cùng mục Rung mới | SFX `hap` [5–6] |
| `place_tnt` / `place_stack` / `place_stack3` | `placeCharge()` ngay sau `charges.push(c)`: đếm số quả chưa nổ trong 1,5 m | `snd("place_tnt")` |
| `remove` | `removeCharge()`, `cancelAuto()` | `snd("remove")` |
| `protected_tap` | 3 chỗ `if(…keep){ toast(…); snd("protected_hit")` (chạm, `skyStrike`, Ball) | HAP [20,40,…] tức 3 cú M |
| `invalid` | Lời nhắc chạm chỗ trống; các nhánh `"tooclose"/"hidden"/"blocked"` của Ball (hôm nay đang dùng nhầm `protected_hit`) | — |
| `protected_near` | `placeCharge()`, khi `pulseShields(pos,R)` trả về true | — |
| `protected_warn` / `street_warn` | `updateLiveHUD()`: lúc `liveBad` đổi từ false sang true, tách theo `cl > km*0.5` hoặc `sh > L.street.max*0.6`; mỗi đợt 1 lần | — |
| `hard_intro` | Đầu màn: `hardBan` (bỏ `snd("protected_hit",{gain:.5})` hoặc chặn rung của nó) | 3 cú M (H4) |
| `blast_press`, `auto_fuse` | `startCountdown(false)` / `startCountdown(true)`; `fireNow()` | `blast_press` [25], `countdown` [10] |
| `boom_first` / `boom_follow` / `boom_stack` | `audBoom()` (`first = boomIdx === 0`) + cờ `c.stack` trong `fireCharge` (levels6) | `boom_tnt` [40,20,60] |
| `groan`, `timber`, `timber_catch` | Vòng step: `groanDone`; `slowUsed = true … timberT = gameT`; lúc `slowLeft <= 0` | `timber` [30,30,80] |
| `pancake` | `audPancake()` | [30] cho mỗi tầng |
| `mat_*` | `matSnd()` / `audImpact()` theo `matOf(key)`, cùng các lệnh âm vỡ trong `materials-fx/patch/matfx.js` (glass, crack+gravel, crumble, debris thud, beam_snap/crate, steel_clang) | [6]–[18] |
| `pass_cross` | `setMeter()`, khối `if(on && meterOn === false … !clearedShown)` | `star` [20] |
| `wave_ready` | `waveEnd()` sau `wave++` | — |
| `booster_arm` | `bstTapBtn()`, `skyBtn()` (hiện gọi `SFX.haptic("booster_arm")` nhưng không có route) | không rung (H7) |
| `ball_swing`, `ball_impact` | `snd("ball_swing")` trong code Ball; bước 5 "feel" của `ballPower()` | `SFX.haptic("boom_cutter")` (H6) |
| `sky_marker`, `sky_impact` | `skyStrike()`; `skyImpact()` | `SFX.haptic("boom_cutter")` (H6) |
| `net_catch` | **Hook mới:** trong `netBuild()`/step, lần đầu mỗi đợt một mảnh chạm collider lưới (`netBodies`) | — |
| `win`, `lose`, `lose_rule` | `showResult()` (`r.ok`, `r.code`) | `win` [20,60,…]; `fail` [60,80,120] (H3) |
| `coin_fly` | `flyBonus()`, hàm `fin()` của từng xu | `coin` (không rung) |
| `rescue` | `rescue()` | `upgrade` |
| `unlock_card` | `b2Card()` (bỏ `SFX.haptic("upgrade")`, H5); bản cũ `r.unlock` hẹn giờ 1300 ms | 2 pattern chồng nhau |

### 4.2 Cầu nối iOS: hai bước

**Bước 1, làm ngay, chỉ JS (khoảng 1 ngày cho `app-dev`).** Đưa facade `games/blast-haptics/haptics.js` vào game. Bảng `EV` cập nhật theo v2 (các cột (a), ưu tiên, cd, cap, phase). Game gọi `Haptics.play(id)` ở các hook trên. Trong app native, facade thay `navigator.vibrate` bằng hàm rỗng, nên các `hap` của SFX không còn rung đôi. `native-bridge.js` chỉ còn là dự phòng nếu facade không tải được. Cách này dùng đúng `@capacitor/haptics` đang có (`impact`, `selectionChanged`, `notification`), giải quyết H1–H7, và cho ngay ưu tiên, cửa sổ tập trung, hush PASS. Test: mở rộng `native/tools/smoke-offline.js` (đang có Capacitor giả) để kiểm số cú/giây ≤10 và đúng thứ tự trong 1 màn bot.

**Bước 2, sau lần cảm nhận đầu trên máy: plugin Swift Core Haptics `BlastHapticsPlugin`.** Đã có bản phác khoảng 250 dòng trong `INTEGRATION.md` §2. Đăng ký trong `BlastViewController.capacitorDidLoad()`; class con này **đã có sẵn** trong `native/ios/App/App/`. AHAP để trong `www/haptics/`.

| | Chỉ `@capacitor/haptics` (bước 1) | Thêm plugin Core Haptics (bước 2) |
|---|---|---|
| Biểu đạt | 3 mức + selection + notification. Không có độ sắc, cường độ, rung kéo dài | Đủ: AHAP, cường độ theo từng lần gọi, giãn thời gian (TIMBER), đường cong |
| Vật liệu, rumble, nhịp tim Sky, PASS sắc | Gần như không phân biệt được | Có, đây là phần "cảm giác phá huỷ" cốt lõi |
| Độ trễ | Plugin tạo generator mới mỗi lần gọi, không `prepare()`, nên chậm hơn và không đều | Engine giữ sẵn, hẹn giờ theo đồng hồ engine, khớp âm ≤20 ms |
| Rủi ro | Không thêm code native | Swift phải bảo trì; xử lý `stoppedHandler`/`resetHandler` (gọi điện thoại, chạy nền); simulator không có rung nên chỉ test được trên máy |
| Công | khoảng 1 ngày | khoảng 1,5–2 ngày code (Swift, pbxproj, AHAP mới: `place_stack`, `auto_fuse`, `pass_cross`, `ball_impact`, `sky_marker`, `sky_impact`, `net_catch`) + 0,5–1 ngày chỉnh trên máy cùng Owner (màn "Haptics Lab", INTEGRATION §5) |
| Plugin bên thứ ba | — | Không nên: `@capawesome` trùng tên `Haptics`; `capacitor-rich-haptics` chưa đọc mã nguồn |

**Khuyến nghị:** bản TestFlight đầu tiên dùng **bước 1** (sửa ngay các lỗi H1–H7, rủi ro thấp). Làm **bước 2** ngay sau khi Owner cảm nhận bản đầu: game phá huỷ mà chỉ có 3 mức rung thì rumble, vật liệu và chữ ký từng booster đều bị san phẳng. Facade đã tự chọn đường "core" khi có `BlastHaptics`, nên bước 2 không phải sửa lại hook.

### 4.3 Settings

- Thêm mục **Rung** (Vibration) ngay dưới Âm thanh và Nhạc, ở cả Settings và Pause. Mặc định Bật. Lưu riêng (`blastRush.haptics.v1` của facade), **độc lập với tắt tiếng**. Ẩn mục này khi `Haptics.platform === "none"` (Safari trên iPhone).
- iOS System Haptics: app không đọc được công tắc này. Generator UIKit (bước 1) có thể bị iOS chặn khi công tắc tắt, còn Core Haptics thì không. Vì vậy công tắc Rung của game là bảo đảm duy nhất (cần kiểm trên máy).
- Reduce motion (`save.rm` hoặc cài đặt OS): giữ các cú chạm ngắn, rút rumble nổ về ≤0,3 s và TIMBER về ≤0,4 s, cường độ ×0,8. Đây là đề xuất của mình, chưa phải quy định của Apple.

### 4.4 Test trên iPhone thật (việc Owner cần cảm nhận và kiểm)

1. **Công tắc:** tắt Rung thì không rung gì cả. Tắt Âm mà Rung vẫn bật thì vẫn rung, và ngược lại.
2. **Đặt và chồng:** đặt 1 quả là một "cạch" gọn. Đặt quả thứ 2 lên cùng chỗ phải nặng hơn rõ ràng ("khoá đôi"), không nhầm với đặt thường.
3. **BLAST:** cảm được 3 nhịp, một khoảng lặng ngắn, rồi cú nổ. Rung và tiếng nổ trùng nhau, không thấy cái nào đi trước. Thử thêm với AirPods.
4. **Sập:** không thành một tràng rè liên tục. Cú nổ đầu và TIMBER nổi bật nhất. Các cú sau nhẹ dần. Hết rung khi đống đổ nát đã nằm yên.
5. **PASS 85 %:** đúng một cú "tách" sắc khi thanh vượt mốc, sau đó lặng khoảng nửa giây.
6. **Thắng:** xu bay vào ô xu có "tích tích tích… ting"; lúc tự về Home không rung.
7. **Thua và cảnh báo:** thua chỉ là 1–2 chạm nhẹ, không giống báo lỗi. Chạm toà xanh là 2 chạm đục. Rung kiểu cảnh báo (warning) chỉ xuất hiện khi toà xanh thực sự bị hại.
8. **Booster và độ bền:** vòng ngắm Sky có "nhịp tim" nhẹ, lặng một nhịp, rồi cú đập mạnh nhất game. Cú đập của Ball khác cú đập của Sky. Sau đó kiểm: bật System Haptics off và Low Power Mode, xem còn rung gì; cho app chạy nền giữa lúc sập rồi mở lại, không crash; chơi 10 phút xem máy có nóng hay tụt pin khác thường không.

Trước mỗi lần thử trên máy: `node games/blast-haptics/tools/ahap-check.js <outDir>` và `node games/blast-haptics/tools/haptics-selftest.js` phải xanh (selftest cần cập nhật theo bảng v2). Bật `?hapdbg=1` để xem log `Haptics.stats()` (đề xuất: số cú bị bỏ theo từng lý do).
