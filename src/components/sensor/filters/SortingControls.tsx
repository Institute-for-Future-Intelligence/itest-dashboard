import React, { memo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SensorDataFilters } from '../../../types/sensor';

interface SortingControlsProps {
  sortBy?: SensorDataFilters['sortBy'];
  sortOrder?: SensorDataFilters['sortOrder'];
  onSortByChange: (sortBy: SensorDataFilters['sortBy']) => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

const SortingControls: React.FC<SortingControlsProps> = memo(({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Sorting
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy || 'timestamp'}
            label="Sort By"
            onChange={(e) => onSortByChange(e.target.value as SensorDataFilters['sortBy'])}
          >
            <MenuItem value="timestamp">Date & Time</MenuItem>
            <MenuItem value="humidity">Humidity</MenuItem>
            <MenuItem value="co2">CO₂</MenuItem>
            <MenuItem value="ph">pH</MenuItem>
            <MenuItem value="salinity">Salinity</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder || 'desc'}
            label="Order"
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
});

SortingControls.displayName = 'SortingControls';

export default SortingControls; 