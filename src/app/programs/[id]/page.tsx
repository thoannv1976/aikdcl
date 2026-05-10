import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getProgram, listEvidenceByProgram } from '@/lib/repo';
import { getStandardOrNull } from '@/lib/standards';
import EvidenceUploader from './EvidenceUploader';
import EvidenceList from './EvidenceList';
import DeleteProgramButton from './DeleteProgramButton';

export const dynamic = 'force-dynamic';

const LEVEL_LABEL: Record<string, string> = {
  undergraduate: 'Đại học',
  graduate: 'Sau đại học',
  doctoral: 'Tiến sĩ',
};

export default async function ProgramDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/programs/${params.id}`);

  const program = await getProgram(params.id);
  if (!program) notFound();
  if (program.ownerId !== user.uid) redirect('/');

  const standard = getStandardOrNull(program.standardId);
  const evidences = await listEvidenceByProgram(params.id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Trang chủ
        </Link>
        <div className="flex items-start justify-between mt-2 gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {standard && (
                <span className="badge bg-brand-100 text-brand-700">
                  {standard.shortName}
                </span>
              )}
              {program.level && (
                <span className="badge bg-slate-100 text-slate-700">
                  {LEVEL_LABEL[program.level] ?? program.level}
                </span>
              )}
              {program.code && (
                <span className="text-xs text-slate-500">
                  Mã: {program.code}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold mt-1">{program.name}</h1>
            <div className="text-sm text-slate-500 mt-1 space-x-2">
              {program.faculty && <span>{program.faculty}</span>}
              {program.cohort && <span>• {program.cohort}</span>}
            </div>
            {program.description && (
              <p className="text-sm text-slate-600 mt-2 max-w-3xl">
                {program.description}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            <Link
              href={`/programs/${params.id}/matrix`}
              className="btn-secondary"
            >
              Ma trận đối chiếu
            </Link>
            <Link
              href={`/programs/${params.id}/sar`}
              className="btn-primary"
            >
              Báo cáo SAR
            </Link>
            <DeleteProgramButton programId={params.id} />
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Kho minh chứng ({evidences.length})
          </h2>
        </div>

        <EvidenceUploader programId={params.id} />

        <EvidenceList
          evidences={evidences}
          standard={standard}
        />
      </section>
    </div>
  );
}
