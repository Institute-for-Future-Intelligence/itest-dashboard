import React, { memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { WATER_QUALITY_LOCATIONS } from '../../../utils/locationConfig';
import type { WaterQualityDataPoint } from '../../../types/waterQuality';

interface WaterQualityMobileViewProps {
  data: WaterQualityDataPoint[];
  expandedRows: Set<string>;
  onToggleRow: (rowId: string) => void;
}

// Format functions for mobile view
const formatValue = (value: any, type: string): string => {
  if (value === null || value === undefined || value === '') return '—';
  
  switch (type) {
    case 'temperature':
      return `${Number(value).toFixed(1)}°C`;
    case 'ph':
      return Number(value).toFixed(2);
    case 'salinity':
      return `${Number(value).toFixed(1)} ppt`;
    case 'conductivity':
      return `${Number(value).toFixed(0)} µS/cm`;
    case 'nutrient':
      return `${Number(value).toFixed(2)} mg/L`;
    case 'date':
      return new Date(value).toLocaleDateString();
    default:
      return String(value);
  }
};

// Mobile table row component
const MobileTableRow: React.FC<{ 
  row: WaterQualityDataPoint; 
  isExpanded: boolean; 
  onToggleExpand: () => void; 
}> = memo(({ row, isExpanded, onToggleExpand }) => {
  const location = WATER_QUALITY_LOCATIONS.find(loc => loc.id === row.location);
  
  return (
    <Paper sx={{ mb: 2, overflow: 'hidden' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggleExpand}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {formatValue(row.date, 'date')} - {location?.name || row.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatValue(row.temperature, 'temperature')} • pH {formatValue(row.ph, 'ph')}
          </Typography>
        </Box>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      <Collapse in={isExpanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Physical Parameters</Typography>
              <Typography variant="body2">Salinity: {formatValue(row.salinity, 'salinity')}</Typography>
              <Typography variant="body2">Conductivity: {formatValue(row.conductivity, 'conductivity')}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Nutrients (mg/L)</Typography>
              <Typography variant="body2">NO₃⁻: {formatValue(row.nitrate, 'nutrient')}</Typography>
              <Typography variant="body2">NO₂⁻: {formatValue(row.nitrite, 'nutrient')}</Typography>
              <Typography variant="body2">NH₃: {formatValue(row.ammonia, 'nutrient')}</Typography>
              <Typography variant="body2">PO₄³⁻: {formatValue(row.phosphate, 'nutrient')}</Typography>
            </Box>
          </Box>
          {row.notes && (
            <Box>
              <Typography variant="caption" color="text.secondary">Notes</Typography>
              <Typography variant="body2">{row.notes}</Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
});

MobileTableRow.displayName = 'MobileTableRow';

const WaterQualityMobileView: React.FC<WaterQualityMobileViewProps> = memo(({
  data,
  expandedRows,
  onToggleRow,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {data.map((row) => (
        <MobileTableRow
          key={row.id}
          row={row}
          isExpanded={expandedRows.has(row.id)}
          onToggleExpand={() => onToggleRow(row.id)}
        />
      ))}
    </Box>
  );
});

WaterQualityMobileView.displayName = 'WaterQualityMobileView';

export default WaterQualityMobileView; 