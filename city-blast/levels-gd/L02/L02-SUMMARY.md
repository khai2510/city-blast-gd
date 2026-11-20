# Màn 2: "Watch Keep" (ngắm hướng đổ, rồi chuỗi phản ứng)

| Bước | Kết quả | File |
|---|---|---|
| 1. Spec của GD | bài học, chuỗi wow, hình khối, vai các toà | `1-GD-SPEC.md` |
| 2. Figma | khung "L02 v2 · Watch Keep (aim → chain) · design": mặt đứng, bảng vai, ghi chú chuỗi; không mũi tên | `watchkeep-v2-fig.png` |
| 3. Builder | `g7keep` (tháp canh, luật nghiêng), `g7hall` (Đại sảnh, kho thuốc súng giấu trên tầng 3), `g7gtow` (tháp cổng), `g7cwall` (tường thành), trong `pipeline7/engine.js` | `make-level.mjs` |
| 4. Tester | PASS | `run-c.log` |

## Cơ chế dùng trong màn

- **layer7** trên trụ góc `hrc`: mỗi lần BLAST chỉ bóc được 1 lớp, nên phải đục qua 3 lần nổ.
- **hit7** trên trụ đá tầng trệt của Đại sảnh: TNT gần như không làm gì; chỉ vỡ khi có khối nặng rơi đè trong vòng 1,5 m (kể cả khối của chính sảnh, nên sảnh sụp lan); vụ nổ kho thuốc súng phá được (mạnh gấp 4).
- **Thùng bị nghiền thì nổ:** một khối trên 2 tấn đập xuống sát thùng đỏ là thùng phát nổ.

## Số đo (25 TNT)

| Bài | Kết quả |
|---|---|
| 1 bom tốt nhất | 2% |
| Đặt hết TNT, nổ một lần | 12% |
| Dồn chân / chỉ đánh chân | 28% / 68% |
| **Đổ đúng hướng (về phía Đại sảnh)** | **90%: thắng**, 19 TNT, 5 đợt nổ, kho thuốc súng nổ 5/5, tháp cổng đổ |
| Đổ sai hướng (3 phía còn lại) | 71% / 71% / 78%: thua |
| Người chơi máy không biết nhắm | thua 3/3 |
| Đường phản ứng (bom ở chân tháp, một lần nổ) | 1–5%: tháp không đổ trong một lần nổ, vì trụ góc phải đục qua 3 lần (đúng thiết kế) |

## Còn lưu ý

- Đổ sai về phía sau (−z) được 78%: sát ngưỡng 80%, vì máy dọn tầng trên làm thùng thuốc súng nổ. Vẫn không thắng được.
- Màn này cần người thật chơi thử để biết có tự tìm ra cách "đục 3 lần rồi nhắm" không, khi không có gợi ý nào.
