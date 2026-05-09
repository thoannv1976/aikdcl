import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { describeClaudeError } from '@/lib/claude';
import { capContentText, parseUploadedFile } from '@/lib/parseFile';
import { analyzeEvidence } from '@/lib/evidenceAi';
import { uploadEvidenceFile } from '@/lib/storage';
import { createEvidence, getProgram } from '@/lib/repo';
import { EVIDENCE_STATUS, MAX_FILE_SIZE_BYTES } from '@/lib/constants';
import type { StandardId } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const ALLOWED_EXT = ['.pdf', '.docx', '.txt', '.md'];

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const form = await req.formData();
    const programId = String(form.get('programId') ?? '');
    const file = form.get('file');

    if (!programId) {
      return NextResponse.json(
        { error: 'Thiếu programId.' },
        { status: 400 },
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Thiếu file.' }, { status: 400 });
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
        { error: 'Bạn không có quyền upload vào chương trình này.' },
        { status: 403 },
      );
    }

    const lower = file.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return NextResponse.json(
        {
          error: `Định dạng không hỗ trợ. Chỉ chấp nhận: ${ALLOWED_EXT.join(', ')}.`,
        },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File quá lớn (giới hạn ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)} MB).`,
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseUploadedFile(buffer, file.name);

    const { storagePath } = await uploadEvidenceFile({
      ownerId: user.uid,
      programId,
      fileName: file.name,
      buffer,
      contentType: file.type || 'application/octet-stream',
    });

    let suggestedCriteria: string[] = [];
    let metadata = {};
    let status: typeof EVIDENCE_STATUS[keyof typeof EVIDENCE_STATUS] =
      EVIDENCE_STATUS.pending;
    let errorMessage: string | undefined = parsed.warning;

    if (parsed.text.length >= 50) {
      try {
        const ai = await analyzeEvidence({
          userId: user.uid,
          standardId: program.standardId as StandardId,
          fileName: file.name,
          contentText: parsed.text,
        });
        metadata = ai.metadata;
        suggestedCriteria = ai.suggestedCriteria;
        status = EVIDENCE_STATUS.tagged;
      } catch (e) {
        errorMessage = describeClaudeError(e);
      }
    } else if (!errorMessage) {
      errorMessage =
        'Văn bản trích xuất quá ngắn (<50 ký tự). Bạn có thể tag thủ công.';
    }

    const id = await createEvidence(user.uid, {
      programId,
      fileName: file.name,
      storagePath,
      contentType: file.type || 'application/octet-stream',
      size: buffer.length,
      contentText: capContentText(parsed.text),
      metadata,
      suggestedCriteria,
      approvedCriteria: [],
      status,
      errorMessage,
    });

    return NextResponse.json({
      ok: true,
      id,
      suggestedCriteria,
      metadata,
      warning: errorMessage,
    });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    if (code === 'RATE_LIMITED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 429 });
    }
    console.error('POST /api/evidences failed', e);
    return NextResponse.json(
      { error: describeClaudeError(e) },
      { status: 500 },
    );
  }
}
