import React, { memo } from 'react';
import {
  Paper,
  Typography,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface AdminPanelProps {
  onNavigateToAdmin: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = memo(({ onNavigateToAdmin }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mt: 3, 
        p: 3, 
        borderRadius: 2,
        border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
        backgroundColor: alpha(theme.palette.error.main, 0.05)
      }}
    >
      <Typography variant="h6" color="error" gutterBottom>
        Admin Access Available
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You have administrative privileges to manage users and system settings.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={onNavigateToAdmin}
        startIcon={<ArrowForward />}
      >
        Access Admin Panel
      </Button>
    </Paper>
  );
});

AdminPanel.displayName = 'AdminPanel';

export default AdminPanel; 