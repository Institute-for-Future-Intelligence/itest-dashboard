// src/theme/theme.ts
import type { ThemeOptions } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#222' },
          secondary: { main: '#666' },
          background: {
            default: '#f9f9f9',
            paper: '#ffffff',
          },
          text: {
            primary: '#111',
            secondary: '#444',
          },
        }
      : {
          primary: { main: '#fff' },
          secondary: { main: '#bbb' },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#fff',
            secondary: '#ccc',
          },
        }),
  },

  typography: {
    fontFamily: `'Gabarito', sans-serif`,
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: Array(25).fill(
    '0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)'
  ) as ThemeOptions['shadows'],
});