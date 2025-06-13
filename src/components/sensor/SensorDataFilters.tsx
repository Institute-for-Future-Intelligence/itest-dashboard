import React, { memo, useEffect } from 'react';
import {
  Box,
  Paper,
  Collapse,
  Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSensorStore } from '../../store/useSensorStore';
import FilterHeader from './filters/FilterHeader';
import QuickPresets from './filters/QuickPresets';
import DateRangeFilter from './filters/DateRangeFilter';
import LocationFilter from './filters/LocationFilter';
import SensorRangeFilters from './filters/SensorRangeFilters';
import SortingControls from './filters/SortingControls';
import type { FilterPreset } from './filters/QuickPresets';
import type { SensorDataFilters } from '../../types/sensor';

const SensorDataFiltersComponent: React.FC = memo(() => {
  // Zustand store selectors
  const loading = useSensorStore(state => state.loading);
  const filters = useSensorStore(state => state.filters);
  const filterUI = useSensorStore(state => state.filterUI);
  const getActiveFiltersCount = useSensorStore(state => state.getActiveFiltersCount);
  
  // Zustand store actions
  const setFilterExpanded = useSensorStore(state => state.setFilterExpanded);
  const setLocalFilters = useSensorStore(state => state.setLocalFilters);
  const applyLocalFilters = useSensorStore(state => state.applyLocalFilters);
  const clearFilters = useSensorStore(state => state.clearFilters);

  // Sync filters with local filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, setLocalFilters]);

  const handleFilterChange = (newFilters: Partial<SensorDataFilters>) => {
    const updatedFilters = { ...filterUI.localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
  };

  const handlePresetClick = (preset: FilterPreset) => {
    const newFilters = { ...filterUI.localFilters, ...preset.filters };
    setLocalFilters(newFilters);
    applyLocalFilters();
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleApplyFilters = () => {
    applyLocalFilters();
  };

  const handleToggleExpanded = () => {
    setFilterExpanded(!filterUI.isExpanded);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <FilterHeader
          activeFiltersCount={getActiveFiltersCount()}
          isExpanded={filterUI.isExpanded}
          loading={loading}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
          onToggleExpanded={handleToggleExpanded}
        />

        <QuickPresets onPresetClick={handlePresetClick} />

        {/* Expanded Filters */}
        <Collapse in={filterUI.isExpanded}>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <DateRangeFilter
              dateRange={filterUI.localFilters.dateRange}
              onDateRangeChange={(dateRange) => handleFilterChange({ dateRange })}
            />

            <LocationFilter
              location={filterUI.localFilters.location}
              onLocationChange={(location) => handleFilterChange({ location })}
            />

            <SortingControls
              sortBy={filterUI.localFilters.sortBy}
              sortOrder={filterUI.localFilters.sortOrder}
              onSortByChange={(sortBy) => handleFilterChange({ sortBy })}
              onSortOrderChange={(sortOrder) => handleFilterChange({ sortOrder })}
            />

            <SensorRangeFilters
              humidityRange={filterUI.localFilters.humidityRange}
              co2Range={filterUI.localFilters.co2Range}
              phRange={filterUI.localFilters.phRange}
              salinityRange={filterUI.localFilters.salinityRange}
              limit={filterUI.localFilters.limit}
              onHumidityRangeChange={(humidityRange) => handleFilterChange({ humidityRange })}
              onCo2RangeChange={(co2Range) => handleFilterChange({ co2Range })}
              onPhRangeChange={(phRange) => handleFilterChange({ phRange })}
              onSalinityRangeChange={(salinityRange) => handleFilterChange({ salinityRange })}
              onLimitChange={(limit) => handleFilterChange({ limit })}
            />
          </Box>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
});

SensorDataFiltersComponent.displayName = 'SensorDataFiltersComponent';

export default SensorDataFiltersComponent; 