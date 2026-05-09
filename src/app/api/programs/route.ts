import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createProgram } from '@/lib/repo';
import { STANDARD_IDS } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  name: z.string().min(2).max(200),
  code: z.string().max(50).optional(),
  level: z.enum(['undergraduate', 'graduate', 'doctoral']).optional(),
  faculty: z.string().max(200).optional(),
  cohort: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  standardId: z.enum([STANDARD_IDS.aunQaV4, STANDARD_IDS.moetTt04]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const id = await createProgram(user.uid, parsed.data);
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: (e as Error).message }, { status: 401 });
    }
    console.error('POST /api/programs failed', e);
    return NextResponse.json(
      { error: (e as Error).message || 'Lỗi không xác định' },
      { status: 500 },
    );
  }
}
