import React, { memo } from 'react';
import { Box, Typography, TextField, Divider } from '@mui/material';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface FormOptionalSectionProps {
  formData: WaterQualityFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const FormOptionalSection: React.FC<FormOptionalSectionProps> = memo(({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Optional Fields
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Potassium (K⁺)"
          type="number"
          value={formData.potassium}
          onChange={(e) => onInputChange('potassium', e.target.value ? Number(e.target.value) : '')}
          inputProps={{ step: 0.1, min: 0 }}
          helperText="mg/L (optional)"
        />
        <Box />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes & Observations"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          helperText="Record any observations about water appearance, weather conditions, or sampling notes"
          placeholder="e.g., Clear water, sunny day, high tide, algae bloom observed..."
        />
      </Box>
    </Box>
  );
});

FormOptionalSection.displayName = 'FormOptionalSection';

export default FormOptionalSection; 