import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useThemeStore } from './store/useThemeStore';
import { getDesignTokens } from './theme/theme';
import { createTheme } from '@mui/material/styles';

const Root = () => {
  const mode = useThemeStore((state) => state.mode);
  const theme = createTheme(getDesignTokens(mode));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);