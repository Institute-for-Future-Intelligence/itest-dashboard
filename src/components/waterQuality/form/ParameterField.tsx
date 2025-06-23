import React, { memo } from 'react';
import { Box, TextField, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import { WATER_QUALITY_VALIDATION } from '../../../types/waterQuality';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface ParameterFieldProps {
  field: keyof WaterQualityFormData;
  label: string;
  iconComponent: React.ReactNode;
  value: string | number | '';
  onInputChange: (field: string, value: string | number) => void;
}

const ParameterField: React.FC<ParameterFieldProps> = memo(({
  field,
  label,
  iconComponent,
  value,
  onInputChange,
}) => {
  // Get validation info for this parameter
  const getValidationInfo = () => {
    const validation = WATER_QUALITY_VALIDATION.find(v => v.parameter === field);
    if (!validation) return null;
    
    return {
      range: `${validation.min}-${validation.max} ${validation.unit}`,
      typical: { min: validation.typical.min, max: validation.typical.max },
      unit: validation.unit
    };
  };

  const validationInfo = getValidationInfo();
  const numValue = typeof value === 'number' ? value : (value === '' ? undefined : Number(value));
  
  // Check if value is outside typical range
  const isOutsideTypical = validationInfo && numValue !== undefined && 
    (numValue < validationInfo.typical.min || numValue > validationInfo.typical.max);

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        label={label}
        type="number"
        value={value}
        onChange={(e) => onInputChange(field, e.target.value ? Number(e.target.value) : '')}
        inputProps={{ 
          step: field === 'conductivity' ? 1 : 0.1,
          min: 0
        }}
        helperText={validationInfo?.range}
        error={isOutsideTypical || false}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              {iconComponent}
            </Box>
          ),
        }}
      />
      {validationInfo && (
        <Tooltip 
          title={`Typical: ${validationInfo.typical.min}-${validationInfo.typical.max} ${validationInfo.unit}`} 
          placement="top"
        >
          <IconButton
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              color: 'text.secondary'
            }}
          >
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
});

ParameterField.displayName = 'ParameterField';

export default ParameterField; 