import React from 'react';
import {
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import type { WeatherVariable } from '../../../types/weather';

interface VariableItemProps {
  variable: WeatherVariable;
  isSelected: boolean;
  onToggle: (variableId: string) => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  isSelected,
  onToggle,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(variable.apiParam)}
          size="small"
        />
      }
      label={
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {variable.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Unit: {variable.unit}
            {variable.description && ` • ${variable.description}`}
          </Typography>
        </Box>
      }
      sx={{ 
        alignItems: 'flex-start',
        mb: 0.5,
        '& .MuiFormControlLabel-label': { mt: -0.25 }
      }}
    />
  );
};

export default VariableItem; 