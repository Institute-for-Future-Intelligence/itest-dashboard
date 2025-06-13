import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

interface EmptyStateProps {
  loading?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading visualization...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">
        No data to visualize
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Upload some sensor data to see charts and statistics.
      </Typography>
    </Box>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState; 