import type { ReactNode } from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';
import LoadingOverlay from './LoadingOverlay';

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { isInitialized, initializationError, resetAuthState } = useAuthStore();

  // Show loading overlay while Firebase auth is initializing
  if (!isInitialized) {
    return <LoadingOverlay show={true} />;
  }

  // Show error state if authentication initialization failed
  if (initializationError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Authentication Error
        </Typography>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
          {initializationError}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => {
            resetAuthState();
            window.location.reload();
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Auth is initialized and ready - render children
  return <>{children}</>;
};

export default AuthInitializer; 