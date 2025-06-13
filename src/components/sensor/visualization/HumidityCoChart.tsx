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
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from './VisualizationUtils';

interface HumidityCoChartProps {
  data: ChartDataPoint[];
  formatTooltipValue: (value: number, name: string) => [string, string];
}

const HumidityCoChart: React.FC<HumidityCoChartProps> = memo(({ 
  data, 
  formatTooltipValue 
}) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Humidity & CO₂ Levels
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis yAxisId="left" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" fontSize={12} />
          <Tooltip formatter={formatTooltipValue} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humidity"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Humidity (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="co2"
            stroke={theme.palette.secondary.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="CO₂ (ppm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
});

HumidityCoChart.displayName = 'HumidityCoChart';

export default HumidityCoChart; 