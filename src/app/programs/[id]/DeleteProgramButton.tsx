'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProgramButton({
  programId,
}: {
  programId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (busy) return;
    if (
      !confirm(
        'Xoá chương trình này? Toàn bộ minh chứng đã upload sẽ bị xoá khỏi cơ sở dữ liệu (không hoàn tác được).',
      )
    )
      return;
    setBusy(true);
    try {
      const r = await fetch(`/api/programs/${programId}`, { method: 'DELETE' });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || 'Xoá thất bại');
      }
      router.replace('/');
      router.refresh();
    } catch (e: unknown) {
      alert((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <button className="btn-danger" onClick={onDelete} disabled={busy}>
      {busy ? 'Đang xoá...' : 'Xoá chương trình'}
    </button>
  );
}
