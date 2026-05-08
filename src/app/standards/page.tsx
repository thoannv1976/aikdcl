import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { STANDARDS } from '@/lib/standards';

export const dynamic = 'force-dynamic';

export default async function StandardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/standards');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Thư viện bộ tiêu chuẩn</h1>
          <p className="text-sm text-slate-500">
            Các bộ tiêu chuẩn kiểm định được hệ thống hỗ trợ. Nhấn vào để xem
            chi tiết tiêu chí.
          </p>
        </div>
        <Link className="btn-secondary" href="/">
          ← Trang chủ
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {STANDARDS.map((s) => {
          const totalCriteria = s.sections.reduce(
            (sum, sec) => sum + sec.criteria.length,
            0,
          );
          return (
            <Link
              key={s.id}
              href={`/standards/${s.id}`}
              className="card hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="badge bg-brand-100 text-brand-700">
                  {s.shortName}
                </span>
                <span className="text-xs text-slate-400">v{s.version}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {s.name}
              </h2>
              <p className="text-sm text-slate-600 line-clamp-3">
                {s.description}
              </p>
              <div className="mt-3 flex gap-4 text-xs text-slate-500">
                <span>{s.sections.length} tiêu chuẩn</span>
                <span>•</span>
                <span>{totalCriteria} tiêu chí</span>
                <span>•</span>
                <span>
                  Thang điểm {s.scoreScale.min}–{s.scoreScale.max}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
