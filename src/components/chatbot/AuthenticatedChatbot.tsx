import React, { useState, useCallback, useEffect, memo } from 'react';
import { Box, useTheme } from '@mui/material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';
import { PatMinimizedToggle } from './PatMinimizedToggle';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const AuthenticatedChatbot: React.FC = memo(() => {
  const user = useUserStore((s) => s.user);
  const theme = useTheme();

  useEffect(() => {
    if (import.meta.env.DEV && !CHATBOT_ID) {
      console.info(
        '[itest-dashboard] IFI chatbot is hidden locally: set VITE_CHATBOT_ID in the project root `.env` and restart `npm run dev`. Production builds get it from GitHub Actions secrets.'
      );
    }
  }, []);

  const [mode, setMode] = useState<'chat' | 'teach'>('chat');
  const [savedSessionIds, setSavedSessionIds] = useState<string[]>([]);

  /** Reset to chat when switching Firebase account */
  useEffect(() => {
    if (!user?.uid) return;
    setMode('chat');
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    setSavedSessionIds([]);
    void chatbotSessionService.getTeachSessionIds(user.uid).then((ids) => {
      if (!cancelled) {
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

  /**
   * isActive = chat vs teach only. Do not tie to a host "minimized" flag: IFI uses isActive with its
   * own open/close state; forcing false and sliding the panel off-screen hid the built-in FAB.
   */
  const layerSx = useCallback(
    (layer: 'chat' | 'teach') => {
      const active = mode === layer;
      return {
        position: 'fixed' as const,
        bottom: 0,
        right: 0,
        zIndex: active ? 1101 : 1099,
        opacity: active ? 1 : 0,
        pointerEvents: active ? ('auto' as const) : ('none' as const),
        transition: theme.transitions.create('opacity', { duration: 300 }),
      };
    },
    [mode, theme]
  );

  if (!CHATBOT_ID || !user) {
    return null;
  }

  const uid = user.uid;

  return (
    <>
      {/* key=uid forces a new IFI instance per account — avoids showing the previous user's thread */}
      <Box aria-live="polite" aria-hidden={mode !== 'chat'} sx={layerSx('chat')}>
        <ChatbotInterface
          key={`ifi-chat-${uid}`}
          chatbotId={CHATBOT_ID}
          customToggleButton={<PatMinimizedToggle />}
          onConversationStart={handleConversationStart}
          enableGuidedQuestions
          onSwitchToLearn={() => setMode('teach')}
          isActive={mode === 'chat'}
        />
      </Box>
      <Box aria-live="polite" aria-hidden={mode !== 'teach'} sx={layerSx('teach')}>
        <TeachModeInterface
          key={`ifi-teach-${uid}`}
          chatbotId={CHATBOT_ID}
          customToggleButton={<PatMinimizedToggle />}
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
