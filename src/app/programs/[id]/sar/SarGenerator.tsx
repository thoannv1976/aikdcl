'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SarReportDoc, SarSectionDraft } from '@/lib/types';

interface Props {
  programId: string;
  approvedCount: number;
  initialReport: SarReportDoc | null;
  scoreScaleMax: number;
}

export default function SarGenerator({
  programId,
  approvedCount,
  initialReport,
  scoreScaleMax,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [report, setReport] = useState<SarReportDoc | null>(initialReport);

  async function generate() {
    if (busy) return;
    if (approvedCount === 0) {
      setErr(
        'Chưa có minh chứng nào được duyệt. Vào trang chi tiết chương trình để tag tiêu chí trước.',
      );
      return;
    }
    if (
      report &&
      !confirm(
        'Sinh lại SAR sẽ tạo bản mới. Bản hiện tại vẫn được lưu trong lịch sử. Tiếp tục?',
      )
    )
      return;
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch('/api/sar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Sinh SAR thất bại');
      setReport(j.report as SarReportDoc);
      router.refresh();
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">
              {report ? 'Sinh lại SAR' : 'Sinh SAR lần đầu'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              AI sẽ viết mục SAR cho từng tiêu chí (mô tả hiện trạng + đối chiếu
              minh chứng + điểm mạnh/yếu + tự đánh giá). Quá trình mất khoảng
              <strong> 2–5 phút</strong> tùy số lượng tiêu chí. Vui lòng không
              đóng tab.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={generate}
            disabled={busy || approvedCount === 0}
          >
            {busy
              ? 'Đang sinh SAR…'
              : report
                ? 'Sinh lại SAR'
                : 'Sinh SAR'}
          </button>
        </div>
        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mt-3">
            {err}
          </div>
        )}
        {busy && (
          <div className="mt-3 text-xs text-slate-500">
            Đang xử lý ~30-50 tiêu chí song song (3 cùng lúc). Giữ tab mở.
          </div>
        )}
      </div>

      {report && <SarReportView report={report} scoreScaleMax={scoreScaleMax} />}
    </div>
  );
}

function SarReportView({
  report,
  scoreScaleMax,
}: {
  report: SarReportDoc;
  scoreScaleMax: number;
}) {
  // Group sections theo sectionId
  const groups = new Map<
    string,
    { sectionName: string; sections: SarSectionDraft[] }
  >();
  for (const s of report.sections) {
    const g = groups.get(s.sectionId);
    if (g) {
      g.sections.push(s);
    } else {
      groups.set(s.sectionId, {
        sectionName: s.sectionName,
        sections: [s],
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="card bg-emerald-50 border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-emerald-900">
              SAR đã sinh ({report.sections.length} tiêu chí)
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Điểm trung bình: <strong>{report.overallScore}/{scoreScaleMax}</strong>{' '}
              • Coverage: <strong>{report.coveragePct}%</strong>
              {report.generationTimeMs && (
                <>
                  {' '}
                  • Thời gian sinh:{' '}
                  <strong>{Math.round(report.generationTimeMs / 1000)}s</strong>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {Array.from(groups.entries()).map(([sectionId, group]) => (
        <div key={sectionId} className="card">
          <h3 className="text-lg font-semibold mb-3">
            <span className="text-brand-600 mr-2">{sectionId}.</span>
            {group.sectionName}
          </h3>
          <div className="space-y-4">
            {group.sections.map((s) => (
              <SectionCard
                key={s.criterionId}
                section={s}
                scoreScaleMax={scoreScaleMax}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  section,
  scoreScaleMax,
}: {
  section: SarSectionDraft;
  scoreScaleMax: number;
}) {
  return (
    <div
      className={`border-l-4 pl-4 py-2 ${section.hasNoEvidence ? 'border-red-300 bg-red-50/40' : 'border-emerald-300'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium text-slate-900">
          <span className="text-slate-500 mr-2 font-mono text-xs">
            {section.criterionId}
          </span>
          {section.criterionText}
        </div>
        <div className="flex-shrink-0">
          <span
            className={`badge ${section.hasNoEvidence ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700'}`}
          >
            {section.selfScore}/{scoreScaleMax}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
        {section.description}
      </p>

      {section.evidenceRefs.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Minh chứng đối chiếu ({section.evidenceRefs.length}):
          </div>
          <ul className="text-xs space-y-1">
            {section.evidenceRefs.map((r, i) => (
              <li key={i} className="text-slate-600">
                •{' '}
                <span className="font-medium">{r.fileName}</span>
                {r.docCode && (
                  <span className="text-slate-400"> ({r.docCode})</span>
                )}
                {r.quote && (
                  <span className="block ml-3 italic text-slate-500">
                    "{r.quote}"
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.strengths.length > 0 && (
        <div className="mt-2 text-xs">
          <span className="font-medium text-emerald-700">Điểm mạnh: </span>
          <span className="text-slate-700">{section.strengths.join('; ')}</span>
        </div>
      )}

      {section.weaknesses.length > 0 && (
        <div className="mt-1 text-xs">
          <span className="font-medium text-amber-700">Cần cải tiến: </span>
          <span className="text-slate-700">{section.weaknesses.join('; ')}</span>
        </div>
      )}

      {section.selfScoreRationale && (
        <div className="mt-1 text-xs text-slate-500">
          <span className="font-medium">Lý do điểm: </span>
          {section.selfScoreRationale}
        </div>
      )}
    </div>
  );
}
