import React, { useMemo, memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import type { SensorDataPoint } from '../../types/sensor';

// Import modular components
import StatisticsCards from './visualization/StatisticsCards';
import TemperatureChart from './visualization/TemperatureChart';
import WaterTemperatureChart from './visualization/WaterTemperatureChart';
import HumidityChart from './visualization/HumidityChart';
import ExternalHumidityChart from './visualization/ExternalHumidityChart';
import Co2Chart from './visualization/Co2Chart';
import PhChart from './visualization/PhChart';
import SalinityChart from './visualization/SalinityChart';
import DateRangeIndicator from './visualization/DateRangeIndicator';
import EmptyState from './visualization/EmptyState';
import { 
  processChartData, 
  calculateStatistics, 
  formatTooltipValue,
  getDataDateRange
} from './visualization/VisualizationUtils';

interface SensorDataVisualizationProps {
  data: SensorDataPoint[];
  loading?: boolean;
}

const SensorDataVisualization: React.FC<SensorDataVisualizationProps> = memo(({
  data,
  loading = false,
}) => {
  // Process data for charts
  const chartData = useMemo(() => processChartData(data), [data]);

  // Calculate statistics
  const statistics = useMemo(() => calculateStatistics(data), [data]);

  // Get date range information
  const dateRange = useMemo(() => getDataDateRange(data), [data]);

  // Early return for loading or empty states
  if (loading || data.length === 0) {
    return <EmptyState loading={loading} />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Visualization
      </Typography>

      {/* Date Range Indicator */}
      <DateRangeIndicator 
        dateRange={dateRange} 
        dataCount={Math.min(data.length, 50)} 
      />

      {/* Statistics Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Individual Sensor Charts */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3, 
        mb: 3 
      }}>
        <TemperatureChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <WaterTemperatureChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <HumidityChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <ExternalHumidityChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <Co2Chart data={chartData} formatTooltipValue={formatTooltipValue} />
        <PhChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <SalinityChart data={chartData} formatTooltipValue={formatTooltipValue} />
      </Box>
    </Box>
  );
});

SensorDataVisualization.displayName = 'SensorDataVisualization';

export default SensorDataVisualization; 