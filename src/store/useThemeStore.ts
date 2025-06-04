// src/store/useThemeStore.ts
import { create } from 'zustand';

interface ThemeState {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  toggleMode: () =>
    set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
}));