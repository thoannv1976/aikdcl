// =============================================================================
// Shared TypeScript types. Mở rộng theo domain của app cụ thể (vd: thêm
// TextbookDoc cho textbook-review, MeetingDoc cho aimeet...).
// =============================================================================

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

// Mọi document Firestore của UAE18 đều có 4 trường gốc này.
export interface OwnedDoc {
  id?: string;
  ownerId: string;
  createdAt?: string; // ISO string, server-generated
  updatedAt?: string;
}

export interface UsageLogDoc extends OwnedDoc {
  // Lưu ý: usage_logs dùng `userId` thay vì `ownerId` để khớp rules
  // (immutable audit log). Khi tạo doc, set cả ownerId === userId.
  userId: string;
  route: string; // vd: 'POST /api/evaluate'
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  costUsd?: number;
  latencyMs?: number;
  status: 'ok' | 'error';
  errorCode?: string;
}

// Tiện cho route handlers / SSE.
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string; status?: number };

// =============================================================================
// AIKDCL — domain models
// =============================================================================

import type { EvidenceStatus, StandardId } from './constants';

export interface ProgramDoc extends OwnedDoc {
  name: string;
  code?: string;
  level?: 'undergraduate' | 'graduate' | 'doctoral';
  faculty?: string;
  standardId: StandardId;
  cohort?: string; // vd: "khóa 2020-2024"
  description?: string;
  evidenceCount?: number;
}

export interface EvidenceMetadata {
  title?: string;
  issuedAt?: string; // ISO date "yyyy-mm-dd"
  unit?: string; // đơn vị ban hành
  docCode?: string; // mã văn bản
  summary?: string;
  language?: 'vi' | 'en' | 'other';
}

export interface EvidenceDoc extends OwnedDoc {
  programId: string;
  fileName: string;
  storagePath: string; // gs path
  contentType: string;
  size: number;
  contentText?: string; // text extracted, max ~50k chars stored
  metadata: EvidenceMetadata;
  /** Tag AI gợi ý (criterionId) — user duyệt qua approvedCriteria. */
  suggestedCriteria: string[];
  /** Tiêu chí user xác nhận — chỉ những tag này tính vào ma trận. */
  approvedCriteria: string[];
  status: EvidenceStatus;
  errorMessage?: string;
}

// =============================================================================
// Standards (Module 2)
// =============================================================================

export interface CriterionDef {
  id: string; // unique trong standard, vd "1.1", "C1.1"
  text: string;
  description?: string;
  /** Loại minh chứng đề xuất nên thu thập. Hint cho AI lúc tag. */
  evidenceHints?: string[];
}

export interface StandardSection {
  id: string; // vd "1", "C1"
  name: string;
  description?: string;
  criteria: CriterionDef[];
}

export interface StandardDef {
  id: StandardId;
  name: string;
  shortName: string;
  version: string;
  description: string;
  /** Thang điểm tự đánh giá; AUN-QA = 1-7, MOET = 1-7. */
  scoreScale: { min: number; max: number; labels?: Record<number, string> };
  sections: StandardSection[];
}

// =============================================================================
// Matrix (Module 3)
// =============================================================================

export interface MatrixCell {
  criterionId: string;
  evidenceIds: string[];
}

export interface MatrixRow {
  sectionId: string;
  sectionName: string;
  criteria: {
    criterionId: string;
    criterionText: string;
    evidenceIds: string[];
  }[];
}

export interface MatrixData {
  programId: string;
  standardId: StandardId;
  rows: MatrixRow[];
  totalCriteria: number;
  coveredCriteria: number;
  missingCriteria: string[]; // ids chưa có evidence
}

// =============================================================================
// SAR — Self-Assessment Report (Module 4)
// =============================================================================

export interface SarEvidenceRef {
  evidenceId: string;
  fileName: string;
  docCode?: string;
  /** Trích đoạn / lý do đối chiếu (do AI tóm tắt). */
  quote?: string;
}

export interface SarSectionDraft {
  sectionId: string; // mã tiêu chuẩn (vd "1", "TC3")
  sectionName: string;
  criterionId: string;
  criterionText: string;
  /** Mô tả hiện trạng — 4-8 câu, văn phong học thuật. */
  description: string;
  /** Đối chiếu các minh chứng đã duyệt cho tiêu chí này. */
  evidenceRefs: SarEvidenceRef[];
  strengths: string[];
  weaknesses: string[];
  /** Mức tự đánh giá theo thang điểm của bộ chuẩn (1-7 cho AUN-QA + MOET). */
  selfScore: number;
  selfScoreRationale: string;
  /** True nếu tiêu chí KHÔNG có minh chứng — AI sẽ note "thiếu minh chứng". */
  hasNoEvidence: boolean;
}

export interface SarReportDoc extends OwnedDoc {
  programId: string;
  programName: string;
  standardId: StandardId;
  sections: SarSectionDraft[];
  overallScore: number;
  /** % tiêu chí có ít nhất 1 minh chứng. */
  coveragePct: number;
  status: 'ready' | 'error';
  errorMessage?: string;
  model?: string;
  /** Thời gian tổng tính bằng ms để tham khảo. */
  generationTimeMs?: number;
}
