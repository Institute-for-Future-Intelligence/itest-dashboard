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

interface WaterTemperatureChartProps {
  data: ChartDataPoint[];
  formatTooltipValue: (value: number, name: string) => [string, string];
}

const WaterTemperatureChart: React.FC<WaterTemperatureChartProps> = memo(({ 
  data, 
  formatTooltipValue 
}) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Water Temperature
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
            label={{ value: 'Water Temperature (°C)', angle: -90, position: 'insideLeft' }}
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
            dataKey="waterTemperature"
            stroke={theme.palette.info.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Water Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
});

WaterTemperatureChart.displayName = 'WaterTemperatureChart';

export default WaterTemperatureChart; 