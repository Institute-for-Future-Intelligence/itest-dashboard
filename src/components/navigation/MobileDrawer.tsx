import {
  Drawer,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  Water,
  Cloud,
  Sensors,
  AdminPanelSettings,
} from '@mui/icons-material';
import type { NavigationItem } from './NavigationConfig';
import { getRoleColor } from './NavigationConfig';
import { usePermissions } from '../../hooks/usePermissions';

const iconMap = {
  Home: <Home />,
  Water: <Water />,
  Cloud: <Cloud />,
  Sensors: <Sensors />,
  AdminPanelSettings: <AdminPanelSettings />,
};

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavigationItem[];
}

const MobileDrawer = ({ open, onClose, navItems }: MobileDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const permissions = usePermissions();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundImage: 'none',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Nā Puna ʻIke
        </Typography>
        <Chip
          label={permissions.user?.role?.toUpperCase() || 'UNKNOWN'}
          sx={{
            backgroundColor: getRoleColor(permissions.user?.role || ''),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            mb: 2,
          }}
        />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {iconMap[item.iconName]}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                secondary={item.description}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileDrawer; 