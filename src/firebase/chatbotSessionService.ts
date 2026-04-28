import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'userChatbotState';
const MAX_STORED_SESSION_IDS = 50;
/** Recent chat conversation IDs (IFI); not resumable in-app but useful for audit/analytics. */
const MAX_STORED_CONVERSATION_IDS = 50;

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

  /**
   * Records a new chat conversation when IFI starts one (metadata only — no message text).
   */
  async recordConversationStart(uid: string, conversationId: string): Promise<void> {
    const id = conversationId?.trim();
    if (!id) return;

    try {
      const ref = doc(db, COLLECTION, uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};
      const raw = data.conversationIds;
      const prev = Array.isArray(raw)
        ? raw.filter((x): x is string => typeof x === 'string')
        : [];
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_STORED_CONVERSATION_IDS);

      await setDoc(
        ref,
        {
          lastConversationId: id,
          conversationIds: next,
          lastConversationStartedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('[chatbotSessionService] recordConversationStart failed', e);
    }
  },
};
