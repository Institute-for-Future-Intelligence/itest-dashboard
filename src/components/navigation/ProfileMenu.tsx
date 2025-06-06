import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { getRoleColor } from './NavigationConfig';

interface ProfileMenuProps {
  onLogout: () => void;
}

const ProfileMenu = ({ onLogout }: ProfileMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const permissions = usePermissions();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  return (
    <>
      <Tooltip title="Profile menu" arrow>
        <IconButton
          onClick={handleMenuOpen}
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
          <AccountCircle />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 200,
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Signed in as
          </Typography>
          <Chip
            label={permissions.user?.role?.toUpperCase() || 'UNKNOWN'}
            size="small"
            sx={{
              backgroundColor: getRoleColor(permissions.user?.role || ''),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              mt: 1,
            }}
          />
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
          <Logout fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu; 