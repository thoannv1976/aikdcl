import 'server-only';
import { adminDb, FieldValue } from './firebase-admin';
import { COL, EVIDENCE_STATUS, type EvidenceStatus } from './constants';
import type { EvidenceDoc, ProgramDoc } from './types';

// =============================================================================
// AIKDCL — Firestore repository helpers (server-only).
// Mọi ghi đi qua Admin SDK (rules được bypass + atomic). Client SDK chỉ
// dùng cho Auth (xem firebase.ts).
// =============================================================================

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
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as ProgramDoc) };
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
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ProgramDoc) }));
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
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as EvidenceDoc) };
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
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as EvidenceDoc) }));
}

export async function deleteEvidence(id: string): Promise<void> {
  const db = adminDb();
  const ev = await db.collection(COL.evidences).doc(id).get();
  if (!ev.exists) return;
  const programId = (ev.data() as EvidenceDoc).programId;
  await ev.ref.delete();
  await db
    .collection(COL.programs)
    .doc(programId)
    .update({
      evidenceCount: FieldValue.increment(-1),
      updatedAt: new Date().toISOString(),
    })
    .catch(() => undefined);
}

export function isEvidenceStatus(s: string): s is EvidenceStatus {
  return Object.values(EVIDENCE_STATUS).includes(s as EvidenceStatus);
}
