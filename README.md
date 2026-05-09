# AIKDCL — Quản lý Minh chứng & Báo cáo Tự đánh giá Kiểm định

> Ứng dụng web AI hỗ trợ trường đại học quản lý tập trung kho minh chứng
> kiểm định và tự động sinh báo cáo tự đánh giá (SAR) theo nhiều bộ tiêu
> chuẩn (AUN-QA, MOET, ABET, FIBAA, CDIO…).

Thành viên hệ sinh thái **UAE18** (University AI Ecosystem). Stack chuẩn:
Next.js 14 + Firebase (Auth/Firestore/Storage/App Hosting) + Anthropic
Claude API.

## Trạng thái — MVP pha 1

- [x] Module 1 — Kho minh chứng thông minh (upload, AI trích metadata, tag tiêu chí)
- [x] Module 2 — Thư viện bộ tiêu chuẩn (AUN-QA v4, MOET TT04)
- [x] Module 3 — Ma trận đối chiếu minh chứng ↔ tiêu chí + cảnh báo thiếu
- [ ] Module 4 — Sinh SAR tự động (pha 2)
- [ ] Module 5 — Critic Mode (pha 2)
- [ ] Module 6 — Quản lý kế hoạch cải tiến (pha 2)
- [ ] Module 7 — Export & tích hợp (pha 2)

## Production

- URL: `https://aikdcl--aikdcl.asia-southeast1.hosted.app/`
- Region: `asia-southeast1`
- Backend App Hosting: `aikdcl`
- Firebase project: `aikdcl`

## Local development

```bash
git clone https://github.com/thoannv1976/aikdcl.git
cd aikdcl
cp .env.example .env.local        # rồi điền giá trị thật
npm install
npm run dev                       # http://localhost:3000
```

## Scripts

| Lệnh | Việc làm |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | Build production (standalone) |
| `npm start` | Start server đã build (prod) |
| `npm run typecheck` | `tsc --noEmit` toàn repo |
| `npm run lint` | ESLint |

## Cấu trúc

```
src/
├── app/             Next App Router (layout, pages, API routes)
├── components/      React components reusable
└── lib/             Server logic — Firebase admin, Claude, auth, types
```

Xem chi tiết pattern và quy ước trong **`CLAUDE.md`** (file CRITICAL).
Hướng dẫn deploy chi tiết ở **`docs/DEPLOY.md`**.

## Bảo mật

- Mọi credential qua **Secret Manager** (xem `apphosting.yaml`).
- `firestore.rules` deny by default + `ownerId` pattern.
- Mọi route gọi Claude phải qua `requireAuth()` + rate limit.
- `usage_logs/` chỉ ghi metadata, **không** ghi nội dung user upload.

## License

[Internal — UAE18 ecosystem]
