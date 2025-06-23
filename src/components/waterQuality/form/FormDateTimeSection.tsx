import React, { memo } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface FormDateTimeSectionProps {
  formData: WaterQualityFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const FormDateTimeSection: React.FC<FormDateTimeSectionProps> = memo(({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Schedule color="primary" />
        <Typography variant="h6">
          Date & Time
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          fullWidth
          required
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => onInputChange('date', e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: new Date().toISOString().split('T')[0] }}
        />
        <TextField
          fullWidth
          required
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => onInputChange('time', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </Box>
  );
});

FormDateTimeSection.displayName = 'FormDateTimeSection';

export default FormDateTimeSection; 