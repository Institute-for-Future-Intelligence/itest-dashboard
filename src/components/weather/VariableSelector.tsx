import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
} from '@mui/material';
import type { WeatherVariable } from '../../types/weather';

interface VariableSelectorProps {
  title: string;
  variables: WeatherVariable[];
  selectedVariables: string[];
  onVariableChange: (variableIds: string[]) => void;
}

const VariableSelector = ({ 
  title, 
  variables, 
  selectedVariables, 
  onVariableChange 
}: VariableSelectorProps) => {
  const handleVariableToggle = (variableId: string) => {
    const isSelected = selectedVariables.includes(variableId);
    
    if (isSelected) {
      onVariableChange(selectedVariables.filter(id => id !== variableId));
    } else {
      onVariableChange([...selectedVariables, variableId]);
    }
  };

  const handleSelectAll = () => {
    const allVariableIds = variables.map(v => v.apiParam);
    onVariableChange(allVariableIds);
  };

  const handleSelectNone = () => {
    onVariableChange([]);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button size="small" onClick={handleSelectNone}>
            Clear All
          </Button>
        </Stack>
      </Box>
      
      <FormGroup>
        {variables.map((variable) => (
          <FormControlLabel
            key={variable.apiParam}
            control={
              <Checkbox
                checked={selectedVariables.includes(variable.apiParam)}
                onChange={() => handleVariableToggle(variable.apiParam)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                {variable.name}{' '}
                <Typography component="span" variant="caption" color="text.secondary">
                  ({variable.unit})
                </Typography>
              </Typography>
            }
            sx={{ 
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': { mt: 0.5 }
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default VariableSelector; 