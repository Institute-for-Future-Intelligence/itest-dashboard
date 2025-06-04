// src/pages/LoginPage.tsx
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({ uid: user.uid });
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: 360, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Avatar
              alt="iTEST"
              sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}
            >
              I
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              iTEST DS Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleLogin}
              sx={{
                bgcolor: '#DB4437',
                '&:hover': {
                  bgcolor: '#c1351d',
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
              fullWidth
            >
              Sign in with Google
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;