import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Box, useTheme } from '@mui/material';
import { ChatbotInterface, TeachModeInterface } from 'chatbot-interface-ifi';
import { useUserStore } from '../../store/useUserStore';
import { chatbotSessionService } from '../../firebase/chatbotSessionService';
import { PatMinimizedToggle } from './PatMinimizedToggle';

const CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

const shellExpandedStorageKey = (uid: string) => `npike-pat-shell-expanded-${uid}`;
const Z_MINIMIZE_CHROME = 1230;

/** MUI `CloseRounded` path (IFI header close uses this icon). */
const MUI_CLOSE_ROUNDED_D_PREFIX = 'M18.3 5.71';

function isIfiHeaderCloseButton(target: EventTarget | null, shellRoot: HTMLElement | null): boolean {
  if (!shellRoot || !(target instanceof Node) || !shellRoot.contains(target)) return false;
  const btn = (target as HTMLElement).closest?.('button');
  if (!btn || !shellRoot.contains(btn)) return false;
  const d = btn.querySelector('svg path')?.getAttribute('d');
  return Boolean(d?.startsWith(MUI_CLOSE_ROUNDED_D_PREFIX));
}

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
  const [shellExpanded, setShellExpanded] = useState(false);
  const shellRootRef = useRef<HTMLDivElement | null>(null);

  const setShellExpandedPersist = useCallback((expanded: boolean, uidForStorage: string) => {
    setShellExpanded(expanded);
    try {
      localStorage.setItem(shellExpandedStorageKey(uidForStorage), String(expanded));
    } catch {
      /* ignore */
    }
  }, []);

  /** Reset mode; shell starts minimized unless user previously left it open for this uid */
  useEffect(() => {
    if (!user?.uid) return;
    setMode('chat');
    try {
      const raw = localStorage.getItem(shellExpandedStorageKey(user.uid));
      setShellExpanded(raw === 'true');
    } catch {
      setShellExpanded(false);
    }
  }, [user?.uid]);

  /**
   * IFI does not expose onClose. Intercept the header close control (MUI CloseRounded) in capture
   * phase so IFI never enters its internal “FAB” state — host shell goes straight to the PAT button.
   */
  useEffect(() => {
    if (!shellExpanded || !user?.uid) return;
    const uid = user.uid;
    const onPointerDownCapture = (e: PointerEvent) => {
      if (!isIfiHeaderCloseButton(e.target, shellRootRef.current)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setShellExpandedPersist(false, uid);
    };
    window.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => window.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [shellExpanded, user?.uid, setShellExpandedPersist]);

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

      <Box
        ref={shellRootRef}
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1090,
        }}
      >
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
      </Box>
    </>
  );
});

AuthenticatedChatbot.displayName = 'AuthenticatedChatbot';

export default AuthenticatedChatbot;
