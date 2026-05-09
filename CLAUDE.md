# Project: AIKDCL

[Mô tả app cụ thể này làm gì, đối tượng dùng]

Lưu ý:
App AIKDCL
1. Đã tạo firebase project 
Project name: AIKDCL
Project ID: aikdcl
Project number: 1056300284274
2. Đã tạo cơ sở dữ liệu firestore
3. Đã nâng cấp firebase lên blaze
4. Đã tạo firestorage
5. Đã tao security authentication 
6. Đã tạo app hosting (connect với Githup repo: aikdcl)
7.
8.
------
AI-KĐCL — Quản lý Minh chứng & Tự động hóa Báo cáo Đánh giá Kiểm định
(Đề xuất tên thay thế: AI-SAR, AI-EVISAR, AI-Kiểm định 360)
1. Một dòng giới thiệu
Ứng dụng web AI hỗ trợ trường đại học quản lý tập trung kho minh chứng kiểm định và tự động sinh báo cáo tự đánh giá (SAR) theo nhiều bộ tiêu chuẩn (AUN-QA, MOET, ABET, FIBAA, CDIO…), rút ngắn quy trình kiểm định chất lượng từ vài tháng xuống vài ngày, đảm bảo tính nhất quán và truy xuất ngược minh chứng.
2. Bài toán cần giải quyết
Tại các trung tâm Đảm bảo Chất lượng (ĐBCL) và phòng Đào tạo của trường đại học hiện nay:

Minh chứng kiểm định nằm rải rác trên Google Drive, email, SharePoint, ổ cứng cá nhân, file giấy. Mỗi kỳ kiểm định phải huy động nhân sự đi gom lại từ đầu, tốn 2–3 tháng.
Viết Báo cáo Tự đánh giá (SAR) cần huy động hàng chục cán bộ, giảng viên cùng lúc, chất lượng không đồng đều, văn phong rời rạc.
Một minh chứng có thể phục vụ nhiều tiêu chí, nhưng không có công cụ tra cứu ngược (criterion → evidence) lẫn xuôi (evidence → criterion).
Khó phát hiện tiêu chí thiếu minh chứng cho đến phút cuối, gây sửa chữa gấp.
Sau kiểm định, kế hoạch cải tiến liên tục (CI – Continuous Improvement) không được giám sát hệ thống.
Trước khi nộp cho đoàn đánh giá ngoài, nhà trường không có công cụ tự "phản biện ngược" SAR của chính mình.

3. Đối tượng người dùng

Người dùng chính: cán bộ Trung tâm ĐBCL, cán bộ Phòng Đào tạo, Phòng Khảo thí.
Người dùng phụ: Trưởng khoa/bộ môn, giảng viên đầu mối, Ban Giám hiệu (chế độ xem dashboard).
Vai trò quản trị: Quản trị viên hệ thống của trường.

Mọi thao tác đều phải thân thiện với người dùng không chuyên IT.
4. Các năng lực cốt lõi
Module 1 — Kho Minh chứng Thông minh

Upload đa định dạng (PDF, DOCX, XLSX, PPT, ảnh, video) hoặc kết nối nguồn dữ liệu sẵn có (Google Drive, OneDrive, email, hệ thống UniDrive nội bộ).
AI tự động đọc, trích xuất metadata (tiêu đề, ngày ban hành, đơn vị, mã văn bản, tóm tắt nội dung).
AI tự gắn tag tiêu chí kiểm định mà tài liệu có thể phục vụ (multi-label).
Tìm kiếm ngữ nghĩa: ví dụ truy vấn "minh chứng khảo sát ý kiến doanh nghiệp 2023" trả về danh sách tài liệu kèm trích đoạn cụ thể trong file.
Quản lý vòng đời tài liệu: hiệu lực, hết hạn, version, cảnh báo cần cập nhật.
Phát hiện trùng lặp, gợi ý gộp.

Module 2 — Thư viện Bộ tiêu chuẩn (cấu hình được)

Có sẵn các bộ chuẩn phổ biến: AUN-QA (cấp chương trình & cấp cơ sở), MOET (Thông tư 04, 12, 38), ABET, FIBAA, CDIO, các bộ chuẩn chuyên ngành.
Cho phép nhà trường tự định nghĩa bộ tiêu chí riêng (custom rubric).
Mỗi tiêu chí có: mã, tên, mô tả, gợi ý loại minh chứng cần có, mức điểm mong muốn.

