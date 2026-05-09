import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getStandardOrNull } from '@/lib/standards';

export const dynamic = 'force-dynamic';

export default async function StandardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/standards/${params.id}`);

  const standard = getStandardOrNull(params.id);
  if (!standard) notFound();

  const totalCriteria = standard.sections.reduce(
    (sum, sec) => sum + sec.criteria.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/standards"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Thư viện bộ tiêu chuẩn
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="badge bg-brand-100 text-brand-700">
            {standard.shortName}
          </span>
          <span className="text-xs text-slate-400">v{standard.version}</span>
        </div>
        <h1 className="text-2xl font-semibold mt-1">{standard.name}</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          {standard.description}
        </p>
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span>{standard.sections.length} tiêu chuẩn</span>
          <span>•</span>
          <span>{totalCriteria} tiêu chí</span>
          <span>•</span>
          <span>
            Thang điểm tự đánh giá {standard.scoreScale.min}–
            {standard.scoreScale.max}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {standard.sections.map((sec) => (
          <div key={sec.id} className="card">
            <h2 className="text-lg font-semibold mb-3">
              <span className="text-brand-600 mr-2">{sec.id}.</span>
              {sec.name}
            </h2>
            <ol className="space-y-3 text-sm">
              {sec.criteria.map((c) => (
                <li
                  key={c.id}
                  className="border-l-2 border-slate-200 pl-3 py-1"
                >
                  <div className="font-medium text-slate-900">
                    <span className="text-slate-500 mr-1">{c.id}</span>{' '}
                    {c.text}
                  </div>
                  {c.evidenceHints && c.evidenceHints.length > 0 && (
                    <div className="mt-1 text-xs text-slate-500">
                      Loại minh chứng đề xuất:{' '}
                      {c.evidenceHints.map((h, i) => (
                        <span
                          key={i}
                          className="inline-block bg-slate-100 rounded px-1.5 py-0.5 mr-1 mb-0.5"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
