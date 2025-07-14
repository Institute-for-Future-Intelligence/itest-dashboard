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
import { AuthButton, AuthFeedback, LoadingOverlay } from '../components/auth';
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
      <LoadingOverlay show={authState === 'loading'} />

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
            width: 420, 
            maxWidth: '100%',
            borderRadius: 3,
            boxShadow: theme.shadows[6],
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transform: isSuccess ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease-in-out',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          />
          
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
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 1,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Nā Puna ʻIke
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    mb: 2,
                  }}
                >
                  Springs of Knowledge
                </Typography>
                <AuthFeedback authState={authState} error={error} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <AuthButton authState={authState} onLogin={handleLogin} />
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