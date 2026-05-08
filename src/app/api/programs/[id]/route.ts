import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteProgram, getProgram } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth();
    const program = await getProgram(params.id);
    if (!program) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương trình.' },
        { status: 404 },
      );
    }
    if (program.ownerId !== user.uid) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xoá chương trình này.' },
        { status: 403 },
      );
    }
    await deleteProgram(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    console.error('DELETE /api/programs/[id] failed', e);
    return NextResponse.json(
      { error: (e as Error).message || 'Lỗi không xác định' },
      { status: 500 },
    );
  }
}
