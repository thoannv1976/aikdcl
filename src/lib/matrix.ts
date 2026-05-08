import 'server-only';
import { listEvidenceByProgram } from './repo';
import { getStandard } from './standards';
import type { StandardId } from './constants';
import type { MatrixData, MatrixRow } from './types';

/**
 * Build the criterion × evidence matrix for a program.
 * Chỉ tính `approvedCriteria` — không lấy `suggestedCriteria` chưa duyệt
 * (để tránh false positive: AI gợi ý nhưng user chưa đồng ý).
 */
export async function buildMatrix(
  programId: string,
  standardId: StandardId,
): Promise<MatrixData> {
  const [standard, evidences] = await Promise.all([
    Promise.resolve(getStandard(standardId)),
    listEvidenceByProgram(programId),
  ]);

  const evidenceByCriterion = new Map<string, string[]>();
  for (const ev of evidences) {
    if (!ev.id) continue;
    for (const cid of ev.approvedCriteria) {
      const list = evidenceByCriterion.get(cid) ?? [];
      list.push(ev.id);
      evidenceByCriterion.set(cid, list);
    }
  }

  const rows: MatrixRow[] = standard.sections.map((sec) => ({
    sectionId: sec.id,
    sectionName: sec.name,
    criteria: sec.criteria.map((c) => ({
      criterionId: c.id,
      criterionText: c.text,
      evidenceIds: evidenceByCriterion.get(c.id) ?? [],
    })),
  }));

  const totalCriteria = standard.sections.reduce(
    (sum, sec) => sum + sec.criteria.length,
    0,
  );
  const missingCriteria: string[] = [];
  let coveredCriteria = 0;
  for (const row of rows) {
    for (const c of row.criteria) {
      if (c.evidenceIds.length > 0) coveredCriteria++;
      else missingCriteria.push(c.criterionId);
    }
  }

  return {
    programId,
    standardId,
    rows,
    totalCriteria,
    coveredCriteria,
    missingCriteria,
  };
}
