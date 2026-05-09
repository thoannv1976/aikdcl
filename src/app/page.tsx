import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { listProgramsByOwner } from '@/lib/repo';
import { getStandardOrNull } from '@/lib/standards';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const programs = await listProgramsByOwner(user.uid).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Chào {user.name ?? user.email}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Quản lý kho minh chứng kiểm định và chuẩn bị báo cáo tự đánh giá
            (SAR) cho các chương trình đào tạo theo bộ tiêu chuẩn AUN-QA, MOET,
            v.v.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href="/standards" className="btn-secondary">
            Bộ tiêu chuẩn
          </Link>
          <Link href="/programs/new" className="btn-primary">
            + Chương trình mới
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Chương trình đào tạo của bạn ({programs.length})
        </h2>

        {programs.length === 0 ? (
          <div className="card text-center text-slate-500 py-10">
            <p className="mb-3">
              Bạn chưa có chương trình nào. Tạo chương trình đầu tiên để bắt
              đầu thu thập minh chứng.
            </p>
            <Link href="/programs/new" className="btn-primary">
              Tạo chương trình đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {programs.map((p) => {
              const std = getStandardOrNull(p.standardId);
              return (
                <Link
                  key={p.id}
                  href={`/programs/${p.id}`}
                  className="card hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    {std && (
                      <span className="badge bg-brand-100 text-brand-700">
                        {std.shortName}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {p.evidenceCount ?? 0} minh chứng
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <div className="text-xs text-slate-500 mt-1 space-x-2">
                    {p.code && <span>Mã: {p.code}</span>}
                    {p.faculty && <span>• {p.faculty}</span>}
                    {p.cohort && <span>• {p.cohort}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