Module 3 — Đối chiếu Minh chứng ↔ Tiêu chí

Sinh ma trận trực quan: hàng = tiêu chí, cột = minh chứng (hoặc ngược lại).
AI tự cảnh báo: tiêu chí thiếu minh chứng, minh chứng yếu, minh chứng quá cũ.
Cho phép cán bộ duyệt thủ công gợi ý của AI (chấp nhận / điều chỉnh / từ chối).
Đề xuất minh chứng bổ sung nên thu thập.

Module 4 — Tự động sinh Báo cáo Tự đánh giá (SAR)

Người dùng chọn: bộ tiêu chuẩn → chương trình/đơn vị cần đánh giá → kỳ kiểm định.
AI sinh draft SAR đầy đủ. Với từng tiêu chí, AI viết:

Phần mô tả hiện trạng,
Phần đối chiếu minh chứng (kèm trích dẫn tên file & vị trí),
Điểm mạnh, điểm cần cải tiến,
Mức điểm tự đánh giá đề xuất.


Ngôn ngữ học thuật chuẩn, văn phong nhất quán xuyên suốt.
Hỗ trợ song ngữ Việt – Anh.
Cán bộ ĐBCL biên tập trực tiếp trong app, có thể yêu cầu AI: "viết lại đoạn này", "ngắn gọn hơn", "nghiêm khắc hơn", "thân thiện hơn", "thêm số liệu cụ thể".

Module 5 — Phản biện ngược (Critic Mode)

AI đóng vai đoàn đánh giá ngoài đọc lại SAR đã viết.
Phát hiện: thiếu logic, thiếu minh chứng cho khẳng định, ngôn ngữ chưa đạt, mâu thuẫn nội tại, số liệu không khớp.
Sinh danh sách câu hỏi mà đoàn đánh giá ngoài có thể đặt trong buổi phỏng vấn.
Sinh checklist các điểm cần củng cố trước khi nộp.

Module 6 — Quản lý Kế hoạch Cải tiến (CI)

Từ kết quả SAR và phản biện ngược, AI gợi ý danh sách action item cải tiến.
Giao việc cho đơn vị / cá nhân, theo dõi tiến độ, nhắc hạn.
Dashboard KPI cải tiến liên tục theo thời gian thực.
Lưu lịch sử để phục vụ kỳ kiểm định kế tiếp.

Module 7 — Xuất & Tích hợp

Xuất SAR ra DOCX/PDF đúng template chính thức của từng tổ chức kiểm định.
Xuất gói minh chứng (file ZIP có cây thư mục được tổ chức theo tiêu chí, kèm index PDF).
API để tích hợp với LMS (Moodle), ERP, Power BI và các ứng dụng UAE18 khác (DCHP, DGDCHP2, AI-ĐGGT…).

5. Đầu vào / Đầu ra
Đầu vào: tài liệu minh chứng đa định dạng, thông tin chương trình đào tạo / đơn vị, bộ tiêu chuẩn áp dụng, các báo cáo có sẵn của trường.
Đầu ra: Báo cáo SAR hoàn chỉnh (DOCX/PDF), gói minh chứng có index, kế hoạch cải tiến, dashboard kiểm định.
6. Yêu cầu phi chức năng

Bảo mật cao: dữ liệu kiểm định và minh chứng là dữ liệu nhạy cảm. Cần phân quyền chi tiết theo vai trò, audit log mọi thao tác đọc/sửa/xóa, mã hóa dữ liệu khi lưu và khi truyền.
Hiệu năng: kho minh chứng có thể đến hàng chục nghìn file. Tìm kiếm ngữ nghĩa phải dưới 2 giây.
Cộng tác đa người dùng: nhiều cán bộ có thể cùng biên tập SAR đồng thời (collaborative editing), có lịch sử thay đổi và rollback.
Tuân thủ pháp lý: lưu trữ tại Việt Nam/khu vực Đông Nam Á, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
Triển khai linh hoạt: ưu tiên cloud-first, nhưng phải có phương án triển khai on-premise/private AI cho trường có yêu cầu bảo mật cao.
Khả năng đổi AI engine: kiến trúc tách lớp adapter để có thể chuyển đổi giữa Claude, GPT, Gemini, hoặc model open-source local (Llama, DeepSeek, Qwen) chạy nội bộ — đáp ứng tiêu chí "Private AI" mà K9 đã hứa với khách hàng.

