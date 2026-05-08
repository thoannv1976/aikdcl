'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceUploader({ programId }: { programId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{
    total: number;
    done: number;
    current?: string;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function uploadOne(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('programId', programId);
    fd.append('file', file);
    const r = await fetch('/api/evidences', { method: 'POST', body: fd });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return j.error || `Upload thất bại: ${file.name}`;
    return null;
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (busy) return;
    setBusy(true);
    setErrors([]);
    const arr = Array.from(files);
    setProgress({ total: arr.length, done: 0 });
    const errs: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      setProgress({ total: arr.length, done: i, current: arr[i].name });
      const err = await uploadOne(arr[i]);
      if (err) errs.push(err);
    }
    setProgress({ total: arr.length, done: arr.length });
    setErrors(errs);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
    router.refresh();
  }

  return (
    <div className="card border-dashed">
      <div className="flex flex-col items-center text-center py-4">
        <p className="text-sm text-slate-600 mb-3">
          Tải lên minh chứng (PDF, DOCX, TXT, MD; tối đa 50 MB/file). AI sẽ
          tự trích metadata và gợi ý tiêu chí phù hợp.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
          disabled={busy}
        />
        <button
          className="btn-primary"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Đang xử lý...' : 'Chọn file để upload'}
        </button>

        {progress && (
          <div className="mt-3 text-xs text-slate-500">
            {progress.done}/{progress.total} file
            {progress.current && busy && (
              <span className="ml-2">— đang xử lý: {progress.current}</span>
            )}
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-3 w-full text-left text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 space-y-1">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
