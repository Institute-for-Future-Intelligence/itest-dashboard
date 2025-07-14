import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { usePermissions } from '../../hooks/usePermissions';
import { getNavItemsForUser } from './NavigationConfig';
import AppBrand from './AppBrand';
import DesktopNavigation from './DesktopNavigation';
import MobileDrawer from './MobileDrawer';
import ProfileMenu from './ProfileMenu';

interface NavigationBarProps {
  onLogout: () => void;
}

const NavigationBar = ({ onLogout }: NavigationBarProps) => {
  const theme = useTheme();
  const colorMode = useThemeStore();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const permissions = usePermissions();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = getNavItemsForUser(permissions);

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[1],
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ 
          minHeight: 72, 
          px: { xs: 2, sm: 4 },
          py: 1,
        }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <AppBrand />
          </Box>

          {/* Center section - Page title for mobile */}
          {isMobile && (
            <Box sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              mx: 2,
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: theme.palette.text.primary,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {getCurrentPageTitle()}
              </Typography>
            </Box>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
              <DesktopNavigation navItems={navItems} />
            </Box>
          )}

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme toggle */}
            <Tooltip title={`Switch to ${colorMode.mode === 'light' ? 'dark' : 'light'} theme`}>
              <IconButton
                onClick={colorMode.toggleMode}
                sx={{
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {colorMode.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>

            {/* Profile menu */}
            <ProfileMenu onLogout={onLogout} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};

export default NavigationBar; 