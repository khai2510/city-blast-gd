# Công cụ nội bộ (`city-blast/pipeline7/`)

Tất cả chạy bằng Node ≥ 20 và Chrome headless (`cdp.mjs`; trên Linux đặt `CHROME=<đường dẫn>`). **Chỉ một Chrome mỗi lúc.** Lệnh chạy lâu thì bọc bằng `perl -e 'alarm 3000; exec @ARGV' node …`.

| Công cụ | Dùng để | Lệnh |
|---|---|---|
| `build.mjs` | tiêm engine và dữ liệu màn vào base 18/11 | `import { buildHtml }` |
| `run.mjs` | **tester đầy đủ** của một màn: oneBomb, lazy, allFoot, footOnly, oneWave, fair, bài riêng (aim, keepRoutes, seqRoutes, coreTest); in PASS/FAIL | `LEVEL_JSON=../levels-gd/Lxx/level.json node run.mjs` |
| `tester.js` | các bài test chạy trong trang (`window.P7`): `reach4` (chạm được từ 4 góc camera), `keepT`, `seqT`, `coreT`, `aim`, `oneWave`… | được `run.mjs` nạp |
| `packcheck.mjs` | dựng gói, đếm khối chết lúc dựng, kiểm tip rỗng | `N=5 node packcheck.mjs <html>` |
| `shotlv.mjs` | ảnh mở màn | `node shotlv.mjs <html> <out.png>` |
| `shotkeep.mjs` / `shotseq4.mjs` / `shotcore.mjs` | ảnh sau n lần nổ của đường giải (Màn 3 / 4 / 5) | xem đầu file |
| `closeup.mjs` | **camera cận cảnh** để soi mái, khe hở | `node closeup.mjs <levels.json> <k> "x,y,z,d,yaw,pitch" out.png` |
| `floatcheck.mjs` | khe hở tĩnh giữa decor và khối chủ | `node floatcheck.mjs <levels.json>` |
| `hangcheck.mjs` | khối còn treo trên cao sau một lần nổ lớn | `SHOT=1 node hangcheck.mjs <levels.json> 14` |
| `keepprobe.mjs` / `coreprobe.mjs` / `footdbg.mjs` / `domdbg.mjs` / `reach2.mjs` | đo nhanh từng bài, dò lỗi domino, xem khối chạm được | xem đầu file |

Figma: file "City Blast — Level Designs" (`lPChMUu7HoLizIXGtMa5uj`), mỗi màn một khung bản vẽ (mặt bằng hoặc mặt đứng, "How it plays").
