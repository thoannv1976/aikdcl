import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { describeClaudeError } from '@/lib/claude';
import {
  getLatestSarReport,
  getProgram,
  listEvidenceByProgram,
  saveSarReport,
} from '@/lib/repo';
import { generateSarReport } from '@/lib/sar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Tổng thời gian sinh SAR: ~30-50 tiêu chí × 10-15s / p-limit(3) ≈ 2-4 phút.
// Cap 540s là hard limit của App Hosting.
export const maxDuration = 540;

const Body = z.object({
  programId: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Thiếu programId.' },
        { status: 400 },
      );
    }

    const program = await getProgram(parsed.data.programId);
    if (!program) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương trình.' },
        { status: 404 },
      );
    }
    if (program.ownerId !== user.uid) {
      return NextResponse.json(
        { error: 'Bạn không có quyền sinh SAR cho chương trình này.' },
        { status: 403 },
      );
    }

    const evidences = await listEvidenceByProgram(parsed.data.programId);
    const approvedEvidences = evidences.filter(
      (e) => (e.approvedCriteria?.length ?? 0) > 0,
    );

    if (approvedEvidences.length === 0) {
      return NextResponse.json(
        {
          error:
            'Chưa có minh chứng nào được duyệt tag tiêu chí. Vui lòng tag và lưu ít nhất 1 minh chứng trước khi sinh SAR.',
        },
        { status: 400 },
      );
    }

    const draft = await generateSarReport({
      userId: user.uid,
      program,
      evidences: approvedEvidences,
    });

    const id = await saveSarReport(user.uid, draft);
    return NextResponse.json({ ok: true, id, report: { id, ...draft } });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    if (code === 'RATE_LIMITED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 429 });
    }
    console.error('POST /api/sar failed', e);
    return NextResponse.json(
      { error: describeClaudeError(e) },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const url = new URL(req.url);
    const programId = url.searchParams.get('programId');
    if (!programId) {
      return NextResponse.json(
        { error: 'Thiếu programId.' },
        { status: 400 },
      );
    }
    const program = await getProgram(programId);
    if (!program) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương trình.' },
        { status: 404 },
      );
    }
    if (program.ownerId !== user.uid) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xem SAR của chương trình này.' },
        { status: 403 },
      );
    }
    const report = await getLatestSarReport(programId);
    return NextResponse.json({ ok: true, report });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    console.error('GET /api/sar failed', e);
    return NextResponse.json(
      { error: (e as Error).message || 'Lỗi không xác định' },
      { status: 500 },
    );
  }
}
