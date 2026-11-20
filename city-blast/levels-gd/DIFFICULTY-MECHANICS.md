# Cơ chế tạo độ khó cho City Blast (nghiên cứu 20/11)

Câu hỏi của Khai: làm sao để người chơi **không thắng quá nhanh**, nhưng **không** dùng "đế dày, bom không nhích":
- ít bom thì nhích ít, nhiều bom thì nhích nhiều;
- có toà khó, có toà dễ; có đoạn khó, có đoạn dễ;
- tầng giữa chặn sóng nổ;
- phá toà trước rồi mới tới toà sau;
- phá vỏ ngoài rồi mới thấy lõi trong.

Mọi con số dưới đây đều **đo trong game**, trên bản 18/11, bằng tester pipeline7.

## 1. Thước đo mới: đường phản ứng theo số bom

Tester đặt N quả TNT vào chân (dưới 3 m), với N = 1, 2, 3, 4, 6, 8, 12, rồi ghi % phá được (`P7.curve`, `curveprobe.mjs`). Có ba kiểu đường:

| Kiểu | Hình dạng | Cảm giác | Đánh giá |
|---|---|---|---|
| **Vách đứng** | 1–4 bom gần như 0%, rồi nhảy vọt lên 40–60% | "đế dày, bom không nhích", sau đó đổ ào một lần | ❌ chính là cái Khai chê |
| **Bậc thang** | mỗi bom thêm một bậc | mỗi lần nổ thấy một khối sụp | ✅ |
| **Đều** | tăng từ từ, có trần | nhích dần, nhưng dồn chân không thắng được | ✅ |

## 2. Đo các mẫu đã thử

| Mẫu | 1 bom | 2 | 3 | 4 | 6 | 8 | 12 | Kiểu |
|---|---|---|---|---|---|---|---|---|
| v4b (két + góc cứng) | 2–12 | | | | 40–60 | | | vách đứng |
| L01 v1 | 2 | **63** | | | | | | vách đứng |
| Kệ hàng (rack) | 6 | | | | | | 38 | đều, nhưng mất cảm giác đổ toà (Khai đã gạt) |
| **P3: dãy khối rời** | 4 | 28 | 60 | 60 | 73 | 81 | 85 | **bậc thang** |
| **P4: vỏ ngoài và lõi** | 12 | 26 | 28 | 37 | 81 | 62 | | đều, sau đó nhiễu |
| P1: tầng giữa trên cột mảnh | | | | | | | | vách đứng |
| **L01 v2 (tháp hai khối)** | 4 | 10 | 13 | 16 | 21 | 24 | 26 | **đều, có trần** |

## 3. Bảy cơ chế, và cái nào dùng được

| # | Cơ chế | Cách làm trong engine | Kết quả đo | Dùng? |
|---|---|---|---|---|
| 1 | **Khối rời** (toà ghép từ nhiều khối chạm nhau nhưng không dán) | nhóm liên kết `bg` riêng cho từng part; khối trên đè lên khối dưới | biến vách đứng thành bậc thang (P3, L01 v2) | ✅ cơ chế nền |
| 2 | **Lá chắn** (toà trước che chân toà sau) | toà thấp, độ khó trung bình, đặt sát trước chân toà chính | dồn chân giảm từ 70% xuống khoảng 45%: bom phải phá lá chắn trước | ✅ |
| 3 | **Vỏ và lõi** (phá vỏ mới thấy lõi) | lõi cứng nằm trong, vỏ mềm bọc ngoài | đều nhưng nhiễu ở 6–8 bom | ✅ cho màn khó, cần chỉnh |
| 4 | **Bê tông 3 nấc của L32** | `hrc`: 3 TNT mới gãy, hư hại giữ lại giữa các đợt | 1 bom không làm gì, nhưng người chơi thấy vết nứt nên biết phải đánh tiếp | ✅ chỉ đặt ở chân |
| 5 | **Tầng thép giữa chặn sóng nổ** (tầng 3–6) | tầng thép, hoặc tầng trên cột mảnh | tầng thép: khối trên rơi nguyên mảng, vẫn ra vách đứng; cột mảnh: vách đứng rõ | ⚠️ tự nó không đủ, phải kết hợp với #1 (tách thành hai khối tại tầng đó) |
| 6 | **Khối nặng tính đến khi vỡ** (két, bể nước) | luật `hard7`: khối cứng còn nguyên thì vẫn tính là chưa phá | chặn được chuyện dồn chân lên quá 80% | ✅ làm trần |
| 7 | **Thùng đỏ là phần thưởng** | đặt thùng đỏ *sau* lá chắn | phá xong lá chắn thì được một vụ nổ miễn phí | ✅ thưởng cho việc đọc đúng thứ tự |

