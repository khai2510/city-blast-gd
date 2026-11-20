# city-blast/: hướng dẫn cho agent (mọi máy)

**Chia việc (Khai 20/11, chi tiết ở `OWNERS.md`):**
- Mac làm **màn khó** (mã H1, H2…), chỉ làm màn, không quyết định vị trí.
- **Agents-Game** (máy ảo) làm mọi thứ còn lại và màn dễ, xếp vị trí mọi màn, dựng và đăng bản chính.
- Việc cần bên kia làm: ghi vào `SYNC.md`. Công cụ: `TOOLS.md`. Bàn giao màn khó: `release/INTEGRATE.md`.


1. **Trước khi làm:**
   - Chạy `git pull`.
   - Đọc `city-blast/LEARNINGS.md` từ đầu đến cuối.
   - Đọc thêm `levels-gd/LEVEL-PROCESS.md` nếu làm màn mới.
2. **Làm màn theo 4 bước:** spec, Figma, builder, tester (LEARNINGS mục 2). Mỗi màn một thư mục `levels-gd/Lxx/`. Xong màn nào gửi Khai màn đó.
3. **Chạy tester:**
   - Từ `pipeline7/`: `LEVEL_JSON=../levels-gd/Lxx/level.json perl -e 'alarm 2700; exec @ARGV' node run.mjs`.
   - Chỉ một Chrome headless mỗi lúc.
   - Cần Node ≥ 20 và Google Chrome (đường dẫn trong `pipeline7/cdp.mjs`).
4. **Khi xong:**
   - Ghi bài học mới vào `LEARNINGS.md` (mục 5 cho lỗi, mục 6 cho trạng thái).
   - Commit và push lên `main` (không force-push).
   - Không ghi đè file ngoài `city-blast/` (`BRIEF.md`, `src/`, `data/`, `docs/`, `index.html` là của repo gốc).
5. **Không bao giờ:**
   - thêm gợi ý trong game;
   - sao chép công trình thật hay bố cục, ảnh, tên của Smash Fest;
   - đưa ảnh hay video Smash Fest vào repo (repo public);
   - sửa artifact game chính W6863… khi chưa có OK của Khai.
