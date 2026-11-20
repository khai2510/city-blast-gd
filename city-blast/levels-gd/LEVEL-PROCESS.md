# City Blast: quy trình làm một màn khó

Cập nhật ngày 20/11. Viết lại sau Màn 1 "Five Eaves", màn Khai đánh giá "làm rất tốt". File này là cách làm chuẩn cho mọi màn khó từ nay về sau.

---

## 0. Mục tiêu của một màn khó

Một màn khó **dạy người chơi một kỹ năng**. Khó không phải vì tốn nhiều bom. Có ba điều không được xảy ra:

| Không được | Vì sao | Kiểm bằng |
|---|---|---|
| 1 bom làm thắng | hết khó ngay | `oneBomb` < 70% |
| Dồn hết bom vào chân mà thắng | không phải suy nghĩ | `allFoot`, `footOnly` < 80% |
| Đặt hết bom rồi bấm BLAST một lần mà thắng | không còn nhịp nổ từng phần | `oneWave` < 80% |

Thêm một yêu cầu về cảm giác: **ít bom thì nhích ít, nhiều bom thì nhích nhiều** (đường phản ứng tăng dần, không có vách đứng). Và toà vẫn phải **đổ** được, vì cảm giác đổ toà là cái hay của game.

---

## 1. Quy trình bốn bước, mỗi màn một lượt

Quy tắc 1: **làm từng màn một; xong màn nào gửi Khai màn đó.**

### Bước 1: GD viết spec (`Lxx/1-GD-SPEC.md`)

1. **Bài học** của màn, một câu (xem mục 4).
2. **Công trình cảm hứng**, lấy từ `LANDMARKS.md`.
   - Không trùng các công trình đã có trong game: F01 tháp đồng hồ, F02 tháp nghiêng, F04 đĩa bay, F07 tháp đôi, F16 Art Deco, F24 toà bàn là…
   - Kiểm danh sách bằng lệnh `grep "F[0-9][0-9]" base-1811.html`.
   - Chỉ lấy cảm hứng, không sao chép.
3. **Hình khối:** số toà, vị trí, kích thước theo mét, số tầng. Quy mô của toà chính: 25–45 m, 120–400 khối.
4. **Vật liệu:** loại nào ở đâu, và vai trò của nó trong độ khó.

| Vật liệu | Key | Mấy TNT | Vai trò |
|---|---|---|---|
| Gỗ | `wpost`, `wwall` | 1 | phần dễ, đổ ầm |
| Gạch | `bk`, `bkw` | 1 | lá chắn, toà phụ |
| Bê tông cốt thép | `rc` | 1 | trụ giữa |
| Bê tông 3 nấc (L32) | `hrc` | 3, hư hại giữ lại | **chỉ ở trụ góc**; đặt khắp chân sẽ thành "đế dày không nhích" |
| Khối nặng | `hard7v`, `hard7e` | 1–3 | tính đến khi vỡ; dùng với cơ chế sắp thứ tự |
| Thùng đỏ | tanks | nổ miễn phí | quà, đặt sau lá chắn |

5. **Toà phụ, mỗi toà một vai:**
   - lá chắn (che chân toà chính);
   - quà (thùng đỏ);
   - toà cứng;
   - toà dễ;
   - toà xanh (bảo vệ);
   - toà đích (phải đổ toà khác lên).

   Không có toà phụ nào chỉ để trang trí.
6. **Bảng mục tiêu cho tester** (mục 3).

### Bước 2: Figma (file "City Blast — Level Designs (GD × Figma)")

- Mỗi màn một khung tên `Lxx · <tên> · design` trên trang thiết kế, gồm:
  - **Mặt đứng** đúng tỷ lệ (ghi "1 m = N px"): toà chính, toà phụ, thùng đỏ.
    - Mái, cột, cửa và đèn phải vẽ ra được dáng công trình, không vẽ hộp.
    - Tên của từng layer nói luôn vai trò, ví dụ `Roof 1 (heavy eave slabs: drop first)`.
  - **Bảng vai trò:** màu, tên toà, vai, độ khó, cách phá.
  - **Bảng "vì sao không thắng một lượt":** thứ tự nổ mà màn muốn dạy (1, 2, 3).
  - **Mặt bằng nhìn từ trên** nếu màn có chuyện trước/sau hoặc hướng đổ. Vẽ mũi tên hướng đổ đúng và vị trí toà xanh.
- Dùng component có sẵn (Glass window, Hard post segment, Vault block), font Luckiest Guy và Nunito.
- Chụp ảnh khung và lưu thành `Lxx/<tên>-fig.png`.

### Bước 3: GD ánh xạ ngược sang game

