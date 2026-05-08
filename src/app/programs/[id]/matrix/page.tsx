import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  getProgram,
  listEvidenceByProgram,
} from '@/lib/repo';
import { buildMatrix } from '@/lib/matrix';
import { getStandardOrNull } from '@/lib/standards';
import type { StandardId } from '@/lib/constants';
import type { EvidenceDoc } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MatrixPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/programs/${params.id}/matrix`);

  const program = await getProgram(params.id);
  if (!program) notFound();
  if (program.ownerId !== user.uid) redirect('/');

  const standard = getStandardOrNull(program.standardId);
  if (!standard) notFound();

  const [matrix, evidences] = await Promise.all([
    buildMatrix(params.id, program.standardId as StandardId),
    listEvidenceByProgram(params.id),
  ]);

  const evidenceById = new Map<string, EvidenceDoc>();
  for (const ev of evidences) {
    if (ev.id) evidenceById.set(ev.id, ev);
  }

  const coveragePct =
    matrix.totalCriteria === 0
      ? 0
      : Math.round((matrix.coveredCriteria / matrix.totalCriteria) * 100);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/programs/${program.id}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← {program.name}
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Ma trận đối chiếu</h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo bộ tiêu chuẩn <strong>{standard.shortName}</strong>. Mỗi tiêu chí
          hiển thị các minh chứng đã được duyệt. Tiêu chí chưa có minh chứng
          được đánh dấu đỏ.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card">
          <div className="text-xs text-slate-500">Tổng tiêu chí</div>
          <div className="text-2xl font-semibold">{matrix.totalCriteria}</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-500">Đã có minh chứng</div>
          <div className="text-2xl font-semibold text-emerald-600">
            {matrix.coveredCriteria}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-500">Còn thiếu</div>
          <div className="text-2xl font-semibold text-red-600">
            {matrix.missingCriteria.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Mức độ phủ</span>
          <span className="text-sm text-slate-500">{coveragePct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${coveragePct}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {matrix.rows.map((row) => {
          const sectionMissing = row.criteria.filter(
            (c) => c.evidenceIds.length === 0,
          ).length;
          return (
            <div key={row.sectionId} className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  <span className="text-brand-600 mr-2">{row.sectionId}.</span>
                  {row.sectionName}
                </h2>
                {sectionMissing > 0 && (
                  <span className="badge bg-red-100 text-red-700">
                    Thiếu {sectionMissing}/{row.criteria.length}
                  </span>
                )}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                    <th className="py-2 pr-2 w-16">Mã</th>
                    <th className="py-2 pr-2">Tiêu chí</th>
                    <th className="py-2 pr-2 w-1/3">Minh chứng</th>
                  </tr>
                </thead>
                <tbody>
                  {row.criteria.map((c) => {
                    const isMissing = c.evidenceIds.length === 0;
                    return (
                      <tr
                        key={c.criterionId}
                        className={`border-b border-slate-50 ${isMissing ? 'bg-red-50/40' : ''}`}
                      >
                        <td className="py-2 pr-2 font-mono text-xs text-slate-600 align-top">
                          {c.criterionId}
                        </td>
                        <td className="py-2 pr-2 align-top">
                          {c.criterionText}
                        </td>
                        <td className="py-2 pr-2 align-top">
                          {isMissing ? (
                            <span className="text-xs text-red-600">
                              ⚠ Chưa có minh chứng
                            </span>
                          ) : (
                            <ul className="space-y-1">
                              {c.evidenceIds.map((eid) => {
                                const ev = evidenceById.get(eid);
                                if (!ev) return null;
                                return (
                                  <li
                                    key={eid}
                                    className="text-xs text-slate-700 truncate"
                                    title={ev.fileName}
                                  >
                                    •{' '}
                                    <span className="font-medium">
                                      {ev.metadata.title || ev.fileName}
                                    </span>
                                    {ev.metadata.docCode && (
                                      <span className="text-slate-400 ml-1">
                                        ({ev.metadata.docCode})
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
