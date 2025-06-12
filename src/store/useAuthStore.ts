import { create } from 'zustand';

interface AuthStore {
  // Simple auth state - no persistence preferences needed
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  // Initial state
  isInitialized: false,

  // Actions
  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },

  resetAuthState: () => {
    set({
      isInitialized: false,
    });
  },
})); 