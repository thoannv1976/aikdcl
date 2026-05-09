import 'server-only';
import type { DocumentSnapshot } from 'firebase-admin/firestore';
import { adminDb, FieldValue } from './firebase-admin';
import { COL, EVIDENCE_STATUS, type EvidenceStatus } from './constants';
import type { EvidenceDoc, ProgramDoc } from './types';

// =============================================================================
// AIKDCL — Firestore repository helpers (server-only).
// Mọi ghi đi qua Admin SDK (rules được bypass + atomic). Client SDK chỉ
// dùng cho Auth (xem firebase.ts).
// =============================================================================

/**
 * Convert Firestore document → plain JSON-serializable object.
 *
 * Cần thiết vì Server Components Next.js 14 truyền data sang Client Components
 * qua JSON.stringify — class instance như Firestore Timestamp / DocumentReference
 * sẽ throw "Only plain objects ... can be passed to Client Components".
 *
 * Đồng thời strip `_serverTime` (Timestamp metadata không cần phía client).
 */
function sanitize(input: unknown): unknown {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(sanitize);
  if (typeof input !== 'object') return input;

  const maybeTs = input as { toDate?: () => Date };
  if (typeof maybeTs.toDate === 'function') {
    return maybeTs.toDate().toISOString();
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (k === '_serverTime') continue;
    out[k] = sanitize(v);
  }
  return out;
}

function toPlain<T>(snap: DocumentSnapshot): (T & { id: string }) | null {
  const data = snap.data();
  if (!data) return null;
  return { id: snap.id, ...(sanitize(data) as object) } as T & { id: string };
}

export async function createProgram(
  ownerId: string,
  data: Omit<ProgramDoc, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'evidenceCount'>,
): Promise<string> {
  const now = new Date().toISOString();
  const ref = await adminDb()
    .collection(COL.programs)
    .add({
      ...data,
      ownerId,
      evidenceCount: 0,
      createdAt: now,
      updatedAt: now,
      _serverTime: FieldValue.serverTimestamp(),
    });
  return ref.id;
}

export async function getProgram(id: string): Promise<ProgramDoc | null> {
  const snap = await adminDb().collection(COL.programs).doc(id).get();
  return toPlain<ProgramDoc>(snap);
}

export async function listProgramsByOwner(
  ownerId: string,
): Promise<ProgramDoc[]> {
  const snap = await adminDb()
    .collection(COL.programs)
    .where('ownerId', '==', ownerId)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();
  return snap.docs
    .map((d) => toPlain<ProgramDoc>(d))
    .filter((x): x is ProgramDoc & { id: string } => x !== null);
}

export async function deleteProgram(id: string): Promise<void> {
  // Cascade delete evidence docs (Storage cleanup nên làm tách ra job riêng;
  // pha 1 chấp nhận file Storage còn lại — không leak vì path scoped theo uid).
  const db = adminDb();
  const ev = await db
    .collection(COL.evidences)
    .where('programId', '==', id)
    .limit(500)
    .get();
  const batch = db.batch();
  for (const d of ev.docs) batch.delete(d.ref);
  batch.delete(db.collection(COL.programs).doc(id));
  await batch.commit();
}

// =============================================================================
// Evidence
// =============================================================================

export async function createEvidence(
  ownerId: string,
  data: Omit<EvidenceDoc, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const now = new Date().toISOString();
  const db = adminDb();
  const ref = await db.collection(COL.evidences).add({
    ...data,
    ownerId,
    createdAt: now,
    updatedAt: now,
    _serverTime: FieldValue.serverTimestamp(),
  });
  await db
    .collection(COL.programs)
    .doc(data.programId)
    .update({
      evidenceCount: FieldValue.increment(1),
      updatedAt: now,
    })
    .catch(() => undefined);
  return ref.id;
}

export async function updateEvidence(
  id: string,
  patch: Partial<
    Pick<
      EvidenceDoc,
      | 'metadata'
      | 'suggestedCriteria'
      | 'approvedCriteria'
      | 'status'
      | 'errorMessage'
      | 'contentText'
    >
  >,
): Promise<void> {
  await adminDb()
    .collection(COL.evidences)
    .doc(id)
    .update({
      ...patch,
      updatedAt: new Date().toISOString(),
    });
}

export async function getEvidence(id: string): Promise<EvidenceDoc | null> {
  const snap = await adminDb().collection(COL.evidences).doc(id).get();
  return toPlain<EvidenceDoc>(snap);
}

export async function listEvidenceByProgram(
  programId: string,
): Promise<EvidenceDoc[]> {
  const snap = await adminDb()
    .collection(COL.evidences)
    .where('programId', '==', programId)
    .orderBy('createdAt', 'desc')
    .limit(500)
    .get();
  return snap.docs
    .map((d) => toPlain<EvidenceDoc>(d))
    .filter((x): x is EvidenceDoc & { id: string } => x !== null);
}

export async function deleteEvidence(id: string): Promise<void> {
  const db = adminDb();
  const ev = await db.collection(COL.evidences).doc(id).get();
  if (!ev.exists) return;
  const data = ev.data() as EvidenceDoc | undefined;
  if (!data) return;
  await ev.ref.delete();
  await db
    .collection(COL.programs)
    .doc(data.programId)
    .update({
      evidenceCount: FieldValue.increment(-1),
      updatedAt: new Date().toISOString(),
    })
    .catch(() => undefined);
}

export function isEvidenceStatus(s: string): s is EvidenceStatus {
  return Object.values(EVIDENCE_STATUS).includes(s as EvidenceStatus);
}