7. Ngoài phạm vi (out of scope) — phiên bản 1

Không phải hệ thống quản lý chất lượng toàn diện (BSC, ISO 9001, EFQM).
Không thay thế Moodle / LMS hay HRM.
Không chấm bài sinh viên (đã có LMS-AI9 đảm nhiệm).
Không xây dựng đề cương học phần (đã có DCHP / DGDCHP2 đảm nhiệm) — chỉ tiêu thụ kết quả qua API.
Không phải công cụ thiết kế chương trình đào tạo (sẽ là AI-CTĐT ở giai đoạn sau).

8. Tích hợp với hệ sinh thái UAE18 sẵn có

Lấy dữ liệu đề cương từ DCHP / DGDCHP2 → làm minh chứng cho tiêu chí về CTĐT.
Lấy dữ liệu đánh giá giáo trình từ AI-ĐGGT → minh chứng tiêu chí học liệu.
Lấy dữ liệu đề tài NCKH và bài báo Scopus → minh chứng tiêu chí NCKH.
Lấy dữ liệu dashboard từ LMS-AI9 (early warning, dashboard tổng) → minh chứng tiêu chí kết quả học tập.
Lưu trữ minh chứng song song với UniDrive (khi có).

9. Phần để Claude Code tự quyết
Mô tả này cố tình chừa các quyết định kỹ thuật chi tiết cho khâu triển khai. Cụ thể:

Lựa chọn stack frontend (React / Next / Vue), backend (Node / Python / Go), database (Postgres / Firestore / MongoDB), vector store (pgvector / Pinecone / Weaviate / Qdrant).
Schema cụ thể của database, cấu trúc collection/table, index.
Prompt engineering cho từng module AI (đặc biệt module 4 viết SAR và module 5 critic).
Chiến lược chunking, embedding model, RAG pipeline cho tài liệu minh chứng dài.
Thiết kế UI/UX cụ thể — chỉ cần đảm bảo nguyên tắc: rõ ràng, ít click, dễ dùng cho cán bộ không chuyên IT.
Cơ chế caching gọi LLM để tối ưu chi phí.
Hạ tầng triển khai cụ thể (Cloud Run, Vercel, AWS, hay tự host).
Chiến lược authentication (Google SSO, Azure AD của trường, hay riêng).
Cấu trúc repo, CI/CD, monitoring, logging.
Bộ test, dữ liệu mẫu để demo.


Mục tiêu MVP (gợi ý): chạy được end-to-end Module 1 + Module 2 + Module 3 + Module 4 cho 1 bộ tiêu chuẩn (AUN-QA cấp chương trình) với kho minh chứng quy mô ~1000 file. Module 5, 6, 7 ở phiên bản kế tiếp.
---

> File này là tham chiếu mặc định cho mọi phiên Claude làm việc trên repo. Đọc
> hết trước khi viết dòng code đầu tiên. Nếu nội dung mâu thuẫn với prompt
> tức thời của user, hỏi lại trước khi tiến hành.

---

## 0. Mỗi session bắt buộc làm theo thứ tự này

1. Mở **CLAUDE.md** (file này) đọc hết, đặc biệt mục "Project-specific
   configuration" cuối file.
2. Mở **`_reference/README.md`** → bản đồ 3 app mẫu (DGDCHP2, AIMEET, CBTS).
   Code mẫu **đã ở ngay trong repo** dưới `_reference/<APP>/lib/`,
   `_reference/<APP>/api/`, `_reference/<APP>/ui/` — không cần đi ra
   `C:\dev\templates\<APP>/`. Chọn app gần nhất với app mới đang build
   rồi đọc README trong sub-folder đó để biết file nào cần xem trước.
3. Mở **`docs/SETUP.md`** nếu đây là lần đầu touch repo (kiểm tra Firebase,
   Secret Manager, GitHub đã setup chưa).
4. Liệt kê file đã đọc + đề xuất plan ngắn (5-8 dòng): file structure, route
   chính, Firestore collections, chiến lược xử lý dữ liệu lớn (chunking,
   streaming...). **Không code ở bước này.**
