declare module 'chatbot-interface-ifi' {
  import type { ReactElement, RefAttributes } from 'react';

  export interface ChatbotInterfaceProps {
    chatbotId: string;
    onConversationStart?: (conversationId: string) => void;
    enableGuidedQuestions?: boolean;
    customToggleButton?: ReactElement;
    onSwitchToLearn?: () => void;
    isActive?: boolean;
  }

  export interface TeachModeInterfaceProps {
    chatbotId: string;
    sessionIds: string[];
    initialSessionId?: string | null;
    onSessionStart?: (sessionId: string) => void;
    onSwitchToChat?: () => void;
    customToggleButton?: ReactElement;
    isActive?: boolean;
    showRestartButton?: boolean;
  }

  export type ChatbotHandle = { endConversation: () => void };
  export type TeachModeHandle = { createNewSession: () => void };

  export const ChatbotInterface: import('react').ForwardRefExoticComponent<
    ChatbotInterfaceProps & RefAttributes<ChatbotHandle>
  >;
  export const TeachModeInterface: import('react').ForwardRefExoticComponent<
    TeachModeInterfaceProps & RefAttributes<TeachModeHandle>
  >;
}
