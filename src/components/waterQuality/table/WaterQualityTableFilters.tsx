import React, { memo, useState, useCallback } from 'react';
import {
  Box,
  MenuItem,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Clear,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useWaterQualityStore } from '../../../store/useWaterQualityStore';
import { WATER_QUALITY_LOCATIONS } from '../../../utils/locationConfig';
import type { WaterQualityFilters } from '../../../types/waterQuality';

// Parameter ranges for sliders
const PARAMETER_RANGES = {
  temperature: { min: 0, max: 50, step: 0.5, unit: '°C' },
  ph: { min: 0, max: 14, step: 0.1, unit: '' },
  salinity: { min: 0, max: 50, step: 0.5, unit: 'ppt' },
  conductivity: { min: 0, max: 100000, step: 100, unit: 'µS/cm' },
  nitrate: { min: 0, max: 100, step: 0.5, unit: 'mg/L' },
  nitrite: { min: 0, max: 50, step: 0.5, unit: 'mg/L' },
  ammonia: { min: 0, max: 50, step: 0.5, unit: 'mg/L' },
  phosphate: { min: 0, max: 50, step: 0.5, unit: 'mg/L' },
} as const;

// Quick date presets
const DATE_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
] as const;

const WaterQualityTableFilters: React.FC = memo(() => {
  const {
    filterUI,
    setLocalFilters,
    applyLocalFilters,
    clearFilters,
  } = useWaterQualityStore();
  
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: filterUI.localFilters.dateRange?.start || null,
    end: filterUI.localFilters.dateRange?.end || null,
  });
  
  // Handle local filter changes
  const handleFilterChange = useCallback((key: keyof WaterQualityFilters, value: unknown) => {
    const newFilters = { ...filterUI.localFilters };
    
    if (value === null || value === undefined || value === '') {
      delete newFilters[key];
    } else {
      (newFilters as Record<string, unknown>)[key] = value;
    }
    
    setLocalFilters(newFilters);
  }, [filterUI.localFilters, setLocalFilters]);
  
  // Handle date range changes
  const handleDateRangeChange = useCallback((start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    
    if (start && end) {
      handleFilterChange('dateRange', { start, end });
    } else {
      handleFilterChange('dateRange', null);
    }
  }, [handleFilterChange]);
  
  // Handle parameter range changes
  const handleRangeChange = useCallback((parameter: string, range: [number, number]) => {
    const [min, max] = range;
    const rangeKey = `${parameter}Range` as keyof WaterQualityFilters;
    
    // Only set filter if range is not at extremes
    const paramConfig = PARAMETER_RANGES[parameter as keyof typeof PARAMETER_RANGES];
    if (min === paramConfig.min && max === paramConfig.max) {
      handleFilterChange(rangeKey, null);
    } else {
      handleFilterChange(rangeKey, { min, max });
    }
  }, [handleFilterChange]);
  
  // Handle quick date presets
  const handleDatePreset = useCallback((days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    handleDateRangeChange(start, end);
  }, [handleDateRangeChange]);
  
  // Apply filters
  const handleApply = useCallback(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);
  
  // Clear all filters
  const handleClear = useCallback(() => {
    setDateRange({ start: null, end: null });
    clearFilters();
  }, [clearFilters]);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filter Data
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Date Range Filter */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Date Range
            </Typography>
            
            {/* Quick presets */}
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {DATE_PRESETS.map((preset) => (
                <Chip
                  key={preset.days}
                  label={preset.label}
                  size="small"
                  variant="outlined"
                  onClick={() => handleDatePreset(preset.days)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
            
            {/* Date pickers */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(newValue) => handleDateRangeChange(newValue, dateRange.end)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true }
                }}
              />
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(newValue) => handleDateRangeChange(dateRange.start, newValue)}
                slotProps={{
                  textField: { size: 'small', fullWidth: true }
                }}
              />
            </Box>
          </Box>
          
          {/* Location Filter */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={filterUI.localFilters.location || ''}
                label="Location"
                onChange={(e) => handleFilterChange('location', e.target.value || null)}
              >
                <MenuItem value="">
                  <em>All Locations</em>
                </MenuItem>
                {WATER_QUALITY_LOCATIONS.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        {/* Parameter Ranges */}
        <Box sx={{ mt: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">Parameter Ranges</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' 
                },
                gap: 3 
              }}>
                {Object.entries(PARAMETER_RANGES).map(([parameter, config]) => {
                  const rangeKey = `${parameter}Range` as keyof WaterQualityFilters;
                  const currentRange = filterUI.localFilters[rangeKey] as { min: number; max: number } | undefined;
                  const value: [number, number] = [
                    currentRange?.min ?? config.min,
                    currentRange?.max ?? config.max
                  ];
                  
                  return (
                    <Box key={parameter}>
                      <Typography variant="body2" gutterBottom>
                        {parameter.charAt(0).toUpperCase() + parameter.slice(1)} {config.unit && `(${config.unit})`}
                      </Typography>
                      <Slider
                        value={value}
                        onChange={(_, newValue) => handleRangeChange(parameter, newValue as [number, number])}
                        valueLabelDisplay="auto"
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        marks={[
                          { value: config.min, label: `${config.min}` },
                          { value: config.max, label: `${config.max}` }
                        ]}
                        sx={{ mt: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">
                          {value[0]} {config.unit}
                        </Typography>
                        <Typography variant="caption">
                          {value[1]} {config.unit}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClear}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
});

WaterQualityTableFilters.displayName = 'WaterQualityTableFilters';

export default WaterQualityTableFilters; 