import type { ReactNode } from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import LoadingOverlay from './LoadingOverlay';

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { isInitialized, initializationError, resetAuthState } = useAuthStore();
  const location = useLocation();
  
  // Define public routes that don't need to wait for auth initialization
  // This prevents the loading spinner from showing on the login page
  const publicRoutes = ['/', '/logout'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // For public routes, render immediately without waiting for auth initialization
  // This fixes the issue where login page showed a loading spinner on first load
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, wait for auth initialization to complete
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