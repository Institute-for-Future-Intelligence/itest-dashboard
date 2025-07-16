// src/pages/LoginPage.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import { CheckCircle as CheckIcon, WaterDropOutlined } from '@mui/icons-material';
import { useAuthState } from '../hooks/useAuthState';
import { AuthButton, AuthFeedback } from '../components/auth';
import Footer from '../components/layout/Footer';

function LoginPage() {
  const { authState, error, handleLogin, isSuccess } = useAuthState();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            maxWidth: 480,
            width: '100%',
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80,
                    background: isSuccess 
                      ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: theme.shadows[4],
                    transition: 'all 0.3s ease-in-out',
                    fontSize: '2rem',
                    mb: 1,
                  }}
                >
                  {isSuccess ? (
                    <CheckIcon sx={{ fontSize: '2rem' }} />
                  ) : (
                    <WaterDropOutlined sx={{ fontSize: '2rem' }} />
                  )}
                </Avatar>
                
                {/* Animated rings */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    animation: isSuccess ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(1.2)',
                        opacity: 0,
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                  }}
                >
                  {isSuccess ? 'Welcome Back!' : 'Nā Puna ʻIke'}
                </Typography>
                
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  {isSuccess ? 'Redirecting to dashboard...' : 'Springs of Knowledge'}
                </Typography>
                
                <AuthFeedback authState={authState} error={error} />
              </Box>

              <Box sx={{ width: '100%', maxWidth: 320 }}>
                <AuthButton
                  authState={authState}
                  onLogin={handleLogin}
                />
              </Box>

              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Data Dashboard for Environmental Research
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
}

export default LoginPage;