/**
 * IFI chatbot-interface-ifi persists UI state in localStorage using keys that are not scoped by
 * Firebase uid (e.g. "conversationId", "responses", "teach_caps_<chatbotId>", "teach_session_<chatbotId>").
 * Clear on logout / account switch so the next user does not see the previous user's thread.
 */
const STATIC_KEYS = ['conversationId', 'responses'] as const;
const TEACH_PREFIXES = ['teach_caps_', 'teach_session_'] as const;

export function clearIfiChatbotLocalStorage(chatbotId?: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const id = chatbotId?.trim();
    const keysToRemove = new Set<string>();

    for (const k of STATIC_KEYS) {
      keysToRemove.add(k);
    }
    if (id) {
      for (const p of TEACH_PREFIXES) {
        keysToRemove.add(`${p}${id}`);
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (keysToRemove.has(k)) continue;
      if (TEACH_PREFIXES.some((p) => k.startsWith(p))) {
        keysToRemove.add(k);
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* quota / private mode */
  }
}
