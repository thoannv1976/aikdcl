import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import {
  deleteEvidence,
  getEvidence,
  updateEvidence,
} from '@/lib/repo';
import { deleteEvidenceFile } from '@/lib/storage';
import { getProgram } from '@/lib/repo';
import { listCriteria } from '@/lib/standards';
import { EVIDENCE_STATUS, type StandardId } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PatchBody = z.object({
  approvedCriteria: z.array(z.string().max(50)).max(50).optional(),
  metadata: z
    .object({
      title: z.string().max(300).optional(),
      issuedAt: z.string().max(20).optional(),
      unit: z.string().max(200).optional(),
      docCode: z.string().max(100).optional(),
      summary: z.string().max(1000).optional(),
    })
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth();
    const ev = await getEvidence(params.id);
    if (!ev) {
      return NextResponse.json(
        { error: 'Không tìm thấy minh chứng.' },
        { status: 404 },
      );
    }
    if (ev.ownerId !== user.uid) {
      return NextResponse.json(
        { error: 'Bạn không có quyền chỉnh sửa minh chứng này.' },
        { status: 403 },
      );
    }
    const json = await req.json().catch(() => null);
    const parsed = PatchBody.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ.' },
        { status: 400 },
      );
    }

    const patch: Parameters<typeof updateEvidence>[1] = {};

    if (parsed.data.approvedCriteria) {
      const program = await getProgram(ev.programId);
      const validIds = new Set(
        program
          ? listCriteria(program.standardId as StandardId).map(
              (c) => c.criterion.id,
            )
          : [],
      );
      patch.approvedCriteria = parsed.data.approvedCriteria.filter((id) =>
        validIds.has(id),
      );
      patch.status = EVIDENCE_STATUS.approved;
    }
    if (parsed.data.metadata) {
      patch.metadata = { ...ev.metadata, ...parsed.data.metadata };
    }

    await updateEvidence(params.id, patch);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    console.error('PATCH /api/evidences/[id] failed', e);
    return NextResponse.json(
      { error: (e as Error).message || 'Lỗi không xác định' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth();
    const ev = await getEvidence(params.id);
    if (!ev) return NextResponse.json({ ok: true });
    if (ev.ownerId !== user.uid) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xoá minh chứng này.' },
        { status: 403 },
      );
    }
    await deleteEvidenceFile(ev.storagePath);
    await deleteEvidence(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    console.error('DELETE /api/evidences/[id] failed', e);
    return NextResponse.json(
      { error: (e as Error).message || 'Lỗi không xác định' },
      { status: 500 },
    );
  }
}
