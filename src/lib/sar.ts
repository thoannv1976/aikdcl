import 'server-only';
import pLimit from 'p-limit';
import { runClaude, extractJson, describeClaudeError } from './claude';
import { getStandard } from './standards';
import type { StandardId } from './constants';
import type {
  EvidenceDoc,
  ProgramDoc,
  SarEvidenceRef,
  SarReportDoc,
  SarSectionDraft,
} from './types';

// =============================================================================
// AIKDCL — Module 4: Sinh SAR (Self-Assessment Report) tự động.
//
// Flow:
//   1. Chia chương trình thành N tiêu chí.
//   2. Mỗi tiêu chí gọi Claude 1 lần với (criterion + evidence đã duyệt).
//   3. Song song p-limit(3) — 3 call cùng lúc max, né rate-limit Anthropic
//      đồng thời tổng < 540s App Hosting cap.
//   4. Aggregate điểm trung bình → SarReportDoc.
//
// Pattern reference: _reference/DGDCHP2/lib/evaluator.ts
// =============================================================================

const SAR_CONCURRENCY = 3;

interface SectionInput {
  sectionId: string;
  sectionName: string;
  criterionId: string;
  criterionText: string;
  evidences: EvidenceDoc[];
}

interface RawSarSection {
  description?: string;
  evidenceRefs?: { evidenceId?: string; quote?: string }[];
  strengths?: string[];
  weaknesses?: string[];
  selfScore?: number;
  selfScoreRationale?: string;
}

function buildSectionPrompt(opts: {
  program: ProgramDoc;
  standardName: string;
  scoreScale: { min: number; max: number; labels?: Record<number, string> };
  input: SectionInput;
}): string {
  const { program, standardName, scoreScale, input } = opts;

  const evidenceList =
    input.evidences.length > 0
      ? input.evidences
          .map((ev, i) => {
            const meta = ev.metadata;
            const summary = (meta.summary ?? '').slice(0, 500);
            const docCode = meta.docCode ? ` [${meta.docCode}]` : '';
            const issuedAt = meta.issuedAt ? ` (${meta.issuedAt})` : '';
            const unit = meta.unit ? ` — ${meta.unit}` : '';
            return `${i + 1}. evidenceId="${ev.id}" | "${meta.title || ev.fileName}"${docCode}${issuedAt}${unit}\n   Tóm tắt: ${summary}`;
          })
          .join('\n')
      : '(KHÔNG có minh chứng nào được tag cho tiêu chí này)';

  const scoreLabels =
    scoreScale.labels
      ? Object.entries(scoreScale.labels)
          .map(([k, v]) => `   - ${k}: ${v}`)
          .join('\n')
      : '';

  return `Bạn đang viết một MỤC trong Báo cáo Tự đánh giá (SAR) cho chương trình đào tạo:
- Chương trình: ${program.name}${program.code ? ` (mã ${program.code})` : ''}
- ${program.faculty ? `Khoa: ${program.faculty}\n- ` : ''}${program.cohort ? `Khóa: ${program.cohort}` : ''}
- Bộ tiêu chuẩn: ${standardName}

Tiêu chuẩn ${input.sectionId}: ${input.sectionName}
Tiêu chí ${input.criterionId}: ${input.criterionText}

DANH SÁCH MINH CHỨNG ĐÃ DUYỆT cho tiêu chí này:
${evidenceList}

YÊU CẦU — viết một mục SAR đầy đủ, văn phong học thuật tiếng Việt, súc tích:
1. description: 4-8 câu mô tả hiện trạng việc đáp ứng tiêu chí. Nếu có minh chứng, dẫn chiếu cụ thể (vd: "Theo QĐ-1776..."). Nếu KHÔNG có minh chứng, ghi rõ "Tiêu chí này hiện chưa có minh chứng được thu thập" và đề xuất loại minh chứng cần bổ sung.
2. evidenceRefs: mảng các evidenceId đã sử dụng + trích đoạn 1 câu (quote) nêu lý do đối chiếu. CHỈ dùng evidenceId có trong danh sách trên, KHÔNG bịa.
3. strengths: 1-3 điểm mạnh.
4. weaknesses: 1-3 điểm cần cải tiến (nếu không có minh chứng → ghi rõ "thiếu minh chứng" là 1 weakness).
5. selfScore: số nguyên ${scoreScale.min}–${scoreScale.max} (theo thang điểm của bộ chuẩn).
${scoreLabels}
   Nếu KHÔNG có minh chứng, đề xuất điểm thấp (≤ ${Math.max(scoreScale.min, Math.floor((scoreScale.min + scoreScale.max) / 2) - 1)}).
6. selfScoreRationale: 1-2 câu giải thích vì sao chấm điểm đó.

CHỈ trả về JSON đúng schema:
{
  "description": "<vi>",
  "evidenceRefs": [{"evidenceId": "<id>", "quote": "<vi 1 câu>"}, ...],
  "strengths": ["<vi>", ...],
  "weaknesses": ["<vi>", ...],
  "selfScore": <int>,
  "selfScoreRationale": "<vi>"
}`;
}

