import React, { memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

interface FilterHeaderProps {
  activeFiltersCount: number;
  isExpanded: boolean;
  loading?: boolean;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onToggleExpanded: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = memo(({
  activeFiltersCount,
  isExpanded,
  loading = false,
  onClearFilters,
  onApplyFilters,
  onToggleExpanded,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterList />
        <Typography variant="h6">
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip 
            label={`${activeFiltersCount} active`} 
            size="small" 
            color="primary" 
          />
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClearFilters}
          startIcon={<Clear />}
          disabled={activeFiltersCount === 0}
        >
          Clear
        </Button>
        
        <Button
          variant="contained"
          size="small"
          onClick={onApplyFilters}
          disabled={loading}
        >
          Apply
        </Button>
        
        <IconButton
          onClick={onToggleExpanded}
          size="small"
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
    </Box>
  );
});

FilterHeader.displayName = 'FilterHeader';

export default FilterHeader; 