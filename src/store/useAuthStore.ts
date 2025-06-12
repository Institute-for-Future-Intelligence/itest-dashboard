import { create } from 'zustand';

interface AuthStore {
  // Auth state management
  isInitialized: boolean;
  initializationError: string | null;
  setInitialized: (initialized: boolean) => void;
  setInitializationError: (error: string | null) => void;
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  // Initial state
  isInitialized: false,
  initializationError: null,

  // Actions
  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized, initializationError: null });
  },

  setInitializationError: (error: string | null) => {
    set({ initializationError: error, isInitialized: true });
  },

  resetAuthState: () => {
    set({
      isInitialized: false,
      initializationError: null,
    });
  },
})); 