5. Chờ user confirm plan. Sau khi confirm mới scaffold + build feature theo
   thứ tự cam kết, mỗi feature một commit theo chuẩn conventional, dừng để
   user test localhost trước khi sang feature kế tiếp.

---

## 1. Stack bắt buộc (không tự ý đổi)

| Lớp | Lựa chọn | Ghi chú |
|---|---|---|
| Framework | **Next.js 14.2.18** App Router, TypeScript strict, Server Components ưu tiên | Đồng bộ với 18 app trong hệ sinh thái |
| UI | **Tailwind CSS** + **shadcn/ui** (Radix primitives) | Reuse `globals.css` utility classes (`btn-primary`, `card`, `score-pill`...) |
| Backend platform | **Firebase App Hosting**, region **`asia-southeast1`** | Cloud Run dưới mui xe; rollout từ branch `main` |
| Database | **Firestore Native mode**, region `asia-southeast1` | Mọi ghi đi qua Admin SDK |
| Storage | **Firebase Storage**, bucket `<project>.appspot.com` | Path `uploads/{ownerId}/...`, max 50 MB |
| Auth | **Firebase Auth** Google provider + server session cookie | Xem mục 2 |
| AI | **Anthropic Claude** (`@anthropic-ai/sdk`), default `claude-sonnet-4-6` | Server-side ONLY |
| File parsing | **mammoth** (DOCX), **pdf-parse** (PDF) | Server-side, có fallback text |
| Export | **docx** + **pdfkit** | Cần DejaVu font cho tiếng Việt trong PDF |
| Validation | **zod** ở mọi route handler / server action | Không trust input |

Các package KHÔNG dùng: `firebase-functions` (đã chuyển sang App Hosting),
`next-auth` (đã có Firebase Auth), `axios` (dùng `fetch` native).

---

## 2. Auth pattern — Google sign-in + session cookie

Pipeline cố định, đừng tự sáng tạo cách khác:

1. Client (`'use client'`) sign-in với `signInWithPopup(auth, googleProvider)`,
   lấy `idToken` qua `cred.user.getIdToken(true)`.
2. POST `/api/auth/session` với body `{ idToken }`. Route:
   - `zod` validate `idToken` non-empty.
   - `adminAuth.verifyIdToken(idToken, true)` (check revoked).
   - Reject nếu `auth_time` cũ hơn 5 phút.
   - `adminAuth.createSessionCookie(idToken, { expiresIn: 14 days })`.
   - Set cookie tên `__session`: `httpOnly`, `sameSite: 'lax'`, `secure` ở
     production, `path: '/'`, `maxAge: 14 days`.
3. Server components / route handlers dùng `getCurrentUser()` (đọc cookie qua
   `cookies()` từ `next/headers`, verify bằng
   `adminAuth.verifySessionCookie(value, true)`).
4. Sign-out: DELETE `/api/auth/session` (xoá cookie). KHÔNG revoke refresh
   token mặc định để các thiết bị khác giữ session.

Pattern đã chạy production ở DGDCHP2 và textbook-review. Khi touch auth, ưu
tiên đọc `src/lib/auth.ts` + `src/app/api/auth/session/route.ts` của 2 app
đó trước khi sửa.

---

## 3. Claude API pattern — server-side, kiểm soát chi phí

**Quy tắc bất di bất dịch**:
- `ANTHROPIC_API_KEY` chỉ tồn tại server-side (`process.env.ANTHROPIC_API_KEY`).
  KHÔNG bao giờ bundle vào client. Không pass key qua `NEXT_PUBLIC_*`.
- Trước MỖI lần gọi Claude:
  - Validate input length `>= MIN_CONTENT_LENGTH` (50) — input ngắn hơn
    gần như chắc chắn là user gõ nhầm, gọi Claude tốn token vô ích.
  - Check rate limit: query `usage_logs` cho `ownerId`, nếu vượt
    `RATE_LIMIT_PER_HOUR` (5) hoặc `RATE_LIMIT_PER_DAY` (30) → reject 429
    với message tiếng Việt thân thiện.
- Sau MỖI lần gọi (success/error đều log):
  - Insert vào `usage_logs/{auto-id}`: `{ ownerId, route, model, tokensIn,
    tokensOut, costUsd, latencyMs, status, errorCode? }`.
  - **KHÔNG** log nội dung user upload (giáo trình, audio transcript,
    document...). Chỉ log metadata.
