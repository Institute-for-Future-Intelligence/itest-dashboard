// src/pages/LoginPage.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { useAuthState } from '../hooks/useAuthState';
import { AuthButton, AuthFeedback, LoadingOverlay } from '../components/auth';

function LoginPage() {
  const { authState, error, handleLogin, isSuccess } = useAuthState();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <LoadingOverlay show={authState === 'loading'} />

      <Card 
        sx={{ 
          width: 360, 
          p: 2, 
          boxShadow: isSuccess ? 6 : 3,
          transform: isSuccess ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Avatar
              alt="iTEST"
              sx={{ 
                bgcolor: isSuccess ? '#4caf50' : 'primary.main', 
                width: 56, 
                height: 56,
                transition: 'background-color 0.3s ease-in-out',
              }}
            >
              {isSuccess ? <CheckIcon /> : 'I'}
            </Avatar>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600}>
                iTEST DS Dashboard
              </Typography>
              <AuthFeedback authState={authState} error={error} />
            </Box>

            <AuthButton authState={authState} onLogin={handleLogin} />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;