import React, { useMemo, memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import type { SensorDataPoint } from '../../types/sensor';

// Import modular components
import StatisticsCards from './visualization/StatisticsCards';
import HumidityCoChart from './visualization/HumidityCoChart';
import PhSalinityChart from './visualization/PhSalinityChart';
import CombinedAreaChart from './visualization/CombinedAreaChart';
import EmptyState from './visualization/EmptyState';
import { 
  processChartData, 
  calculateStatistics, 
  formatTooltipValue 
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

  // Early return for loading or empty states
  if (loading || data.length === 0) {
    return <EmptyState loading={loading} />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Visualization
      </Typography>

      {/* Statistics Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <HumidityCoChart data={chartData} formatTooltipValue={formatTooltipValue} />
        <PhSalinityChart data={chartData} formatTooltipValue={formatTooltipValue} />
      </Box>

      {/* Combined Area Chart */}
      <CombinedAreaChart data={chartData} formatTooltipValue={formatTooltipValue} />
    </Box>
  );
});

SensorDataVisualization.displayName = 'SensorDataVisualization';

export default SensorDataVisualization; 