// src/layout/AuthenticatedLayout.tsx
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '../store/useThemeStore';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Weather Data', path: '/weather' },
  { label: 'Sensor Data', path: '/sensors' },
  { label: 'Water Quality', path: '/water-quality' },
];

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearUser = useUserStore((state) => state.clearUser);
  const theme = useTheme();
  const colorMode = useThemeStore();

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky AppBar */}
      <AppBar
        position="sticky"
        color="primary"
        elevation={1}
        sx={{
          width: '100%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar
            disableGutters
            sx={{
                width: '100%',
                minHeight: 64,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'Gabarito, sans-serif' }}>
            iTEST Data Science Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color:
                    location.pathname === item.path
                      ? theme.palette.secondary.main
                      : '#fff',
                  fontWeight:
                    location.pathname === item.path ? 'bold' : 'normal',
                  fontFamily: 'Gabarito, sans-serif',
                  '&:hover': {
                    color: theme.palette.secondary.light,
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ fontFamily: 'Gabarito, sans-serif' }}
            >
              Logout
            </Button>
            <IconButton onClick={colorMode.toggleMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 3,
          mb: 3,
          px: { xs: 2, sm: 3, md: 4 },
          flexGrow: 1,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default AuthenticatedLayout;