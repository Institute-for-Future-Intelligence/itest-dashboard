import React, { memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const WaterQualityForm: React.FC = memo(() => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Water Quality Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Record water quality measurements from your monitoring location. 
        Form will be implemented with full functionality.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          disabled
        >
          Form Coming Soon
        </Button>
      </Box>
    </Paper>
  );
});

WaterQualityForm.displayName = 'WaterQualityForm';

export default WaterQualityForm; 