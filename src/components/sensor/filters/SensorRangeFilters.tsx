import React, { memo } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
} from '@mui/material';
import type { SensorDataFilters } from '../../../types/sensor';

interface SensorRangeFiltersProps {
  humidityRange?: SensorDataFilters['humidityRange'];
  co2Range?: SensorDataFilters['co2Range'];
  phRange?: SensorDataFilters['phRange'];
  salinityRange?: SensorDataFilters['salinityRange'];
  limit?: number;
  onHumidityRangeChange: (range: SensorDataFilters['humidityRange']) => void;
  onCo2RangeChange: (range: SensorDataFilters['co2Range']) => void;
  onPhRangeChange: (range: SensorDataFilters['phRange']) => void;
  onSalinityRangeChange: (range: SensorDataFilters['salinityRange']) => void;
  onLimitChange: (limit: number | undefined) => void;
}

const SensorRangeFilters: React.FC<SensorRangeFiltersProps> = memo(({
  humidityRange,
  co2Range,
  phRange,
  salinityRange,
  limit,
  onHumidityRangeChange,
  onCo2RangeChange,
  onPhRangeChange,
  onSalinityRangeChange,
  onLimitChange,
}) => {
  return (
    <>
      {/* Humidity Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Humidity Range (%)
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={[
              humidityRange?.min || 0,
              humidityRange?.max || 100,
            ]}
            onChange={(_e, value) =>
              onHumidityRangeChange({
                min: (value as number[])[0],
                max: (value as number[])[1],
              })
            }
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={1}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Box>
      </Box>

      {/* CO2 Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          CO₂ Range (ppm)
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={[
              co2Range?.min || 0,
              co2Range?.max || 2000,
            ]}
            onChange={(_e, value) =>
              onCo2RangeChange({
                min: (value as number[])[0],
                max: (value as number[])[1],
              })
            }
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            step={10}
            marks={[
              { value: 0, label: '0' },
              { value: 400, label: '400' },
              { value: 1000, label: '1000' },
              { value: 2000, label: '2000' },
            ]}
          />
        </Box>
      </Box>

      {/* pH Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          pH Range
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={[
              phRange?.min || 0,
              phRange?.max || 14,
            ]}
            onChange={(_e, value) =>
              onPhRangeChange({
                min: (value as number[])[0],
                max: (value as number[])[1],
              })
            }
            valueLabelDisplay="auto"
            min={0}
            max={14}
            step={0.1}
            marks={[
              { value: 0, label: '0' },
              { value: 7, label: '7' },
              { value: 14, label: '14' },
            ]}
          />
        </Box>
      </Box>

      {/* Salinity Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Salinity Range (ppt)
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={[
              salinityRange?.min || 0,
              salinityRange?.max || 50,
            ]}
            onChange={(_e, value) =>
              onSalinityRangeChange({
                min: (value as number[])[0],
                max: (value as number[])[1],
              })
            }
            valueLabelDisplay="auto"
            min={0}
            max={50}
            step={0.1}
            marks={[
              { value: 0, label: '0' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
            ]}
          />
        </Box>
      </Box>

      {/* Limit */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Maximum Records
        </Typography>
        <TextField
          size="small"
          type="number"
          value={limit || ''}
          onChange={(e) =>
            onLimitChange(e.target.value ? parseInt(e.target.value) : undefined)
          }
          placeholder="No limit"
          sx={{ width: '150px' }}
          inputProps={{ min: 1, max: 5000 }}
        />
      </Box>
    </>
  );
});

SensorRangeFilters.displayName = 'SensorRangeFilters';

export default SensorRangeFilters; 