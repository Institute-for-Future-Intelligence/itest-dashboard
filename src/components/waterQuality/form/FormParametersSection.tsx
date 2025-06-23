import React, { memo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Science } from '@mui/icons-material';
import ParameterField from './ParameterField';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface FormParametersSectionProps {
  formData: WaterQualityFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const FormParametersSection: React.FC<FormParametersSectionProps> = memo(({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Science color="primary" />
        <Typography variant="h6">
          Physical Parameters
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        <ParameterField
          field="temperature"
          label="Temperature (°C)"
          iconComponent="🌡️"
          value={formData.temperature}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="ph"
          label="pH"
          iconComponent="⚗️"
          value={formData.ph}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="salinity"
          label="Salinity (ppt)"
          iconComponent="🧂"
          value={formData.salinity}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="conductivity"
          label="Conductivity (µS/cm)"
          iconComponent="⚡"
          value={formData.conductivity}
          onInputChange={onInputChange}
        />
      </Box>
    </Box>
  );
});

FormParametersSection.displayName = 'FormParametersSection';

export default FormParametersSection; 