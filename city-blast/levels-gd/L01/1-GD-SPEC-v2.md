# Màn 1 v2: Bước 1, thông số của GD (bản sửa ngày 20/11)

Lý do sửa, theo góp ý của Khai:
- v1 ra kiểu vách đứng: 1 bom được 2%, 2 bom nhảy lên 63%;
- toà phụ làm qua loa;
- đế dày nên đặt bom vào mà không nhích.

## Hình khối

| Toà | Vai | Độ khó | Kích thước | Vật liệu |
|---|---|---|---|---|
| Tháp đồng hồ, **khối dưới** | chính | trung bình | 3 × 3 nhịp, 2 tầng | gạch; 4 trụ góc tầng 1 là `hrc` (3 nấc), tầng 2 là bê tông cốt thép thường |
| Tháp đồng hồ, **khối trên** | chính | khó | 3 × 3 nhịp, 2 tầng + tầng chuông | gạch, trụ góc bê tông cốt thép, sàn tầng chuông `hard7s`; 2 két nặng trong tầng chuông |
| Dãy cửa hàng | lá chắn | trung bình | 3 nhịp × 1 tầng, đặt trước chân tháp | gạch, mặt kính, có biển hiệu |
| Thùng đỏ ×3 | quà | miễn phí | sau dãy cửa hàng, cạnh trụ góc trước bên trái | thùng đỏ |
| Bể nước | toà cứng | khó | 2 × 2, 3 tầng cột | 4 chân bê tông cốt thép, bể nặng tính đến khi vỡ |

Hai khối của tháp **chạm nhau nhưng không dán**: mỗi khối có nhóm liên kết riêng. Phá chân thì khối dưới sụp, còn khối trên rơi xuống nguyên khối và phải đánh tiếp.

## Mục tiêu (tester)

| Bài | Ngưỡng |
|---|---|
| 1 bom tốt nhất | < 70% |
| Dồn chân / chỉ đánh chân | < 80% |
| Đường phản ứng | không có vách đứng: từ 1 bom lên 2 bom không nhảy quá 40 điểm |
| Bậc | **Hard**: người chơi máy dư ≥ 1 TNT, ≥ 3 đợt nổ, 30–90 giây |

Đổi bậc từ Normal sang Hard: v2 cần khoảng 8 đợt nổ và 75–80 giây, đúng ý "không thắng quá nhanh".
