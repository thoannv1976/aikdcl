import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { STANDARDS } from '@/lib/standards';
import NewProgramForm from './NewProgramForm';

export const dynamic = 'force-dynamic';

export default async function NewProgramPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/programs/new');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Trang chủ
        </Link>
        <h1 className="text-2xl font-semibold mt-2">
          Tạo chương trình đào tạo mới
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Mỗi chương trình tương ứng với một quy trình kiểm định. Sau khi tạo,
          bạn có thể bắt đầu upload minh chứng.
        </p>
      </div>

      <div className="card">
        <NewProgramForm
          standards={STANDARDS.map((s) => ({
            id: s.id,
            shortName: s.shortName,
            name: s.name,
          }))}
        />
      </div>
    </div>
  );
}
