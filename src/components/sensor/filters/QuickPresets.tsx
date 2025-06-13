import React, { memo, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import type { SensorDataFilters } from '../../../types/sensor';

interface FilterPreset {
  label: string;
  filters: Partial<SensorDataFilters>;
  description: string;
}

interface QuickPresetsProps {
  onPresetClick: (preset: FilterPreset) => void;
}

const QuickPresets: React.FC<QuickPresetsProps> = memo(({ onPresetClick }) => {
  // Filter presets for quick access - memoized to prevent recreation
  const presets: FilterPreset[] = useMemo(() => [
    {
      label: 'Today',
      description: 'Data from today',
      filters: {
        dateRange: {
          start: new Date(new Date().setHours(0, 0, 0, 0)),
          end: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    },
    {
      label: 'Last Week',
      description: 'Data from the last 7 days',
      filters: {
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
      },
    },
    {
      label: 'Last Month',
      description: 'Data from the last 30 days',
      filters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
      },
    },
    {
      label: 'High CO₂',
      description: 'CO₂ levels above 800 ppm',
      filters: {
        co2Range: { min: 800, max: 5000 },
      },
    },
    {
      label: 'Optimal pH',
      description: 'pH levels between 7.5-8.5',
      filters: {
        phRange: { min: 7.5, max: 8.5 },
      },
    },
  ], []);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Quick Filters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {presets.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            onClick={() => onPresetClick(preset)}
            variant="outlined"
            size="small"
            clickable
            title={preset.description}
          />
        ))}
      </Box>
    </Box>
  );
});

QuickPresets.displayName = 'QuickPresets';

export default QuickPresets;
export type { FilterPreset }; 