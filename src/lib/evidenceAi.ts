import 'server-only';
import { runClaude, extractJson } from './claude';
import { listCriteria, getStandard } from './standards';
import type { StandardId } from './constants';
import type { EvidenceMetadata } from './types';

// =============================================================================
// AIKDCL — AI tagging cho minh chứng (Module 1).
// 1 lần gọi Claude duy nhất cho mỗi file, trả:
//   - metadata (title, issuedAt, unit, docCode, summary, language)
//   - suggestedCriteria: danh sách criterionId mà file này có thể phục vụ.
// User sẽ duyệt thủ công trước khi tag được tính vào ma trận.
// =============================================================================

export interface EvidenceAiResult {
  metadata: EvidenceMetadata;
  suggestedCriteria: string[];
}

interface RawAiOutput {
  metadata?: {
    title?: string;
    issuedAt?: string;
    unit?: string;
    docCode?: string;
    summary?: string;
    language?: string;
  };
  suggestedCriteria?: string[];
}

export async function analyzeEvidence(opts: {
  userId: string;
  standardId: StandardId;
  fileName: string;
  contentText: string;
}): Promise<EvidenceAiResult> {
  const standard = getStandard(opts.standardId);
  const criteria = listCriteria(opts.standardId);

  const criteriaList = criteria
    .map(
      (c) =>
        `- ${c.criterion.id} | ${c.sectionName} → ${c.criterion.text}` +
        (c.criterion.evidenceHints?.length
          ? ` [gợi ý: ${c.criterion.evidenceHints.join(', ')}]`
          : ''),
    )
    .join('\n');

  // Cap nội dung gửi đi tránh nổ token. 30k ký tự ~ 7-10k tokens, dư cho output.
  const content = opts.contentText.slice(0, 30_000);

  const system = `Bạn là chuyên gia kiểm định chất lượng giáo dục đại học Việt Nam, đang phụ trách phân loại minh chứng cho hệ thống AIKDCL. Trả lời chính xác bằng tiếng Việt và CHỈ trả về JSON khi được yêu cầu.`;

  const user = `Bạn nhận một MINH CHỨNG kiểm định (file đã được trích văn bản). Hãy:

1. Trích xuất METADATA của tài liệu (suy luận từ nội dung):
   - title: tiêu đề chính thức
   - issuedAt: ngày ban hành (ISO yyyy-mm-dd, để trống nếu không rõ)
   - unit: đơn vị/cơ quan ban hành
   - docCode: số/mã văn bản (vd "QĐ-123/2024", "NQ-05")
   - summary: tóm tắt 2-4 câu, nêu rõ tài liệu chứng minh điều gì
   - language: "vi" / "en" / "other"

2. Đối chiếu với BỘ TIÊU CHUẨN ${standard.shortName} dưới đây và liệt kê
   suggestedCriteria — các tiêu chí mà tài liệu này có thể PHỤC VỤ làm minh
   chứng. Trả về mảng criterionId (đúng định dạng id trong danh sách). Có
   thể chọn nhiều tiêu chí (multi-label) nếu phù hợp; KHÔNG bịa criterionId
   ngoài danh sách.

CHỈ trả về JSON đúng schema:
{
  "metadata": {
    "title": "<vi>",
    "issuedAt": "yyyy-mm-dd",
    "unit": "<vi>",
    "docCode": "<vi>",
    "summary": "<vi>",
    "language": "vi"
  },
  "suggestedCriteria": ["<criterionId>", "..."]
}

DANH SÁCH TIÊU CHÍ (${criteria.length} mục):
${criteriaList}

TÊN FILE: ${opts.fileName}

NỘI DUNG MINH CHỨNG (đã cắt 30k ký tự nếu dài hơn):
"""
${content}
"""`;

  const result = await runClaude({
    userId: opts.userId,
    route: 'POST /api/evidences/analyze',
    system,
    user,
    maxTokens: 2048,
    skipMinLengthCheck: true, // có thể content text rỗng (PDF scan), vẫn cho qua để xử lý fallback
  });

  const validIds = new Set(criteria.map((c) => c.criterion.id));
  let raw: RawAiOutput;
  try {
    raw = extractJson<RawAiOutput>(result.text);
  } catch {
    return {
      metadata: { language: 'vi' },
      suggestedCriteria: [],
    };
  }

  return {
    metadata: {
      title: raw.metadata?.title?.slice(0, 300),
      issuedAt: normalizeDate(raw.metadata?.issuedAt),
      unit: raw.metadata?.unit?.slice(0, 200),
      docCode: raw.metadata?.docCode?.slice(0, 100),
      summary: raw.metadata?.summary?.slice(0, 1000),
      language: normalizeLanguage(raw.metadata?.language),
    },
    suggestedCriteria: (raw.suggestedCriteria ?? [])
      .filter((id): id is string => typeof id === 'string')
      .filter((id) => validIds.has(id))
      .slice(0, 30),
  };
}

function normalizeDate(s?: string): string | undefined {
  if (!s) return undefined;
  const m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return undefined;
  const [_, y, mo, d] = m;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function normalizeLanguage(s?: string): EvidenceMetadata['language'] {
  if (s === 'vi' || s === 'en') return s;
  if (!s) return undefined;
  return 'other';
}
