import React, { useState, useCallback, useEffect, memo } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';
import { PatMinimizedToggle } from './PatMinimizedToggle';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const shellExpandedStorageKey = (uid: string) => `npike-pat-shell-expanded-${uid}`;
const Z_MINIMIZE_CHROME = 1230;

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
  const [shellExpanded, setShellExpanded] = useState(true);

  const setShellExpandedPersist = useCallback((expanded: boolean, uidForStorage: string) => {
    setShellExpanded(expanded);
    try {
      localStorage.setItem(shellExpandedStorageKey(uidForStorage), String(expanded));
    } catch {
      /* ignore */
    }
  }, []);

  /** Reset mode + default expanded when switching Firebase account */
  useEffect(() => {
    if (!user?.uid) return;
    setMode('chat');
    try {
      const raw = localStorage.getItem(shellExpandedStorageKey(user.uid));
      setShellExpanded(raw !== 'false');
    } catch {
      setShellExpanded(true);
    }
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
   * IFI open/close + custom toggle is unreliable in our layout. Host `shellExpanded` hides the whole
   * widget visually while keeping it mounted so conversations / teach state stay in memory + IFI localStorage.
   */
  const layerSx = useCallback(
    (layer: 'chat' | 'teach') => {
      const active = mode === layer;
      const collapsed =
        !shellExpanded &&
        ({
          opacity: 0,
          pointerEvents: 'none' as const,
          visibility: 'hidden' as const,
          width: 1,
          height: 1,
          maxWidth: 1,
          maxHeight: 1,
          overflow: 'hidden' as const,
          clipPath: 'inset(50%)',
        } as const);

      return {
        position: 'fixed' as const,
        bottom: 0,
        right: 0,
        zIndex: active ? 1101 : 1099,
        opacity: active ? 1 : 0,
        pointerEvents: active ? ('auto' as const) : ('none' as const),
        transition: theme.transitions.create(['opacity', 'visibility'], { duration: 300 }),
        visibility: 'visible' as const,
        ...(!shellExpanded ? collapsed : {}),
      };
    },
    [mode, theme, shellExpanded]
  );

  if (!CHATBOT_ID || !user) {
    return null;
  }

  const uid = user.uid;

  return (
    <>
      {!shellExpanded && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: Z_MINIMIZE_CHROME,
          }}
        >
          <PatMinimizedToggle onClick={() => setShellExpandedPersist(true, uid)} />
        </Box>
      )}

      {shellExpanded && (
        <Tooltip title="Hide tutor (PAT) — your session is kept">
          <IconButton
            aria-label="Hide Personalized Academic Tutor"
            color="inherit"
            onClick={() => setShellExpandedPersist(false, uid)}
            size="large"
            sx={{
              position: 'fixed',
              right: 16,
              bottom: { xs: 96, sm: 88 },
              zIndex: Z_MINIMIZE_CHROME,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover', boxShadow: 4 },
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </Tooltip>
      )}

      <Box aria-live="polite" aria-hidden={mode !== 'chat'} sx={layerSx('chat')}>
        <ChatbotInterface
          key={`ifi-chat-${uid}`}
          chatbotId={CHATBOT_ID}
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
