import 'server-only';
import { adminBucket } from './firebase-admin';

/** Upload buffer to Firebase Storage. Trả storagePath gs:// để lưu Firestore. */
export async function uploadEvidenceFile(opts: {
  ownerId: string;
  programId: string;
  fileName: string;
  buffer: Buffer;
  contentType: string;
}): Promise<{ storagePath: string }> {
  const safeName = sanitizeFileName(opts.fileName);
  const ts = Date.now();
  const objectPath = `uploads/${opts.ownerId}/${opts.programId}/${ts}-${safeName}`;
  const file = adminBucket().file(objectPath);
  await file.save(opts.buffer, {
    contentType: opts.contentType,
    resumable: false,
    metadata: { metadata: { ownerId: opts.ownerId, programId: opts.programId } },
  });
  return { storagePath: objectPath };
}

export async function deleteEvidenceFile(storagePath: string): Promise<void> {
  await adminBucket()
    .file(storagePath)
    .delete()
    .catch(() => undefined);
}

function sanitizeFileName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 120);
}