1. **Builder riêng cho toà chính và toà phụ** (bộ `g7*` trong `pipeline7/engine.js`). **Không dùng** bộ sinh khối chung `l6Mass`, vì nó chỉ ra hộp xếp chồng.
   - Bộ công cụ có sẵn:
     - `A1.h.boxSt` / `octSt`: một tầng gồm trụ, sàn, vách, kính;
     - `kq`, `bar`, `ring`, `near`, `rng`: trang trí;
     - `M14.api.mat`, `floors`, `rcDecor` (vết nứt 3 nấc), `tip` (luật nghiêng), `floorIn` (nội thất);
     - `l6KdAdd`: gắn trang trí lên khối.
   - **Khối vật lý** = trụ, sàn, vách, kính, mái nặng.
   - **Trang trí** = mọi thứ còn lại: mái cong, góc vểnh, lan can, đèn, cửa, nội thất. Trang trí gắn lên khối nên rơi và vỡ cùng khối.
2. **Tách khối:** mỗi tầng hoặc mỗi phần có thể đổ riêng được gán một nhóm liên kết riêng (`bg`). Các khối chạm nhau nhưng không dính, nên toà sụp từng bậc.
3. **Bật cơ chế sắp thứ tự** hợp với bài học (mục 4): `drop7`, `layer7`, `cap7`, `hit7`.
4. **File dữ liệu màn** `Lxx/make-level.mjs` → `level.json`, gồm: tên, `tier`, `parts`, `tanks`, `keeps`, cơ chế, `tip` (tối đa 9 chữ, nói nguyên tắc, không chỉ chỗ đặt), `tntStart`.
5. **Ba lỗi đã gặp, kiểm ngay:**
   - Tầng trên phải đứng **đúng trên mặt sàn** tầng dưới. Hở vài chục phân là tầng rơi và vỡ ngay lúc dựng.
   - Toà phải đứng yên sau 8 giây. Chạy `probe4.mjs`: không có khối nào chết hoặc xê dịch.
   - Toà nặng đặt trên cột gỗ thì cột bị nghiền ở mối nối: giảm khối lượng phía trên.

### Bước 4: Tester (`pipeline7`), rồi chơi thật

```
node Lxx/make-level.mjs
cd pipeline7 && LEVEL_JSON=../levels-gd/Lxx/level.json node run.mjs > ../levels-gd/Lxx/run-a.log
node curveprobe.mjs ../levels-gd/Lxx/level.json      # đường phản ứng theo số bom
node wave1probe.mjs ../levels-gd/Lxx/level.json <TNT> # một lượt, chạm thứ gì cũng được / chỉ chạm thứ nhìn thấy
node shotlv.mjs out/index-test.html Lxx/shot.png      # ảnh trong game
```

- Đạt hết thì đưa lên link test (artifact `CDNLd5gsjLaTaPGT7W4pes`; **không đụng artifact chính**), rồi gửi Khai:
  - ảnh mở màn;
  - ảnh sau đợt nổ đầu;
  - bản vẽ Figma;
  - bảng số đo.
- Cảm nhận của Khai khi chơi là vòng cuối. Ngân sách TNT chỉnh sau vòng này.

---

## 2. Tester làm gì (máy chơi thật trong game)

Tester mở game thật (Chrome không giao diện, build 18/11) và chơi bằng **chạm màn hình thật**: chạm, đặt TNT, bấm BLAST.

| Bài | Người chơi giả lập | Ý nghĩa |
|---|---|---|
| `oneBomb` | thử 18–20 vị trí, giữ quả tốt nhất | 1 bom có thắng không |
| `lazy` | 4 TNT ở chân toà chính | lười có thắng không |
| `allFoot` | toàn bộ TNT ở chân mọi toà, một lần nổ | dồn chân |
| `footOnly` | chỉ đánh tầng sát đất, nhiều đợt | chỉ biết đánh chân |
| **`oneWave`** | toàn bộ TNT trong **một lần BLAST**: khối cứng được đủ số bom cần, chân mỗi toà được 2 quả, số còn lại rải theo chiều cao (bản "chỉ chạm" thì chỉ chạm thứ nhìn thấy được) | đặt hết rồi nổ một lần |
| `fair` | người chơi thường, mỗi đợt tối đa 3 quả mỗi toà, chạy 3 seed | thắng được không, dư bao nhiêu TNT, mấy đợt, bao lâu |
| `curve` | 1, 2, 3, 4, 6, 8, 12 bom ở chân | ít bom nhích ít, nhiều bom nhích nhiều |
| **Bài riêng của màn** | xem mục 4 | người chơi làm **sai bài học** thì **không thắng** |

### Ngưỡng đạt

