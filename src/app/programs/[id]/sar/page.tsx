import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  getLatestSarReport,
  getProgram,
  listEvidenceByProgram,
} from '@/lib/repo';
import { getStandardOrNull } from '@/lib/standards';
import SarGenerator from './SarGenerator';

export const dynamic = 'force-dynamic';

export default async function SarPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/programs/${params.id}/sar`);

  const program = await getProgram(params.id);
  if (!program) notFound();
  if (program.ownerId !== user.uid) redirect('/');

  const standard = getStandardOrNull(program.standardId);
  if (!standard) notFound();

  const [report, evidences] = await Promise.all([
    getLatestSarReport(params.id),
    listEvidenceByProgram(params.id),
  ]);

  const approvedCount = evidences.filter(
    (e) => (e.approvedCriteria?.length ?? 0) > 0,
  ).length;

  const totalCriteria = standard.sections.reduce(
    (sum, sec) => sum + sec.criteria.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/programs/${params.id}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← {program.name}
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Báo cáo Tự đánh giá (SAR)</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI sẽ sinh draft SAR cho từng tiêu chí dựa trên minh chứng đã duyệt.
          Bạn có thể chỉnh sửa, sinh lại từng phần, hoặc xuất ra DOCX (pha sau).
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card">
          <div className="text-xs text-slate-500">Bộ tiêu chuẩn</div>
          <div className="text-lg font-semibold mt-1">{standard.shortName}</div>
          <div className="text-xs text-slate-400">{totalCriteria} tiêu chí</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-500">Minh chứng đã duyệt</div>
          <div className="text-2xl font-semibold mt-1 text-emerald-600">
            {approvedCount}
          </div>
          <div className="text-xs text-slate-400">/ {evidences.length} tổng</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-500">SAR hiện tại</div>
          <div className="text-sm mt-1">
            {report ? (
              <>
                <span className="font-semibold text-slate-900">
                  Điểm TB {report.overallScore}
                </span>
                <span className="text-slate-400">
                  {' '}
                  / {standard.scoreScale.max}
                </span>
              </>
            ) : (
              <span className="text-slate-400">Chưa sinh</span>
            )}
          </div>
          {report && (
            <div className="text-xs text-slate-400">
              Coverage {report.coveragePct}% • {report.sections.length} mục
            </div>
          )}
        </div>
      </div>

      <SarGenerator
        programId={params.id}
        approvedCount={approvedCount}
        initialReport={report}
        scoreScaleMax={standard.scoreScale.max}
      />
    </div>
  );
}
