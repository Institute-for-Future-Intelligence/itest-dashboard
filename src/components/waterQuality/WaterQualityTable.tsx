import React, { memo } from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';

const WaterQualityTable: React.FC = memo(() => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Water Quality Data Table
      </Typography>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Data table will be implemented with sorting, filtering, and pagination.
        </Typography>
      </Box>
    </Paper>
  );
});

WaterQualityTable.displayName = 'WaterQualityTable';

export default WaterQualityTable; 