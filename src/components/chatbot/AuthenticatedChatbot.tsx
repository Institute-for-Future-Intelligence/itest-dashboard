import React, { useState, useCallback, useEffect, memo } from 'react';
import {
  Box,
  Fab,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Chat, KeyboardArrowDown } from '@mui/icons-material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const minimizedStorageKey = (uid: string) => `npike-chatbot-minimized-${uid}`;

const Z_HOST_CHROME = 1210;

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
  const [minimized, setMinimized] = useState(false);

  const setMinimizedPersist = useCallback(
    (value: boolean, uid: string) => {
      setMinimized(value);
      try {
        localStorage.setItem(minimizedStorageKey(uid), String(value));
      } catch {
        // ignore quota / privacy mode
      }
    },
    []
  );

  /** Per-account minimize preference + reset chat/teach mode when switching users */
  useEffect(() => {
    if (!user?.uid) return;
    try {
      setMinimized(localStorage.getItem(minimizedStorageKey(user.uid)) === 'true');
    } catch {
      setMinimized(false);
    }
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

  /** One fixed corner stack: slide off-screen when host-minimized OR fade when inactive mode */
  const layerSx = useCallback(
    (layer: 'chat' | 'teach') => {
      const active = mode === layer;
      const tDock = theme.transitions.create(['transform', 'opacity', 'visibility'], {
        duration: theme.transitions.duration.short,
        easing: theme.transitions.easing.easeInOut,
      });
      const tFade = theme.transitions.create('opacity', { duration: 300 });

      return {
        position: 'fixed' as const,
        bottom: 0,
        right: 0,
        zIndex: active ? 1101 : 1099,
        ...(minimized
          ? {
              opacity: 0,
              visibility: 'hidden' as const,
              pointerEvents: 'none' as const,
              transform: 'translateY(105vh)',
              transition: tDock,
            }
          : {
              opacity: active ? 1 : 0,
              pointerEvents: active ? ('auto' as const) : ('none' as const),
              visibility: 'visible' as const,
              transform: 'translateY(0)',
              transition: tFade,
            }),
      };
    },
    [mode, minimized, theme]
  );

  if (!CHATBOT_ID || !user) {
    return null;
  }

  const uid = user.uid;

  return (
    <>
      {/* Host chrome — IFI-built-in close/minimize is unreliable */}
      {!minimized && (
        <Tooltip title="Hide AI Tutor (keeps your session)">
          <IconButton
            aria-label="Hide AI Tutor"
            color="inherit"
            onClick={() => setMinimizedPersist(true, uid)}
            sx={{
              position: 'fixed',
              right: 16,
              bottom: { xs: 96, sm: 88 },
              zIndex: Z_HOST_CHROME,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover', boxShadow: 4 },
            }}
            size="large"
          >
            <KeyboardArrowDown />
          </IconButton>
        </Tooltip>
      )}

      {minimized && (
        <Tooltip title="Open AI Tutor">
          <Fab
            color="secondary"
            aria-label="Open AI Tutor"
            size="medium"
            onClick={() => setMinimizedPersist(false, uid)}
            sx={{
              position: 'fixed',
              right: 24,
              bottom: 24,
              zIndex: Z_HOST_CHROME,
            }}
          >
            <Chat />
          </Fab>
        </Tooltip>
      )}

      {/* key=uid forces a new IFI instance per account — avoids showing the previous user's thread */}
      <Box aria-live="polite" aria-hidden={mode !== 'chat'} sx={layerSx('chat')}>
        <ChatbotInterface
          key={`ifi-chat-${uid}`}
          chatbotId={CHATBOT_ID}
          onConversationStart={handleConversationStart}
          enableGuidedQuestions
          onSwitchToLearn={() => setMode('teach')}
          isActive={mode === 'chat' && !minimized}
        />
      </Box>
      <Box aria-live="polite" aria-hidden={mode !== 'teach'} sx={layerSx('teach')}>
        <TeachModeInterface
          key={`ifi-teach-${uid}`}
          chatbotId={CHATBOT_ID}
          sessionIds={savedSessionIds}
          onSessionStart={handleSessionStart}
          onSwitchToChat={() => setMode('chat')}
          isActive={mode === 'teach' && !minimized}
        />
      </Box>
    </>
  );
});

AuthenticatedChatbot.displayName = 'AuthenticatedChatbot';

export default AuthenticatedChatbot;