- Error handling: wrap mọi call trong helper `describeClaudeError(e)` trả về
  message tiếng Việt cho 401, 404, 429, 5xx, timeout, connection error.
  Không leak raw stack về client.
- Timeout SDK: `timeout: 240_000` ms, `maxRetries: 1`. Cloud Run timeout
  cap ở 540s — để headroom 240s/call cho retries trong cùng 1 request.

`src/lib/claude.ts` đã đóng gói pattern; route handler chỉ gọi
`evaluateXxx(...)` chứ không tự gọi `messages.create` trực tiếp.

---

## 4. Firestore Rules pattern — ownerId === request.auth.uid

Mọi document đều có field `ownerId: string` (UID người tạo). Rules mặc định
deny, mở từng collection theo cùng pattern:

```
function isAuthenticated() { return request.auth != null; }
function isOwner(ownerId)  { return isAuthenticated() && request.auth.uid == ownerId; }

match /[collection]/{docId} {
  allow read:                if isOwner(resource.data.ownerId);
  allow create:              if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
  allow update, delete:      if isOwner(resource.data.ownerId);
}
```

Server (Admin SDK) bypass rules; client SDK CHỈ dùng cho Auth. Rules này
là **defence-in-depth** — đừng dùng client SDK để write vì kém hiệu quả và
dễ bị racy.

`usage_logs/` là immutable: cho phép `create` nếu `userId === uid`, cấm
`update`/`delete`.

---

## 5. Secret Manager pattern (apphosting.yaml)

**Không bao giờ** dùng `value:` cho credential thật trong `apphosting.yaml`.
Chỉ dùng `value:` cho config public (project ID, model name, region...).
Mọi key, JSON, token đi qua Secret Manager:

```yaml
# OK — credential
- variable: ANTHROPIC_API_KEY
  secret: ANTHROPIC_API_KEY        # tên secret trên Secret Manager
  availability: [RUNTIME]

# OK — config public
- variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
  value: [TEN-PROJECT-FIREBASE]
  availability: [BUILD, RUNTIME]
```

Tạo secret:
```
firebase apphosting:secrets:set ANTHROPIC_API_KEY
firebase apphosting:secrets:grantaccess ANTHROPIC_API_KEY --backend [TEN-APP-O-DAY]
```

Quên `grantaccess` → build OK nhưng container start fail vì không đọc được
secret.

---

## 6. File parsing pattern — DOCX/PDF + fallback

`src/lib/parseFile.ts` (sẽ thêm khi cần):
- DOCX → `mammoth.extractRawText({ buffer })`.
- PDF → `require('pdf-parse/lib/pdf-parse.js')` (TUYỆT ĐỐI dùng
  `require` form này, không `import 'pdf-parse'`; `index.js` của
  pdf-parse có side effect chạy test mode khi import bình thường, sẽ
  crash production).
- TXT/MD → `buffer.toString('utf8')`.
- Mọi nhánh đều `.trim()` rồi check empty; nếu rỗng → trả message
  "File rỗng hoặc không đọc được, vui lòng paste nội dung trực tiếp" và
  cho user nhập textarea fallback. KHÔNG crash route.

PDF với phông tiếng Việt: nếu xuất ra (pdfkit), nhớ
`apk add ttf-dejavu` trong Dockerfile + đăng ký font qua
`doc.registerFont('Body', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')`.

---

## 7. Long-running tasks pattern

Khi tổng thời gian > 10 giây (đánh giá giáo trình dài, tổng hợp transcript
nhiều giờ...):

1. Tách thành sub-task có thể chạy song song (chunk theo chương / theo
   cụm 5 phút audio...). Ghi mỗi sub-task thành 1 document trong Firestore
   (`chunks/`, `segments/`...) **trước khi** kick off Claude calls — giúp
   resume sau lỗi.
2. Cap concurrency 3 với `p-limit` để né rate-limit Anthropic.
3. Stream progress về client qua SSE: `event: chunk`, `event: done`,
   `event: error`. Client hiển thị progress bar by id, không spinner mù.
4. Aggregate call cuối CHỈ dùng summary + scores từ các chunk, **không**
   gửi lại raw text — vừa tiết kiệm token vừa tránh vượt context window.
