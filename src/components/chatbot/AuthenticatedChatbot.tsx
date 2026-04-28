import React, { useState, useCallback, useEffect, memo } from 'react';
import { Box } from '@mui/material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const panelStyle = (isActive: boolean): React.CSSProperties => ({
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: 1100,
  opacity: isActive ? 1 : 0,
  pointerEvents: isActive ? 'auto' : 'none',
  transition: 'opacity 0.3s ease',
});

const AuthenticatedChatbot: React.FC = memo(() => {
  const user = useUserStore((s) => s.user);
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

  return (
    <Box aria-live="polite" sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1100 }}>
      <Box sx={{ pointerEvents: 'none' }}>
        <Box sx={panelStyle(mode === 'chat')}>
          <ChatbotInterface
            chatbotId={CHATBOT_ID}
            onConversationStart={handleConversationStart}
            enableGuidedQuestions
            onSwitchToLearn={() => setMode('teach')}
            isActive={mode === 'chat'}
          />
        </Box>
        <Box sx={panelStyle(mode === 'teach')}>
          <TeachModeInterface
            chatbotId={CHATBOT_ID}
            sessionIds={savedSessionIds}
            onSessionStart={handleSessionStart}
            onSwitchToChat={() => setMode('chat')}
            isActive={mode === 'teach'}
          />
        </Box>
      </Box>
    </Box>
  );
});

AuthenticatedChatbot.displayName = 'AuthenticatedChatbot';

export default AuthenticatedChatbot;