**Kết luận về tầng giữa chặn sóng nổ:** ý của Khai đúng ở chỗ phải *ngắt* sự lan truyền. Nhưng trong engine, sóng nổ không đi qua sàn. Thứ lan truyền là **liên kết** (joint) giữa các khối. Vì vậy cách ngắt hiệu quả là **tách toà thành hai khối rời ngay tại tầng đó** (#1). Phá chân thì khối dưới sụp, còn khối trên rơi xuống nguyên khối, vẫn đứng, và phải đánh tiếp. Đó chính là cảm giác "chân đổ nhưng phần trên chưa xong".

## 4. Hệ thống toà phụ: mỗi toà một vai

Khai chê toà phụ làm qua loa. Từ L01 v2, **mỗi toà phụ phải có một vai** trong bảng dưới, và cảnh phải đọc ra được thứ tự dễ → khó.

| Vai | Độ khó | Vật liệu | Vị trí | Hình ảnh |
|---|---|---|---|---|
| **Lá chắn** (dãy cửa hàng, chợ) | trung bình | gạch, mặt kính | sát trước chân toà chính | mặt kính, mái hiên sọc, biển hiệu |
| **Quà** (thùng đỏ) | miễn phí | thùng đỏ | sau lá chắn, cạnh trụ góc | cụm 3 thùng |
| **Toà cứng** (bể nước, silo) | khó | chân bê tông cốt thép, bể nặng tính đến khi vỡ | bên cạnh, tách riêng | chân có giằng, bể thép có gân, thang |
| **Toà dễ** (ki-ốt, lán gỗ) | dễ | gỗ | rìa cảnh | biển nhỏ, mái nghiêng |
| **Hàng xóm cần giữ** | phạt nếu phá | | sát toà chính | để dành cho màn sau |

Mỗi màn chọn 2–4 vai. Không có toà phụ nào chỉ để trang trí.

## 5. Luật cho các màn sau

1. Mỗi màn phải có **đường phản ứng bậc thang hoặc đều**. Tester sẽ đánh trượt kiểu vách đứng (từ 1 bom lên 2 bom mà nhảy quá 40 điểm).
2. Toà chính cao từ 5 tầng trở lên phải **tách ít nhất hai khối**.
3. Ít nhất một toà phụ đóng vai **lá chắn** hoặc **vỏ**, để có thứ tự trước và sau.
4. Bê tông 3 nấc chỉ đặt ở chân. Phần trên dùng bê tông thường, để còn cảm giác đổ.
5. Ngưỡng cũ vẫn giữ: 1 bom < 70%, dồn chân < 80%.

## 6. Lớp mới: buộc phải nổ nhiều lần (yêu cầu 20/11)

Góp ý của Khai: người chơi đặt hết bom một lượt rồi bấm BLAST một lần là xong, như vậy chưa phải game hay. Màn chơi phải buộc **nổ từng phần**.

**Bài test mới, "một lượt" (`P7.oneWave`):** một người chơi khôn đặt toàn bộ số TNT vào **một lần BLAST**:
- khối cứng được đủ số bom cần (`hrc` hoặc `hard7` 3 quả, `rc` 1 quả);
- chân mỗi toà 2 quả;
- số còn lại rải theo chiều cao.

Ngưỡng: **< 80%**, đã đưa vào `run.mjs`.

Đo trên L01 v2 (31 TNT): một lượt được **92%**, thắng luôn. Khai nói đúng.

### Ba cơ chế mới trong engine (bật theo từng màn)

| Cơ chế | Luật | Cảm giác | Ghi chú |
|---|---|---|---|
| **drop7: "rơi xuống mới vỡ"** | két, bể nước, sàn cứng gần như miễn nhiễm TNT khi còn ở chỗ cũ; chỉ phá được khi đã **rơi xuống trước lúc bấm BLAST** | đợt 1 đổ toà ầm ầm, đợt 2 đập két nằm trong đống đổ nát | lần đầu chạm vào két trên cao, game báo "Too strong up high. Drop it first!" |
| **layer7: "mỗi lần nổ bóc một lớp"** | một khối chỉ mất tối đa 1/n độ bền mỗi lần BLAST, đặt bao nhiêu bom cũng vậy; hư hại giữ lại | trụ bóc vỏ, lộ thép, rồi gãy qua n lần nổ | dùng cho lõi hoặc trụ của màn khó |
| **cap7: giới hạn bom mỗi lần nổ** | tối đa n quả mỗi lần BLAST | luật cứng, dễ hiểu | phương án dự phòng, vì hơi "luật game" chứ không phải vật lý |

**Bài học khi làm drop7:** các quả TNT trong một lần BLAST nổ **lần lượt**. Bản đầu xét "đã rơi chưa" tại lúc trúng bom, nên quả nổ sau trúng két khi két đang rơi, và vẫn thắng 92%. Bản đã sửa xét trạng thái **lúc bấm BLAST**, và một lượt còn **73%**: toà sập 99%, nhưng 3 két còn nguyên.

## 7. Độ chi tiết theo chuẩn L32 (yêu cầu 20/11)

Các toà chính của bản 18/11 (L32 `mon14`, A1 `a1tock`, `a1needle`…) đều dựng bằng **builder riêng cho từng công trình**:
- cao 40–85 m, 150–430 khối;
- mọi chi tiết là trang trí gắn lên khối vật lý.

Bộ sinh khối chung `l6Mass` chỉ ra được hộp xếp chồng, nên **mỗi màn mới phải có builder riêng** (bộ g7 trong `engine.js`) và dùng `A1.h` cùng `M14.api`.

Bài học khi dựng:
1. Tầng trên phải đứng **đúng trên mặt sàn** tầng dưới. Hở 0,42 m là cả tầng rơi xuống ngay lúc dựng và cột bị nghiền.
2. Trụ 3 nấc đặt khắp chân thì 12 bom chỉ được 3%, thành "đế dày không nhích". Chỉ để 3 nấc ở trụ góc, trụ giữa dùng bê tông thường.
3. Không dùng luật "cả tầng sập" (`ring`) cho chân nhiều trụ, vì nó tạo ra vách đứng.
