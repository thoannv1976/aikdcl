# Hướng dẫn deploy AIKDCL lên Firebase App Hosting

Tài liệu này hướng dẫn deploy AIKDCL lên Firebase App Hosting (region
`asia-southeast1`). App đã sẵn sàng — chỉ cần làm theo 6 bước.

> **Tiền đề**: bạn đã làm các bước 1-6 trong CLAUDE.md mục "Lưu ý":
> Firebase project `aikdcl` đã tạo, Firestore + Storage + Authentication +
> App Hosting backend đã connect với GitHub repo `thoannv1976/aikdcl`,
> đã nâng cấp Blaze.

---

## Bước 1 — Cài Firebase CLI và đăng nhập

```bash
# Cài CLI nếu chưa có
npm install -g firebase-tools

# Đăng nhập (mở browser)
firebase login

# Chọn project mặc định
firebase use aikdcl
```

Kiểm tra:
```bash
firebase projects:list   # phải thấy aikdcl
gcloud auth list         # phải thấy account đăng nhập
```

---

## Bước 2 — Lấy thông tin web app từ Firebase Console

1. Mở [Firebase Console → Project settings → Your apps](https://console.firebase.google.com/u/0/project/aikdcl/settings/general).
2. Nếu chưa có web app, bấm **Add app → Web (</>)** → đặt nickname (vd `aikdcl-web`).
3. Copy các giá trị sau (sẽ dùng ở bước 3):
   - `apiKey` (AIza...)
   - `messagingSenderId` (vd `1056300284274`)
   - `appId` (vd `1:1056300284274:web:abc123...`)

Bật **Authentication → Sign-in method → Google** nếu chưa bật.

---

## Bước 3 — Tạo secrets trên Google Secret Manager

Chạy lần lượt — CLI sẽ hỏi giá trị, dán vào (giá trị KHÔNG hiển thị trên
console nên an tâm về bảo mật):

```bash
firebase apphosting:secrets:set ANTHROPIC_API_KEY
# Dán: sk-ant-api03-... (từ https://console.anthropic.com)

firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
# Dán: AIza... (apiKey từ bước 2)

firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# Dán: 1056300284274

firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID
# Dán: 1:1056300284274:web:...

firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY
# Optional. Nếu chưa cần App Check, dán giá trị "" (chuỗi rỗng) để khỏi build fail.
```

**Service account JSON** (cho Firebase Admin SDK chạy trên container):

```bash
# 1) Tạo service account key từ Google Cloud Console:
#    IAM & Admin → Service Accounts → "firebase-adminsdk-XXX@aikdcl.iam.gserviceaccount.com"
#    → Keys → Add key → JSON → tải về.
# 2) Mở file JSON, copy NGUYÊN nội dung dưới dạng 1 dòng (escape " thành \") rồi:
firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_JSON
# Dán nội dung JSON vào.
```

> **Mẹo**: với JSON nhiều dòng, dùng `cat key.json | jq -c` để compact thành
> 1 dòng trước khi paste.

---

## Bước 4 — Grant access secrets cho backend App Hosting

**BẮT BUỘC** — quên bước này thì build OK nhưng container start fail vì
không đọc được secret.

```bash
for s in \
  ANTHROPIC_API_KEY \
  FIREBASE_SERVICE_ACCOUNT_JSON \
  NEXT_PUBLIC_FIREBASE_API_KEY \
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
  NEXT_PUBLIC_FIREBASE_APP_ID \
  NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY
do
  firebase apphosting:secrets:grantaccess $s --backend aikdcl
done
```

Backend ID `aikdcl` đã ghi sẵn trong `apphosting.yaml`. Nếu khi connect bạn
đặt tên khác, thay `aikdcl` thành tên đúng.

---

## Bước 5 — Deploy Firestore rules + indexes + Storage rules

```bash
firebase deploy \
  --only firestore:rules,firestore:indexes,storage \
  --project aikdcl
```

Kết quả mong đợi:
```
✔ firestore: released rules firestore.rules to cloud.firestore
✔ firestore: deployed indexes in firestore.indexes.json successfully for ...
✔ storage: released rules storage.rules to firebase.storage
```

**Lưu ý**: indexes có thể mất vài phút để build xong. Trong lúc đó query
liên quan sẽ trả lỗi "needs index" — đợi rồi reload.

---

## Bước 6 — Trigger first rollout

App Hosting đã connect với branch `main` trên GitHub repo. Mỗi commit push
vào `main` sẽ tự build + deploy. Trigger lần đầu:

```bash
git push origin main
```

Theo dõi rollout:
- Firebase Console → **Build → App Hosting → aikdcl** → tab **Rollouts**.
- Hoặc CLI: `firebase apphosting:rollouts:list --backend aikdcl`.

Khi status `SUCCESS`, copy URL App Hosting (dạng
`https://aikdcl--aikdcl.asia-southeast1.hosted.app/`).

---

## Bước 7 — Bổ sung domain vào Authorized domains

Sau lần rollout đầu, Firebase Auth sẽ chặn domain mới. Thêm domain:

1. Firebase Console → **Authentication → Settings → Authorized domains**.
2. **Add domain** → `aikdcl--aikdcl.asia-southeast1.hosted.app`.

`localhost` đã có sẵn cho dev.

---

## Smoke test

1. Mở `https://aikdcl--aikdcl.asia-southeast1.hosted.app/` → bị redirect `/login`.
2. Đăng nhập Google → quay về trang chủ với badge avatar.
3. Vào **Bộ tiêu chuẩn** → thấy 2 bộ AUN-QA v4 + MOET TT04.
4. **+ Chương trình mới** → tạo 1 program test.
5. Vào trang chi tiết → upload 1 file PDF/DOCX có tiếng Việt → đợi vài
   giây → thấy AI gợi ý tiêu chí → tick + Lưu.
6. Mở **Ma trận đối chiếu** → thấy tiêu chí đã có minh chứng + cảnh báo
   tiêu chí thiếu.

---

## Nếu rollout fail

| Lỗi thường gặp | Cách xử lý |
|---|---|
| `Container failed to start: secret X not found` | Quên `grantaccess` ở bước 4. Chạy lại lệnh tương ứng. |
| `auth/unauthorized-domain` khi đăng nhập | Quên thêm domain ở bước 7. |
| `FIREBASE_SERVICE_ACCOUNT_JSON không phải JSON hợp lệ` | JSON paste bị xuống dòng / lệch escape. Compact lại bằng `jq -c`. |
| Trang upload báo "needs index" | Indexes chưa build xong — đợi 2-5 phút. |
| AI không gợi ý tiêu chí | Check Anthropic credit + console.log của container trên Cloud Run. |

---

## Sau deploy — phòng tránh đốt token

1. **Budget alert** — GCP Billing → Budgets & alerts → tạo budget $50/tháng,
   alert ở 50%/80%/100%.
2. Theo dõi `usage_logs/` trong Firestore để xem lượt gọi Claude theo user.
3. Rate limit mặc định 5/giờ + 30/ngày — tăng qua env var
   `RATE_LIMIT_PER_HOUR` / `RATE_LIMIT_PER_DAY` trong `apphosting.yaml`
   (mục `value:`) khi cần.

---

## Pha 2 (sẽ làm sau)

- Module 4 — Sinh SAR tự động cho từng tiêu chí (Promise.all + p-limit 3).
- Module 5 — Critic Mode (AI phản biện ngược SAR).
- Module 6 — Quản lý kế hoạch cải tiến (CI plan).
- Module 7 — Export DOCX/PDF SAR đầy đủ + gói minh chứng ZIP.
