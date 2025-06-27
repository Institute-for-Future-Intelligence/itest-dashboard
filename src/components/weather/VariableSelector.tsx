import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { VariableCategory } from './variable-selector';
import { 
  getOrderedCategoriesWithState,
  calculateCategoryToggleSelection,
  extractVariableIds 
} from '../../utils/weather/variableGrouping';
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
  // Get ordered categories with selection state using extracted utility
  const categoriesWithState = getOrderedCategoriesWithState(variables, selectedVariables);

  const handleVariableToggle = (variableId: string) => {
    const isSelected = selectedVariables.includes(variableId);
    
    if (isSelected) {
      onVariableChange(selectedVariables.filter(id => id !== variableId));
    } else {
      onVariableChange([...selectedVariables, variableId]);
    }
  };

  const handleSelectAll = () => {
    const allVariableIds = extractVariableIds(variables);
    onVariableChange(allVariableIds);
  };

  const handleSelectNone = () => {
    onVariableChange([]);
  };

  const handleCategoryToggle = (categoryVariables: WeatherVariable[], allSelected: boolean) => {
    const newSelection = calculateCategoryToggleSelection(
      selectedVariables,
      categoryVariables,
      allSelected
    );
    onVariableChange(newSelection);
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
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ 
                px: 1, 
                py: 0.25, 
                border: 1, 
                borderColor: 'primary.main', 
                borderRadius: 3,
                fontWeight: 500
              }}
            >
              {selectedVariables.length} selected
            </Typography>
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
      
      {/* Render categories using modular components */}
      {categoriesWithState.map((category) => (
        <VariableCategory
          key={category.id}
          category={category}
          selectedVariables={selectedVariables}
          onVariableToggle={handleVariableToggle}
          onCategoryToggle={handleCategoryToggle}
        />
      ))}
    </Box>
  );
};

export default VariableSelector; 