import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'userChatbotState';
const MAX_STORED_SESSION_IDS = 50;

export const chatbotSessionService = {
  async getTeachSessionIds(uid: string): Promise<string[]> {
    const ref = doc(db, COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    const raw = snap.data().teachSessionIds;
    return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : [];
  },

  async saveTeachSessionIds(uid: string, ids: string[]): Promise<void> {
    const trimmed = [...new Set(ids)].slice(0, MAX_STORED_SESSION_IDS);
    const ref = doc(db, COLLECTION, uid);
    await setDoc(
      ref,
      {
        teachSessionIds: trimmed,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },
};
