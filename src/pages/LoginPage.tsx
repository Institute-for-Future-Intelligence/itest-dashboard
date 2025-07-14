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
import Footer from '../components/layout/Footer';

function LoginPage() {
  const { authState, error, handleLogin, isSuccess } = useAuthState();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <LoadingOverlay show={authState === 'loading'} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
                alt="Nā Puna ʻIke"
                sx={{ 
                  bgcolor: isSuccess ? '#4caf50' : 'primary.main', 
                  width: 56, 
                  height: 56,
                  transition: 'background-color 0.3s ease-in-out',
                }}
              >
                {isSuccess ? <CheckIcon /> : 'NP'}
              </Avatar>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600}>
                  Nā Puna ʻIke
                </Typography>
                <AuthFeedback authState={authState} error={error} />
              </Box>

              <AuthButton authState={authState} onLogin={handleLogin} />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
}

export default LoginPage;