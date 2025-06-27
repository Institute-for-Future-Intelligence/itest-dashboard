import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  FormGroup,
} from '@mui/material';
import VariableItem from './VariableItem';
import type { CategoryInfo } from '../../../utils/weather/variableGrouping';

interface VariableCategoryProps {
  category: CategoryInfo;
  selectedVariables: string[];
  onVariableToggle: (variableId: string) => void;
  onCategoryToggle: (categoryVariables: CategoryInfo['variables'], allSelected: boolean) => void;
}

const VariableCategory: React.FC<VariableCategoryProps> = ({
  category,
  selectedVariables,
  onVariableToggle,
  onCategoryToggle,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Category header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
        <Typography variant="subtitle2" color="primary" fontWeight={600}>
          {category.label}
        </Typography>
        <Button
          size="small"
          onClick={() => onCategoryToggle(category.variables, category.allSelected)}
          sx={{ minWidth: 'auto', px: 1, py: 0.25, fontSize: '0.75rem' }}
        >
          {category.allSelected ? 'Unselect All' : 'Select All'}
        </Button>
        {category.someSelected && (
          <Chip 
            label={`${category.selectedCount}/${category.totalCount}`}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
        )}
      </Box>

      {/* Category variables */}
      <FormGroup sx={{ ml: 1 }}>
        {category.variables.map((variable) => (
          <VariableItem
            key={variable.apiParam}
            variable={variable}
            isSelected={selectedVariables.includes(variable.apiParam)}
            onToggle={onVariableToggle}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default VariableCategory; 