5. App Hosting timeout cứng 540s (`timeoutSeconds: 540` trong
   `apphosting.yaml`); SDK Anthropic 240s/call → tổng cùng 1 HTTP request
   không vượt được 540s. Nếu task lâu hơn, dùng
   "trigger background job + polling status" pattern thay vì giữ HTTP request.

---

## 8. Anti-patterns — 8 lỗi đã thực sự gặp ở UAE18

Đừng lặp lại:

1. **Thiếu `public/` folder** → Docker COPY fail ở `COPY --from=builder
   /app/public ./public`. **Luôn** tạo `public/.gitkeep` từ commit đầu.
2. **`empty content` 400 từ Anthropic** vì lười validate input client-side.
   Server check `>= 50 chars` trước khi tốn 1 round-trip.
3. **Hardcode `sk-ant-...` trong code** (cả khi commit nhánh dev). Mỗi PR
   phải scan `sk-ant-`, `AIza`, `ya29.` trước khi push.
4. **`value:` cho credential trong apphosting.yaml**. Build vẫn pass nhưng
   key xuất hiện trên dashboard, ai đọc được logs đều copy được.
5. **Stack PR / branch chồng nhau**. Mỗi feature một PR thẳng vào `main`,
   merge xong tạo branch mới. Không làm chuỗi PR phụ thuộc lẫn nhau —
   App Hosting auto-deploy main, mọi PR chồng đều vô tác dụng cho deploy.
6. **`firestore.rules` để mở `allow read, write: if true`** "tạm thời rồi
   sửa". Lần đầu deploy = lần đầu user external scrape DB. Mặc định luôn
   `if false` rồi mở từng collection theo `ownerId`.
7. **Không rate-limit / không log usage**. Một test loop client-side là
   user đã đốt $50 Claude credit trong 1 đêm. Bắt buộc check `usage_logs`
   trước call.
8. **Quên `timeoutSeconds: 540` + retry SDK quá tham lam** → Cloud Run kill
   socket giữa chừng, user thấy "Connection error" mơ hồ. SDK timeout
   240s + 1 retry, Cloud Run 540s — header rõ.

---

## 9. Reference apps (đọc khi cần pattern cụ thể)

| App | Production | Pattern đáng đọc | File chốt (trong `_reference/`) |
|---|---|---|---|
| **DGDCHP2** | https://dgdchp2--dgdchp2.asia-southeast1.hosted.app/ | Đánh giá DOCX/PDF + revision flow | `_reference/DGDCHP2/lib/parseFile.ts`, `evaluator.ts`, `exporters.ts`, `_reference/DGDCHP2/api/evaluate.route.ts` |
| **AIMEET** | https://aimeet--meet2-afb35.asia-southeast1.hosted.app/ | Web Speech API + chunked transcript + task extraction | `_reference/AIMEET/ui/Recorder.tsx`, `_reference/AIMEET/api/transcribe.route.ts`, `tasks.route.ts` |
| **CBTS** | https://cbts--cbts-e6b0e.asia-southeast1.hosted.app/ | RAG chatbot + streaming chat UI | `_reference/CBTS/api/chat.route.ts`, `_reference/CBTS/lib/knowledge.ts`, `_reference/CBTS/ui/ChatWidget.tsx` |

Code mẫu nằm sẵn trong repo dưới `_reference/<APP>/`, đã được loại trừ khỏi
build (`tsconfig.json`), lint (`.eslintignore`), Docker (`.dockerignore`).
**KHÔNG sửa file trong `_reference/`** — coi như read-only snapshot. Mỗi
sub-folder có README riêng liệt kê pattern đáng đọc + gotcha cụ thể.

---

## 10. Code quality

- TypeScript **strict** trên toàn repo (`tsconfig.json` đã set). Không tắt
  `strictNullChecks` cho file riêng.
- **Cấm `any`**. Dùng `unknown` rồi narrow, hoặc tạo interface chính xác.
- **Cấm magic strings** — collection names, route paths, criterion ids đều
  ở `src/lib/constants.ts` hoặc enum. Cấm gõ `'usage_logs'` vào nhiều file.
- Mọi route handler / server action **phải** validate input bằng zod ngay
  đầu hàm. Trả 400 với message tiếng Việt nếu fail.
- **Không** export default function 100+ dòng. Tách thành sub-component
  với props rõ ràng.
- Comment trong code: chỉ viết khi giải thích **lý do** (vì sao chọn
  approach này, hoặc cảnh báo edge case). Không lặp lại tên hàm thành
  comment.

