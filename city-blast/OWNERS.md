# Ai sở hữu phần nào (Khai chốt 20/11)

Dự án: game **City Blast**. Repo chung duy nhất: `khai2510/city-blast-gd`. Repo floormen giữ nguyên, không dùng cho game.

| Phần | Chủ | Ghi chú |
|---|---|---|
| **Màn khó**: `city-blast/levels-gd/`, các khối `g7…` trong `city-blast/pipeline7/engine.js`, bài test màn khó trong `tester.js` / `run.mjs`, `city-blast/release/` | **Mac** (agent màn khó) | chỉ **làm** màn khó, gọi bằng mã H1, H2…; **vị trí** trong game do Agents-Game quyết định |
| **Mọi thứ còn lại và màn dễ**: `src/`, `data/`, `docs/`, `index.html`, `sfx/`, UI, shop, booster, âm thanh, màn 1–36 | **Agents-Game** (máy ảo) | dựng và đăng bản chính; **xếp vị trí mọi màn**, kể cả màn khó |
| `src/tools/build-main.js` | chung | mỗi bên chỉ **thêm bước** của mình, không sửa bước của bên kia |
| `city-blast/LEARNINGS.md`, `SYNC.md`, `CLAUDE.md` | chung | chỉ thêm, không xoá dòng của bên kia |

Luật:
1. Đầu phiên chạy `git pull --rebase`, rồi đọc `CLAUDE.md`, `LEARNINGS.md`, `SYNC.md`. Push ngay khi xong một việc. Không force-push.
2. Không sửa file thuộc phần bên kia. Cần bên kia làm gì thì ghi vào `SYNC.md`.
3. Bản chính W6863 chỉ **Agents-Game** đăng, và chỉ khi Khai OK. Link test chung của màn khó: CDNLd5gsjLaTaPGT7W4pes (Mac đăng).
4. Artifact chỉ là sản phẩm build: không sửa tay file HTML, mọi thay đổi đi qua nguồn trong repo.
