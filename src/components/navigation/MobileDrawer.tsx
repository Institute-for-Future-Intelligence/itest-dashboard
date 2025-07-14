import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Water,
  Cloud,
  Sensors,
  AdminPanelSettings,
  WaterDropOutlined,
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import type { NavigationItem } from './NavigationConfig';
import { getRoleColor } from './NavigationConfig';

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
          width: 320,
          backgroundImage: 'none',
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: theme.shadows[3],
            }}
          >
            <WaterDropOutlined sx={{ fontSize: '1.5rem' }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Nā Puna ʻIke
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Springs of Knowledge
            </Typography>
          </Box>
        </Stack>
        
        <Chip
          label={permissions.user?.role?.toUpperCase() || 'UNKNOWN'}
          sx={{
            backgroundColor: getRoleColor(permissions.user?.role || ''),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            height: 28,
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Navigation List */}
      <List sx={{ py: 2, px: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 3,
                minHeight: 56,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  backgroundColor: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40,
                  transition: 'color 0.2s ease',
                }}
              >
                {iconMap[item.iconName]}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                secondary={item.description}
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '1rem',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ mt: 'auto', p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          Environmental Data Platform
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer; 