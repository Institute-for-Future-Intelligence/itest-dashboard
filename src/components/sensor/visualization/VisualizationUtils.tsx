import type { SensorDataPoint } from '../../../types/sensor';

// Shared chart data interface
export interface ChartDataPoint {
  timestamp: string;
  date: string;
  humidity: number;
  co2: number;
  ph: number;
  salinity: number;
}

// Shared statistics interface
export interface StatisticsData {
  humidity: { avg: number; min: number; max: number };
  co2: { avg: number; min: number; max: number };
  ph: { avg: number; min: number; max: number };
  salinity: { avg: number; min: number; max: number };
}

// Utility function to process raw sensor data into chart format
export const processChartData = (data: SensorDataPoint[]): ChartDataPoint[] => {
  return data
    .slice(-50) // Show last 50 data points for performance
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((point) => ({
      timestamp: point.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: point.timestamp.toLocaleDateString(),
      humidity: point.humidity != null ? Number(point.humidity.toFixed(1)) : 0,
      co2: point.co2 != null ? Number(point.co2.toFixed(0)) : 0,
      ph: point.ph != null ? Number(point.ph.toFixed(2)) : 0,
      salinity: point.salinity != null ? Number(point.salinity.toFixed(2)) : 0,
    }));
};

// Utility function to calculate statistics from raw sensor data
export const calculateStatistics = (data: SensorDataPoint[]): StatisticsData => {
  if (data.length === 0) {
    return {
      humidity: { avg: 0, min: 0, max: 0 },
      co2: { avg: 0, min: 0, max: 0 },
      ph: { avg: 0, min: 0, max: 0 },
      salinity: { avg: 0, min: 0, max: 0 },
    };
  }

  const humidityValues = data.map(d => d.humidity).filter(v => v != null);
  const co2Values = data.map(d => d.co2).filter(v => v != null);
  const phValues = data.map(d => d.ph).filter(v => v != null);
  const salinityValues = data.map(d => d.salinity).filter(v => v != null);

  return {
    humidity: {
      avg: humidityValues.length > 0 ? Number((humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length).toFixed(1)) : 0,
      min: humidityValues.length > 0 ? Number(Math.min(...humidityValues).toFixed(1)) : 0,
      max: humidityValues.length > 0 ? Number(Math.max(...humidityValues).toFixed(1)) : 0,
    },
    co2: {
      avg: co2Values.length > 0 ? Number((co2Values.reduce((a, b) => a + b, 0) / co2Values.length).toFixed(0)) : 0,
      min: co2Values.length > 0 ? Number(Math.min(...co2Values).toFixed(0)) : 0,
      max: co2Values.length > 0 ? Number(Math.max(...co2Values).toFixed(0)) : 0,
    },
    ph: {
      avg: phValues.length > 0 ? Number((phValues.reduce((a, b) => a + b, 0) / phValues.length).toFixed(2)) : 0,
      min: phValues.length > 0 ? Number(Math.min(...phValues).toFixed(2)) : 0,
      max: phValues.length > 0 ? Number(Math.max(...phValues).toFixed(2)) : 0,
    },
    salinity: {
      avg: salinityValues.length > 0 ? Number((salinityValues.reduce((a, b) => a + b, 0) / salinityValues.length).toFixed(2)) : 0,
      min: salinityValues.length > 0 ? Number(Math.min(...salinityValues).toFixed(2)) : 0,
      max: salinityValues.length > 0 ? Number(Math.max(...salinityValues).toFixed(2)) : 0,
    },
  };
};

// Utility function to format tooltip values
export const formatTooltipValue = (value: number, name: string): [string, string] => {
  switch (name) {
    case 'humidity':
      return [`${value}%`, 'Humidity'];
    case 'co2':
      return [`${value} ppm`, 'CO₂'];
    case 'ph':
      return [value.toString(), 'pH'];
    case 'salinity':
      return [`${value} ppt`, 'Salinity'];
    default:
      return [value.toString(), name];
  }
}; 