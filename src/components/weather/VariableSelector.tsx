import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Chip,
  Divider,
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
  // Group variables by category for better organization
  const groupedVariables = variables.reduce((acc, variable) => {
    const category = variable.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(variable);
    return acc;
  }, {} as Record<string, WeatherVariable[]>);

  // Define category display order and labels
  const categoryOrder = ['temperature', 'humidity', 'pressure', 'wind', 'precipitation', 'radiation', 'other'];
  const categoryLabels = {
    temperature: 'Temperature',
    humidity: 'Humidity & Atmospheric',
    pressure: 'Pressure',
    wind: 'Wind Conditions',
    precipitation: 'Precipitation & Water',
    radiation: 'Solar Radiation',
    other: 'Other Variables'
  };

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

  const handleCategoryToggle = (categoryVariables: WeatherVariable[]) => {
    const categoryVariableIds = categoryVariables.map(v => v.apiParam);
    const allSelected = categoryVariableIds.every(id => selectedVariables.includes(id));
    
    if (allSelected) {
      // Deselect all in this category
      onVariableChange(selectedVariables.filter(id => !categoryVariableIds.includes(id)));
    } else {
      // Select all in this category
      const newSelection = [...selectedVariables];
      categoryVariableIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      onVariableChange(newSelection);
    }
  };

  return (
    <Box>
      {/* Header with title and controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          {selectedVariables.length > 0 && (
            <Chip 
              label={`${selectedVariables.length} selected`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleSelectAll} variant="outlined">
            Select All
          </Button>
          <Button size="small" onClick={handleSelectNone} variant="outlined">
            Clear All
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />
      
      {/* Variables grouped by category */}
      {categoryOrder.map((category) => {
        const categoryVariables = groupedVariables[category];
        if (!categoryVariables || categoryVariables.length === 0) return null;

        const allCategorySelected = categoryVariables.every(v => selectedVariables.includes(v.apiParam));
        const someCategorySelected = categoryVariables.some(v => selectedVariables.includes(v.apiParam));

        return (
          <Box key={category} sx={{ mb: 3 }}>
            {/* Category header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={600}>
                {categoryLabels[category as keyof typeof categoryLabels]}
              </Typography>
              <Button
                size="small"
                onClick={() => handleCategoryToggle(categoryVariables)}
                sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
              >
                {allCategorySelected ? 'Unselect All' : 'Select All'}
              </Button>
              {someCategorySelected && (
                <Chip 
                  label={`${categoryVariables.filter(v => selectedVariables.includes(v.apiParam)).length}/${categoryVariables.length}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.65rem' }}
                />
              )}
            </Box>

            {/* Category variables */}
            <FormGroup sx={{ ml: 1 }}>
              {categoryVariables.map((variable) => (
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
              ))}
            </FormGroup>
          </Box>
        );
      })}
    </Box>
  );
};

export default VariableSelector; 