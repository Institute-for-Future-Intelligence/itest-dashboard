import { Box, Button, Tooltip, useTheme, alpha } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Water,
  Cloud,
  Sensors,
  AdminPanelSettings,
} from '@mui/icons-material';
import type { NavigationItem } from './NavigationConfig';

const iconMap = {
  Home: <Home />,
  Water: <Water />,
  Cloud: <Cloud />,
  Sensors: <Sensors />,
  AdminPanelSettings: <AdminPanelSettings />,
};

interface DesktopNavigationProps {
  navItems: NavigationItem[];
}

const DesktopNavigation = ({ navItems }: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: { xs: 'none', md: 'flex' }, 
      alignItems: 'center', 
      gap: 1,
      padding: '4px',
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.background.default, 0.3),
      backdropFilter: 'blur(10px)',
    }}>
      {navItems.map((item) => (
        <Tooltip key={item.path} title={item.description} arrow>
          <Button
            onClick={() => navigate(item.path)}
            startIcon={iconMap[item.iconName]}
            sx={{
              color: location.pathname === item.path 
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              fontWeight: location.pathname === item.path ? 600 : 500,
              backgroundColor: location.pathname === item.path 
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                : 'transparent',
              backgroundImage: location.pathname === item.path
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                : 'none',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              minWidth: 'auto',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: location.pathname === item.path
                  ? alpha(theme.palette.primary.main, 0.9)
                  : alpha(theme.palette.primary.main, 0.1),
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: location.pathname === item.path
                  ? 'transparent'
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                opacity: 0,
                transition: 'opacity 0.2s ease',
                zIndex: -1,
              },
              '&:hover::before': {
                opacity: location.pathname === item.path ? 0 : 0.1,
              },
            }}
          >
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              {item.label}
            </Box>
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
};

export default DesktopNavigation; 