async function generateSarSection(opts: {
  userId: string;
  program: ProgramDoc;
  standardName: string;
  scoreScale: { min: number; max: number; labels?: Record<number, string> };
  input: SectionInput;
}): Promise<SarSectionDraft> {
  const { input, scoreScale } = opts;

  const evidenceById = new Map(input.evidences.map((e) => [e.id, e]));
  const fallback: SarSectionDraft = {
    sectionId: input.sectionId,
    sectionName: input.sectionName,
    criterionId: input.criterionId,
    criterionText: input.criterionText,
    description:
      input.evidences.length === 0
        ? 'Tiêu chí này hiện chưa có minh chứng được thu thập trong hệ thống. Cán bộ ĐBCL cần bổ sung trước khi nộp SAR chính thức.'
        : 'AI chưa sinh được mô tả cho tiêu chí này. Vui lòng sinh lại.',
    evidenceRefs: input.evidences.slice(0, 3).map((ev) => ({
      evidenceId: ev.id ?? '',
      fileName: ev.metadata.title || ev.fileName,
      docCode: ev.metadata.docCode,
    })),
    strengths: [],
    weaknesses:
      input.evidences.length === 0
        ? ['Thiếu minh chứng cho tiêu chí này.']
        : [],
    selfScore: scoreScale.min,
    selfScoreRationale: '',
    hasNoEvidence: input.evidences.length === 0,
  };

  try {
    const prompt = buildSectionPrompt(opts);
    const result = await runClaude({
      userId: opts.userId,
      route: 'POST /api/sar',
      system:
        'Bạn là chuyên gia kiểm định chất lượng giáo dục đại học Việt Nam, viết báo cáo tự đánh giá theo chuẩn quốc tế. Văn phong học thuật, chính xác, dẫn chiếu minh chứng cụ thể. Trả lời bằng tiếng Việt và CHỈ trả về JSON khi yêu cầu.',
      user: prompt,
      maxTokens: 2048,
      skipMinLengthCheck: true,
    });

    const raw = extractJson<RawSarSection>(result.text);

    const refs: SarEvidenceRef[] = [];
    for (const r of raw.evidenceRefs ?? []) {
      if (!r.evidenceId) continue;
      const ev = evidenceById.get(r.evidenceId);
      if (!ev) continue;
      refs.push({
        evidenceId: r.evidenceId,
        fileName: ev.metadata.title || ev.fileName,
        docCode: ev.metadata.docCode,
        quote: r.quote?.slice(0, 400),
      });
    }

    const score = clampScore(
      raw.selfScore ?? scoreScale.min,
      scoreScale.min,
      scoreScale.max,
    );

    return {
      sectionId: input.sectionId,
      sectionName: input.sectionName,
      criterionId: input.criterionId,
      criterionText: input.criterionText,
      description: (raw.description ?? '').slice(0, 4000),
      evidenceRefs: refs,
      strengths: cleanList(raw.strengths, 5, 500),
      weaknesses: cleanList(raw.weaknesses, 5, 500),
      selfScore: score,
      selfScoreRationale: (raw.selfScoreRationale ?? '').slice(0, 1000),
      hasNoEvidence: input.evidences.length === 0,
    };
  } catch (e) {
    console.error(`generateSarSection(${input.criterionId}) failed`, e);
    return {
      ...fallback,
      description: `Lỗi sinh mục này: ${describeClaudeError(e)}. Bạn có thể sinh lại sau.`,
    };
  }
}

export async function generateSarReport(opts: {
  userId: string;
  program: ProgramDoc;
  evidences: EvidenceDoc[];
}): Promise<Omit<SarReportDoc, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>> {
  const { program, evidences } = opts;
  const standard = getStandard(program.standardId);

  const evidencesByCriterion = new Map<string, EvidenceDoc[]>();
  for (const ev of evidences) {
    for (const cid of ev.approvedCriteria) {
      const list = evidencesByCriterion.get(cid) ?? [];
      list.push(ev);
      evidencesByCriterion.set(cid, list);
    }
  }

  const inputs: SectionInput[] = [];
  for (const sec of standard.sections) {
    for (const c of sec.criteria) {
      inputs.push({
        sectionId: sec.id,
        sectionName: sec.name,
        criterionId: c.id,
        criterionText: c.text,
        evidences: evidencesByCriterion.get(c.id) ?? [],
      });
    }
  }

  const startedAt = Date.now();
  const limit = pLimit(SAR_CONCURRENCY);
  const sections = await Promise.all(
    inputs.map((input) =>
      limit(() =>
        generateSarSection({
          userId: opts.userId,
          program,
          standardName: standard.shortName,
          scoreScale: standard.scoreScale,
          input,
        }),
      ),
    ),
  );

  const totalCriteria = sections.length;
  const coveredCriteria = sections.filter((s) => !s.hasNoEvidence).length;
  const overallScore = round2(
    sections.reduce((sum, s) => sum + s.selfScore, 0) / Math.max(1, totalCriteria),
  );

  return {
    programId: program.id ?? '',
    programName: program.name,
    standardId: program.standardId as StandardId,
    sections,
    overallScore,
    coveragePct: Math.round((coveredCriteria / Math.max(1, totalCriteria)) * 100),
    status: 'ready',
    model: 'claude-sonnet-4-6',
    generationTimeMs: Date.now() - startedAt,
  };
}

function clampScore(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function cleanList(arr: string[] | undefined, max: number, maxLen: number): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .slice(0, max)
    .map((s) => s.slice(0, maxLen));
}
