import React, { memo } from 'react';
import {
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from './VisualizationUtils';

interface SalinityChartProps {
  data: ChartDataPoint[];
  formatTooltipValue: (value: number, name: string) => [string, string];
}

const SalinityChart: React.FC<SalinityChartProps> = memo(({ 
  data, 
  formatTooltipValue 
}) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Salinity Levels
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            fontSize={12}
            label={{ value: 'Salinity (ppt)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelFormatter={(label) => {
              const dataPoint = data.find(d => d.timestamp === label);
              return dataPoint ? dataPoint.fullTimestamp : `Time: ${label}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="salinity"
            stroke={theme.palette.warning.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Salinity (ppt)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
});

SalinityChart.displayName = 'SalinityChart';

export default SalinityChart; 