| | Normal | Hard | Super Hard |
|---|---|---|---|
| oneBomb | < 70% | < 70% | < 70% |
| allFoot / footOnly / oneWave | < 80% | < 80% | < 80% |
| fair thắng | 3/3 | 3/3 | 3/3 |
| TNT dư (máy) | ≥ 2 | ≥ 1 | ≥ 1 |
| Số đợt nổ | ≥ 2 | ≥ 3 | ≥ 3 |
| Thời gian ước tính | 20–75 giây | 30–90 giây | 40–120 giây |
| Đường phản ứng | không nhảy quá 40 điểm giữa hai mức liên tiếp | | |

Người chơi máy có thể dao động mạnh giữa các seed (Màn 1: 31 TNT có lần thua, 37 TNT thắng chắc). Chạy hai lần trước khi chốt ngân sách.

### Thế nào là "đạt điểm mong muốn"

Một màn đạt khi có đủ **bốn** điều:
1. Mọi bài chống ăn gian ở bảng trên đều đạt.
2. **Bài riêng của màn chứng minh được bài học.** Đúng cách thì thắng, sai cách thì không: ví dụ đổ sai hướng thì không thể đạt 85%.
3. **Đường phản ứng tăng dần**, nghĩa là có cảm giác đổ.
4. **Hình ảnh đạt chuẩn L32:**
   - nhận ra được dáng công trình từ góc nhìn toàn cảnh;
   - có chi tiết và nội thất;
   - phá vỏ thì thấy được bên trong.

---

## 3. Các cơ chế đang có trong engine

| Cơ chế | Bật bằng | Dạy gì |
|---|---|---|
| Khối rời (`bg`) | part `bg` / `bg0` | đổ từng bậc |
| Bê tông 3 nấc (L32) | key `hrc` | hư hại cộng dồn: 1 + 1 + 1 bằng 3 quả cùng lúc |
| Luật nghiêng (L32) | `M14.api.tip` | phá 2 trụ cạnh nhau thì toà đổ về phía đó |
| **drop7** | `L.drop7 = {keys}` | **phải làm rơi trước** rồi mới phá được |
| **layer7** | `L.layer7 = {keys, n}` | **mỗi lần nổ bóc một lớp** |
| **cap7** | `L.cap7 = n` | **mỗi lần nổ tối đa n quả** |
| **hit7** (mới, cho Màn 2) | `L.hit7 = {keys}` | **TNT không phá được, chỉ vỡ khi bị toà khác đổ đè lên** |
| Toà xanh | `keeps:[{kind:"keep6"}]` | làm hư hơn 5% là **thua** |
| Thùng đỏ | `tanks` | nổ miễn phí |

---

## 4. Năm màn khó: mỗi màn một bài học

Câu chuyện chung của cả gói là **nổ từ từ, mỗi lần nổ có mục đích.** Mỗi màn thêm một lý do vì sao phải từ từ.

| Màn | Bài học (người chơi học được gì) | Cơ chế | Cảm hứng | Bài riêng của tester (sai thì thua) |
|---|---|---|---|---|
| 1 ✅ | **Làm rơi trước, phá sau** | drop7, tầng rời | chùa nhiều tầng mái | oneWave < 80% |
| **2** | **Ngắm hướng đổ:** quật tháp lên toà đích mà TNT không phá được | tip, **hit7** | tháp canh pháo đài | đổ sai hướng (về 3 phía còn lại) thì < 80% |
| 3 ✅ | **Tránh toà xanh:** nổ từng ít một, kéo toà đổ ra xa toà xanh | keep6 sát bên, tip | nhà hát kiểu Pháp thuộc | oneWave và "nổ to một lần" đều làm hư toà xanh nên thua; nổ từng phần thì thắng |
| 4 ✅ | **Đổ dây chuyền:** đổ toà đầu, nó quật toà thứ hai, toà thứ hai quật toà thứ ba | hit7 ở chân các toà sau, tip | dãy nhà phố cổ | bắt đầu sai đầu dãy thì không thắng |
| 5 ✅ | **Bóc vỏ thấy lõi:** vỏ ngoài che lõi; lõi mỗi lần nổ chỉ bóc một lớp | layer7, che khuất | hội trường mái vỏ | lõi phải qua ≥ 3 lần nổ |
| 6 | **Tổng hợp:** kíp nổ chỉ có n chỗ, có toà xanh, có khối phải rơi trước | cap7, keep6, drop7 | thành cổ, cổng pháo đài | mọi bài trên |

Thứ tự công trình có thể đổi ở bước 1 của từng màn, nhưng bài học giữ nguyên.

---

## 5. Cái gì tạo độ khó, và cái gì tạo khoảnh khắc "wow" (nghiên cứu 20/11)

Góp ý của Khai:
- Nếu chỉ "nổ ở chân rồi toà đổ" thì nghèo.
- Phải có **khoảnh khắc nhận ra** (realization) và **khoảnh khắc wow**.
- **Không gợi ý** bằng mũi tên hay câu nhắc: người chơi tự nghĩ.