---

## 11. Auto-commit rules

- Sau mỗi đơn vị công việc hoàn chỉnh (feature build xong, test localhost
  pass) → commit ngay, không gom nhiều feature vào 1 commit.
- **Trước commit luôn scan**:
  - `git diff --cached --name-only` không chứa `.env`, `.env.local`,
    `service-account*.json`, `firebase-adminsdk*.json`,
    `application_default_credentials.json`.
  - `git diff --cached -U0` không match `sk-ant-[A-Za-z0-9_-]{30,}`,
    `AIza[A-Za-z0-9_-]{30,}`, `ya29\.[A-Za-z0-9_-]{30,}`.
- **Conventional commit format** (luôn dùng):
  - `feat(scope): mô tả ngắn` — tính năng mới
  - `fix(scope): mô tả` — sửa lỗi
  - `chore: mô tả` — config, dependency, refactor không thay behavior
  - `docs: mô tả` — README, CLAUDE.md
  - `refactor(scope): mô tả` — refactor không đổi behavior
- Body commit (nếu có): bullet list các thay đổi đáng nhớ + lý do.

---

## 12. Branch + PR strategy

- `main` là default + branch deploy. Mỗi push vào `main` triggers App
  Hosting rollout.
- Feature → branch `feat/<short-name>` → PR vào `main` → review (hoặc
  self-review nếu solo) → merge.
- **KHÔNG stack PR**. Một PR phụ thuộc PR khác chưa merge = sai.
  Rebase `feat/...` lên main mới mở PR.
- Squash merge mặc định (giữ commit history `main` sạch).
- Trước khi merge: CI workflow phải pass (`typecheck` + `build`).

---

## 13. Cost monitoring

- **Budget alerts** trong GCP Billing: cảnh báo 50%, 80%, 100% ngân sách
  tháng. Mỗi app UAE18 default $50/tháng — vượt nghĩa là có loop rò.
- **Rate limit** trong code (mục 3). Default 5/giờ + 30/ngày là sàn an toàn;
  app cụ thể có thể nâng nếu cần.
- **`usage_logs/` collection** là single source of truth cho cost. Có
  query helper trong `src/lib/usage.ts` (sẽ thêm theo nhu cầu) để
  tính tổng `costUsd` 24h, 7d, 30d.
- **Firebase App Check** bật cho Auth + Firestore + Storage:
  reCAPTCHA v3 site key qua `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`,
  client-side init lazy (xem `src/lib/firebase.ts`).
- Server route nặng cost (Claude calls): yêu cầu Auth qua
  `requireAuth(request)` ở dòng đầu. Không có auth = 401 ngay, không
  tốn token.

---

## 14. Project-specific configuration

> **EDIT MÌNH SECTION NÀY khi tạo app mới từ template.** Mọi giá trị
> trong dấu `[...]` cần thay bằng giá trị thật.

- **Tên app**: `aikdcl`
- **Mục đích**: Quản lý minh chứng kiểm định + sinh báo cáo tự đánh giá (SAR)
  cho các trường đại học theo AUN-QA, MOET, ABET, FIBAA, CDIO.
- **Firebase project ID**: `aikdcl` (region `asia-southeast1`)
- **Tên backend App Hosting**: `aikdcl`
- **GitHub repo**: `https://github.com/thoannv1976/aikdcl`
- **Production URL**: `https://aikdcl--aikdcl.asia-southeast1.hosted.app/`
- **Reference app gần nhất**: `DGDCHP2` — cùng pattern upload tài liệu →
  parse → Claude → kết quả structured → export.
- **Firestore collections**: `programs`, `evidences`, `usage_logs`
- **Storage paths**: `uploads/{ownerId}/{programId}/{fileName}`
- **Rate limit**: default 5/giờ + 30/ngày
- **Claude model**: `claude-sonnet-4-6`
- **Long-running**: Có ở pha 2 (sinh SAR theo tiêu chí, song song `p-limit(3)`).
  MVP pha 1 chỉ tag minh chứng nên không long-running.
- **MVP pha 1 (đã build)**: Module 1 (kho minh chứng + AI metadata + tag
  tiêu chí), Module 2 (thư viện AUN-QA v4 + MOET TT04), Module 3 (ma trận
  tiêu chí × minh chứng). Module 4–7 ở pha sau.
