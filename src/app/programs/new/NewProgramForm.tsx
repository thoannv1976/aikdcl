'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StandardOption {
  id: string;
  shortName: string;
  name: string;
}

export default function NewProgramForm({
  standards,
}: {
  standards: StandardOption[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    level: 'undergraduate' as const,
    faculty: '',
    cohort: '',
    description: '',
    standardId: standards[0]?.id ?? '',
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Tạo chương trình thất bại');
      router.replace(`/programs/${j.id}`);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Tên chương trình *</label>
        <input
          className="input"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Vd: Cử nhân Quản trị Kinh doanh"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Mã chương trình</label>
          <input
            className="input"
            value={form.code}
            onChange={(e) => update('code', e.target.value)}
            placeholder="QTKD2024"
          />
        </div>
        <div>
          <label className="label">Trình độ</label>
          <select
            className="input"
            value={form.level}
            onChange={(e) => update('level', e.target.value as typeof form.level)}
          >
            <option value="undergraduate">Đại học</option>
            <option value="graduate">Sau đại học</option>
            <option value="doctoral">Tiến sĩ</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Khoa / Bộ môn</label>
          <input
            className="input"
            value={form.faculty}
            onChange={(e) => update('faculty', e.target.value)}
            placeholder="Khoa Quản trị Kinh doanh"
          />
        </div>
        <div>
          <label className="label">Khóa / Năm áp dụng</label>
          <input
            className="input"
            value={form.cohort}
            onChange={(e) => update('cohort', e.target.value)}
            placeholder="Khóa 2024-2028"
          />
        </div>
      </div>

      <div>
        <label className="label">Bộ tiêu chuẩn áp dụng *</label>
        <select
          className="input"
          required
          value={form.standardId}
          onChange={(e) => update('standardId', e.target.value)}
        >
          {standards.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName} — {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Mô tả</label>
        <textarea
          className="textarea"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Mô tả ngắn gọn về chương trình, mục tiêu kiểm định, kỳ kiểm định dự kiến..."
        />
      </div>

      {err && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded p-3">
          {err}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={busy || !form.name || !form.standardId}
        >
          {busy ? 'Đang tạo...' : 'Tạo chương trình'}
        </button>
      </div>
    </form>
  );
}
