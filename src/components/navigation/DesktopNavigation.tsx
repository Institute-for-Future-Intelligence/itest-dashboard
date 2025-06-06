import { Box, Button, Tooltip, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
      {navItems.map((item) => (
        <Tooltip key={item.path} title={item.description} arrow>
          <Button
            onClick={() => navigate(item.path)}
            startIcon={iconMap[item.iconName]}
            sx={{
              color: location.pathname === item.path 
                ? theme.palette.secondary.main 
                : 'rgba(255, 255, 255, 0.8)',
              fontWeight: location.pathname === item.path ? 600 : 400,
              backgroundColor: location.pathname === item.path 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'transparent',
              backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              minWidth: 'auto',
              // Remove focus outline and prevent layout shifts
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                // Removed transform to prevent layout shift
              },
              '&:active': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'none', // Prevent any scaling/movement on click
              },
              transition: 'background-color 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out',
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