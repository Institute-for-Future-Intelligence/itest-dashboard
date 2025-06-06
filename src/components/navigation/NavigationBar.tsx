import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
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
        color="primary"
        elevation={1}
      >
        <Toolbar sx={{ minHeight: 70, px: { xs: 2, sm: 3 } }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
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
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {getCurrentPageTitle()}
              </Typography>
            </Box>
          )}

          {/* Right section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            marginLeft: 'auto',
          }}>
            <DesktopNavigation navItems={navItems} />
            
            {/* Theme toggle */}
            <Tooltip title="Toggle theme" arrow>
              <IconButton 
                onClick={colorMode.toggleMode} 
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <ProfileMenu onLogout={onLogout} />
          </Box>
        </Toolbar>
      </AppBar>

      <MobileDrawer 
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};

export default NavigationBar; 