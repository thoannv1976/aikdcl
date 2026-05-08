'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { EvidenceDoc, StandardDef } from '@/lib/types';
import { EVIDENCE_STATUS } from '@/lib/constants';

const STATUS_LABEL = {
  [EVIDENCE_STATUS.pending]: { label: 'Chờ xử lý', cls: 'bg-amber-100 text-amber-700' },
  [EVIDENCE_STATUS.tagged]: { label: 'AI đã gợi ý', cls: 'bg-sky-100 text-sky-700' },
  [EVIDENCE_STATUS.approved]: { label: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-700' },
};

export default function EvidenceList({
  evidences,
  standard,
}: {
  evidences: EvidenceDoc[];
  standard: StandardDef | null;
}) {
  if (evidences.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-8">
        Chưa có minh chứng nào. Sử dụng vùng upload phía trên để bắt đầu.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {evidences.map((ev) => (
        <EvidenceItem key={ev.id} evidence={ev} standard={standard} />
      ))}
    </div>
  );
}

function EvidenceItem({
  evidence,
  standard,
}: {
  evidence: EvidenceDoc;
  standard: StandardDef | null;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>(
    evidence.approvedCriteria.length > 0
      ? evidence.approvedCriteria
      : evidence.suggestedCriteria,
  );

  const criterionMap = useMemo(() => {
    const map = new Map<string, { sectionName: string; text: string }>();
    if (!standard) return map;
    for (const sec of standard.sections) {
      for (const c of sec.criteria) {
        map.set(c.id, { sectionName: sec.name, text: c.text });
      }
    }
    return map;
  }, [standard]);

  function toggle(id: string) {
    setApproved((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`/api/evidences/${evidence.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedCriteria: approved }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || 'Lưu thất bại');
      }
      router.refresh();
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Xoá minh chứng "${evidence.fileName}"?`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/evidences/${evidence.id}`, {
        method: 'DELETE',
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || 'Xoá thất bại');
      }
      router.refresh();
    } catch (e: unknown) {
      alert((e as Error).message);
      setBusy(false);
    }
  }

  const statusInfo = STATUS_LABEL[evidence.status] ?? STATUS_LABEL.pending;

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
            {evidence.metadata.docCode && (
              <span className="text-xs text-slate-500">
                {evidence.metadata.docCode}
              </span>
            )}
            {evidence.metadata.issuedAt && (
              <span className="text-xs text-slate-500">
                • {evidence.metadata.issuedAt}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 mt-1 truncate">
            {evidence.metadata.title || evidence.fileName}
          </h3>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {evidence.fileName}
            {evidence.metadata.unit && <> • {evidence.metadata.unit}</>}
          </div>
          {evidence.metadata.summary && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
              {evidence.metadata.summary}
            </p>
          )}
          {evidence.errorMessage && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mt-2">
              {evidence.errorMessage}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          <button
            className="btn-ghost text-xs"
            onClick={() => setExpanded((x) => !x)}
          >
            {expanded ? 'Thu gọn' : 'Tag tiêu chí'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-100 pt-3 space-y-3">
          <p className="text-xs text-slate-500">
            AI gợi ý các tiêu chí sau cho minh chứng này. Bỏ tick những tiêu chí
            không phù hợp rồi nhấn <strong>Lưu</strong>. Chỉ những tiêu chí đã
            duyệt mới được tính vào ma trận đối chiếu.
          </p>

          {standard && (
            <div className="max-h-64 overflow-auto border rounded p-2 space-y-1 bg-slate-50">
              {standard.sections.map((sec) => (
                <div key={sec.id}>
                  <div className="text-xs font-semibold text-slate-700 mt-2 mb-1">
                    {sec.id}. {sec.name}
                  </div>
                  {sec.criteria.map((c) => {
                    const isSuggested = evidence.suggestedCriteria.includes(c.id);
                    const isChecked = approved.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-2 text-xs py-1 cursor-pointer hover:bg-white rounded px-1 ${isSuggested ? 'font-medium' : 'text-slate-600'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(c.id)}
                          className="mt-0.5"
                        />
                        <span>
                          <span className="text-slate-400 mr-1">{c.id}</span>
                          {c.text}
                          {isSuggested && (
                            <span className="ml-1 text-brand-600">★</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {!standard && (
            <p className="text-xs text-slate-500">
              Bộ tiêu chuẩn đã thay đổi hoặc không tìm thấy. Tag không khả dụng.
            </p>
          )}

          {err && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {err}
            </div>
          )}

          <div className="flex justify-between">
            <button
              className="btn-ghost text-xs text-red-600"
              onClick={onDelete}
              disabled={busy}
            >
              Xoá minh chứng
            </button>
            <button className="btn-primary" onClick={save} disabled={busy}>
              {busy ? 'Đang lưu...' : `Lưu (${approved.length} tiêu chí)`}
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-2">
            {approved.map((id) => {
              const c = criterionMap.get(id);
              return (
                <span
                  key={id}
                  className="bg-brand-50 text-brand-700 rounded px-2 py-0.5"
                  title={c?.text}
                >
                  {id}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
