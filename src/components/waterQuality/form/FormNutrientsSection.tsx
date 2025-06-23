import React, { memo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { WaterDrop } from '@mui/icons-material';
import ParameterField from './ParameterField';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface FormNutrientsSectionProps {
  formData: WaterQualityFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const FormNutrientsSection: React.FC<FormNutrientsSectionProps> = memo(({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <WaterDrop color="primary" />
        <Typography variant="h6">
          Nutrients (mg/L)
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter nutrient concentrations in milligrams per liter (mg/L)
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        <ParameterField
          field="nitrate"
          label="Nitrate (NO₃⁻)"
          iconComponent="💧"
          value={formData.nitrate}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="nitrite"
          label="Nitrite (NO₂⁻)"
          iconComponent="💧"
          value={formData.nitrite}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="ammonia"
          label="Ammonia (NH₃/NH₄⁺)"
          iconComponent="💧"
          value={formData.ammonia}
          onInputChange={onInputChange}
        />
        <ParameterField
          field="phosphate"
          label="Phosphate (PO₄³⁻)"
          iconComponent="💧"
          value={formData.phosphate}
          onInputChange={onInputChange}
        />
      </Box>
    </Box>
  );
});

FormNutrientsSection.displayName = 'FormNutrientsSection';

export default FormNutrientsSection; 