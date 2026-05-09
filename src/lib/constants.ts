// =============================================================================
// UAE18 constants — single source of truth cho rate limit, file size, model.
// Tất cả code khác phải import từ đây thay vì hardcode magic strings.
// =============================================================================

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'AIKDCL';

// ----- Claude / Anthropic -----
export const CLAUDE_MODEL =
  process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

// Output cap an toàn — tăng nếu app cần response dài hơn (luôn nhỏ hơn cap
// thực tế của model để tránh truncation lỗi không rõ).
export const CLAUDE_MAX_TOKENS = 4096;

// ----- Rate limit -----
// Default sàn an toàn cho UAE18 app. App cụ thể có thể nâng qua env hoặc
// override cấu hình trong route handler.
export const RATE_LIMIT_PER_HOUR = Number(
  process.env.RATE_LIMIT_PER_HOUR ?? 5,
);
export const RATE_LIMIT_PER_DAY = Number(
  process.env.RATE_LIMIT_PER_DAY ?? 30,
);

// ----- Input validation -----
// Input ngắn hơn ngưỡng này gần như chắc chắn là user gõ nhầm; reject sớm
// để khỏi tốn 1 round-trip Claude.
export const MIN_CONTENT_LENGTH = 50;

// ----- Upload constraints -----
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
] as const;

export const SUPPORTED_FILE_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.txt',
  '.md',
] as const;

// ----- Auth / session -----
export const SESSION_COOKIE = '__session';
export const SESSION_COOKIE_MAX_AGE_DAYS = 14;
export const SESSION_COOKIE_MAX_AGE_MS =
  SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

// ----- Firestore collections -----
export const COL = {
  usageLogs: 'usage_logs',
  programs: 'programs',
  evidences: 'evidences',
} as const;

// ----- Standards -----
// IDs của bộ tiêu chuẩn được seed sẵn trong src/lib/standards.ts.
export const STANDARD_IDS = {
  aunQaV4: 'aun-qa-v4',
  moetTt04: 'moet-tt04',
} as const;
export type StandardId = (typeof STANDARD_IDS)[keyof typeof STANDARD_IDS];

// ----- Evidence status -----
export const EVIDENCE_STATUS = {
  pending: 'pending', // mới upload, chờ AI tag
  tagged: 'tagged', // đã có tag AI gợi ý
  approved: 'approved', // user duyệt tag
} as const;
export type EvidenceStatus =
  (typeof EVIDENCE_STATUS)[keyof typeof EVIDENCE_STATUS];