### 5.1 Khoảnh khắc wow đến từ đâu

| Nguồn wow | Người chơi cảm thấy | Cách làm trong City Blast |
|---|---|---|
| **Đòn bẩy**: đầu vào nhỏ, kết quả lớn | "chỉ một quả đúng chỗ mà…" | **chuỗi phản ứng**: tháp đè sảnh, sảnh sụp đè kho thuốc súng, kho nổ, cổng sập. Một lần nổ đúng, bốn sự kiện nối nhau |
| **Đổ đúng chỗ mình nhắm** | "mình điều khiển được cú đổ" | luật nghiêng; toà đích lớn và đồ sộ, bị đè thì sụp dây chuyền |
| **Bóc lớp, lộ bên trong** | "bên trong có cái này!" | vách vỡ để lộ nội thất, két, thùng đỏ giấu trong toà |
| **Kiên nhẫn được đền đáp** | căng thẳng tăng dần, rồi bùng nổ | trụ 3 nấc đục qua 3 lần nổ, vết nứt lớn dần, rồi cả tháp đổ |
| **Bất ngờ có lý** | "à, ra là vậy" | khối đá TNT không phá được nhưng một tháp đổ đè lên thì vỡ; két trên cao không phá được nhưng rơi xuống thì vỡ |
| **Quy mô** | choáng ngợp | toà phụ phải đồ sộ (đền, sảnh lớn, tường thành), không phải mấy khối nhỏ |

### 5.2 Khoảnh khắc nhận ra (người chơi tự tìm, không có mũi tên)

Màn tốt là màn mà lần thử đầu **thất bại có thông tin**:
- Bom lên khối đá: không vỡ, chỉ thấy bụi. Người chơi tự hiểu "TNT không ăn".
- Trụ góc nứt nhưng chưa gãy. Người chơi hiểu "phải đục tiếp".
- Đổ sai hướng: tháp đè tường, sảnh vẫn nguyên. Người chơi hiểu "phải nhắm".

Thất bại phải **thấy được nguyên nhân** qua vết nứt, khối còn nguyên, hướng đổ. Không cần chữ.

### 5.3 Độ khó đến từ đâu (ngoài số bom)

1. **Đọc kết cấu:** khối nào chịu lực, khối nào chỉ để che.
2. **Thứ tự:** cái gì trước, cái gì sau (`drop7`, `layer7`).
3. **Hướng:** đổ về đâu (luật nghiêng).
4. **Ràng buộc:** toà xanh, số bom mỗi lần nổ (`cap7`).
5. **Thứ tự nổ trong một lần BLAST:** quả đặt trước nổ trước, cách nhau 0,2 giây. Người giỏi dùng thứ tự đặt để điều khiển hướng sập.
6. **Phản ứng dây chuyền:** biết nhắm vào chỗ khởi động chuỗi thay vì phá từng toà.

### 5.4 Luật cho 5 màn khó

- Mỗi màn có **ít nhất một chuỗi phản ứng** (đòn bẩy) và **ít nhất một khoảnh khắc nhận ra**.
- **Toà phụ đồ sộ:** cao 10–25 m, có kết cấu và chi tiết thật như toà chính. Không còn cụm khối nhỏ.
- **Không mũi tên, không câu nhắc lúc mở màn.** Chỉ có câu báo khi thua (≤ 9 chữ, nói nguyên tắc).
- Tester kiểm thêm: **đúng cách thì thắng, sai cách thì thua** (bài riêng của màn).
- **Bố cục có trật tự (góp ý Khai về Màn 3):**
  - Xếp theo kiến trúc thật của công trình: nhà hát thì sảnh, khán phòng, tháp sân khấu nằm trên một trục.
  - Toà phụ và toà xanh đặt đối xứng hoặc thẳng hàng: cùng cỡ, cùng chiều cao, khoảng cách bằng nhau, mép thẳng với một bức tường của toà chính.
  - Khoảng cách lặp lại đều (dãy nhà: cùng bề ngang, khe đều).
  - Camera gần chính diện để thấy trục.
  - Không đặt "cho vừa chỗ trống".


### 5.5 Lỗi đã sửa: bom treo lơ lửng (20/11)

Các quả trong một lần BLAST nổ lần lượt, cách nhau 0,2 giây. Toà sập trước thì những quả còn lại treo giữa không trung.

Đã sửa trong `engine.js`:
- Sau mỗi bước vật lý, bom chưa nổ **bám theo khối nó được đặt lên**. Khối vỡ thì bom rơi xuống đất.
- **Bỏ vòng đỏ** quanh quả bom, chỉ giữ quả bom.

Đo trên Màn 1: trong lúc toà sập, bom luôn cách khối của nó 14–25 px, đúng bằng độ lệch tại mặt đặt bom.
