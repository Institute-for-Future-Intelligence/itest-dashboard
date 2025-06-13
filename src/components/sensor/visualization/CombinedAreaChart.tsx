import React, { memo } from 'react';
import {
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from './VisualizationUtils';

interface CombinedAreaChartProps {
  data: ChartDataPoint[];
  formatTooltipValue: (value: number, name: string) => [string, string];
}

const CombinedAreaChart: React.FC<CombinedAreaChartProps> = memo(({ 
  data, 
  formatTooltipValue 
}) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        All Sensor Data Trends (Last 50 readings)
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis fontSize={12} />
          <Tooltip 
            formatter={formatTooltipValue}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="humidity"
            stackId="1"
            stroke={theme.palette.primary.main}
            fill="url(#colorHumidity)"
            name="Humidity (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
});

CombinedAreaChart.displayName = 'CombinedAreaChart';

export default CombinedAreaChart; 