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

interface PhSalinityChartProps {
  data: ChartDataPoint[];
  formatTooltipValue: (value: number, name: string) => [string, string];
}

const PhSalinityChart: React.FC<PhSalinityChartProps> = memo(({ 
  data, 
  formatTooltipValue 
}) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        pH & Salinity Levels
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
            dataKey="ph"
            stroke={theme.palette.success.main}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="pH"
          />
          <Line
            yAxisId="right"
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

PhSalinityChart.displayName = 'PhSalinityChart';

export default PhSalinityChart; 