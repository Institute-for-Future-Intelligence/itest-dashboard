import React, { memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  FilterList,
  Clear,
  FileDownload,
} from '@mui/icons-material';
import { WATER_QUALITY_LOCATIONS } from '../../../utils/locationConfig';
import type { WaterQualityFilters } from '../../../types/waterQuality';

interface WaterQualityTableHeaderProps {
  filteredDataLength: number;
  activeFiltersCount: number;
  filters: WaterQualityFilters;
  onExport: () => void;
  onClearFilters: () => void;
  onToggleFilters: (show: boolean) => void;
  showFilters: boolean;
}

const formatValue = (value: unknown, type: string): string => {
  if (value === null || value === undefined || value === '') return '';
  
  switch (type) {
    case 'date': {
      try {
        const date = value instanceof Date ? value : new Date(String(value));
        return date.toLocaleDateString();
      } catch {
        return String(value);
      }
    }
    default:
      return String(value);
  }
};

const WaterQualityTableHeader: React.FC<WaterQualityTableHeaderProps> = memo(({
  filteredDataLength,
  activeFiltersCount,
  filters,
  onExport,
  onClearFilters,
  onToggleFilters,
  showFilters,
}) => {
  return (
    <Box sx={{ p: 3, pb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Water Quality Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredDataLength} record{filteredDataLength !== 1 ? 's' : ''} found
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => onToggleFilters(!showFilters)}
            color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
          >
            Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onClearFilters}
              size="small"
            >
              Clear
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={onExport}
            disabled={filteredDataLength === 0}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            let label = '';
            if (key === 'dateRange' && typeof value === 'object' && 'start' in value) {
              label = `Date: ${formatValue(value.start, 'date')} - ${formatValue(value.end, 'date')}`;
            } else if (key === 'location') {
              const location = WATER_QUALITY_LOCATIONS.find(loc => loc.id === value);
              label = `Location: ${location?.name || value}`;
            } else {
              label = `${key}: ${value}`;
            }
            
            return (
              <Chip
                key={key}
                label={label}
                size="small"
                onDelete={() => {
                  // Create a callback to remove individual filters
                  const newFilters = { ...filters };
                  delete newFilters[key as keyof typeof filters];
                  // This would need to be passed down as a prop, for now just log
                  console.log('Delete filter:', key, 'New filters:', newFilters);
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
});

WaterQualityTableHeader.displayName = 'WaterQualityTableHeader';

export default WaterQualityTableHeader; 