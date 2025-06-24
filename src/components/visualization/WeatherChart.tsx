import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import type { ChartConfig } from '../../types/chart';

interface WeatherChartProps {
  config: ChartConfig;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const WeatherChart = ({ config }: WeatherChartProps) => {
  const { title, type, data, series, xAxisKey, xAxisLabel, yAxisLabel, height = 300 } = config;

  const formatXAxisLabel = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(data.length > 7 ? {} : { hour: '2-digit' })
    });
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const date = new Date(label || '');
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {formattedDate}
          </Typography>
          {payload.map((entry, index: number) => {
            const seriesConfig = series.find(s => s.dataKey === entry.dataKey);
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: entry.color }}
              >
                {entry.name}: {entry.value} {seriesConfig?.unit}
              </Typography>
            );
          })}
        </Paper>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 40 }, //extended to bottom margin to possibly see the charts better
    };

    const renderAxes = () => ({
      xAxis: (
        <XAxis
        dataKey={xAxisKey}
        tickFormatter={formatXAxisLabel}
        interval="preserveStartEnd"
        >
          {xAxisLabel && (
            <Label 
              value={xAxisLabel} 
              offset={-5} 
              position="insideBottom" 
            />
          )}
        </XAxis>
      ),
      yAxis: (
        <YAxis>
          {yAxisLabel && (
            <Label 
              value={yAxisLabel} 
              angle={-90} 
              position="insideLeft" 
              style={{ textAnchor: 'middle' }}
            />
          )}
        </YAxis>
      )
    });

    const { xAxis, yAxis } = renderAxes();

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {xAxis}
            {yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={s.color}
                name={s.name}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false} // Don't connect across missing data points
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {xAxis}
            {yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {series.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                fill={s.color}
                name={s.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {xAxis}
            {yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {series.map((s, index) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stackId={index === 0 ? "1" : undefined}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.6}
                name={s.name}
                connectNulls={false} // Don't connect across missing data points
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>Chart type not supported</div>}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default WeatherChart; 