import React, { useState, useCallback, useEffect, memo } from 'react';
import { Box } from '@mui/material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const AuthenticatedChatbot: React.FC = memo(() => {
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (import.meta.env.DEV && !CHATBOT_ID) {
      console.info(
        '[itest-dashboard] IFI chatbot is hidden locally: set VITE_CHATBOT_ID in the project root `.env` and restart `npm run dev`. Production builds get it from GitHub Actions secrets.'
      );
    }
  }, []);
  const [mode, setMode] = useState<'chat' | 'teach'>('chat');
  const [savedSessionIds, setSavedSessionIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    chatbotSessionService.getTeachSessionIds(user.uid).then((ids) => {
      if (!cancelled && ids.length > 0) {
        setSavedSessionIds(ids);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const handleSessionStart = useCallback(
    (newSessionId: string) => {
      setSavedSessionIds((prev) => {
        const next = prev.includes(newSessionId) ? prev : [newSessionId, ...prev];
        if (user?.uid) {
          void chatbotSessionService.saveTeachSessionIds(user.uid, next);
        }
        return next;
      });
    },
    [user?.uid]
  );

  const handleConversationStart = useCallback(
    (conversationId: string) => {
      if (user?.uid) {
        void chatbotSessionService.recordConversationStart(user.uid, conversationId);
      }
    },
    [user?.uid]
  );

  if (!CHATBOT_ID || !user) {
    return null;
  }

  /* No full-screen pointer-events:none wrapper — it can block IFI header controls (e.g. close).
     Inactive mode stays pointer-events:none and below active z-index so it never steals clicks. */
  return (
    <>
      <Box
        aria-live="polite"
        aria-hidden={mode !== 'chat'}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: mode === 'chat' ? 1101 : 1099,
          opacity: mode === 'chat' ? 1 : 0,
          pointerEvents: mode === 'chat' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <ChatbotInterface
          chatbotId={CHATBOT_ID}
          onConversationStart={handleConversationStart}
          enableGuidedQuestions
          onSwitchToLearn={() => setMode('teach')}
          isActive={mode === 'chat'}
        />
      </Box>
      <Box
        aria-live="polite"
        aria-hidden={mode !== 'teach'}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: mode === 'teach' ? 1101 : 1099,
          opacity: mode === 'teach' ? 1 : 0,
          pointerEvents: mode === 'teach' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <TeachModeInterface
          chatbotId={CHATBOT_ID}
          sessionIds={savedSessionIds}
          onSessionStart={handleSessionStart}
          onSwitchToChat={() => setMode('chat')}
          isActive={mode === 'teach'}
        />
      </Box>
    </>
  );
});

AuthenticatedChatbot.displayName = 'AuthenticatedChatbot';

export default AuthenticatedChatbot;
