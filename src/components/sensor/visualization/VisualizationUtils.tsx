import type { SensorDataPoint } from '../../../types/sensor';

// Shared chart data interface
export interface ChartDataPoint {
  timestamp: string;
  fullTimestamp: string;
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

// Date range interface
export interface DateRange {
  start: Date;
  end: Date;
  spansDays: boolean;
  formattedRange: string;
}

// Utility function to determine if data spans multiple days
const getDateRange = (data: SensorDataPoint[]): DateRange => {
  if (data.length === 0) {
    const now = new Date();
    return {
      start: now,
      end: now,
      spansDays: false,
      formattedRange: now.toLocaleDateString()
    };
  }

  const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const start = sortedData[0].timestamp;
  const end = sortedData[sortedData.length - 1].timestamp;
  
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const spansDays = startDate.getTime() !== endDate.getTime();

  let formattedRange: string;
  if (spansDays) {
    formattedRange = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  } else {
    formattedRange = start.toLocaleDateString();
  }

  return {
    start,
    end,
    spansDays,
    formattedRange
  };
};

// Utility function to format timestamp based on data span
const formatTimestamp = (timestamp: Date, spansDays: boolean): string => {
  if (spansDays) {
    // Show date and time when spanning multiple days
    return timestamp.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    }) + ' ' + timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    // Show only time when all data is from the same day
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

// Utility function to process raw sensor data into chart format
export const processChartData = (data: SensorDataPoint[]): ChartDataPoint[] => {
  const last50Data = data.slice(-50); // Show last 50 data points for performance
  const dateRange = getDateRange(last50Data);
  
  return last50Data
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((point) => ({
      timestamp: formatTimestamp(point.timestamp, dateRange.spansDays),
      fullTimestamp: point.timestamp.toLocaleString(),
      date: point.timestamp.toLocaleDateString(),
      humidity: point.humidity != null ? Number(point.humidity.toFixed(1)) : 0,
      co2: point.co2 != null ? Number(point.co2.toFixed(0)) : 0,
      ph: point.ph != null ? Number(point.ph.toFixed(2)) : 0,
      salinity: point.salinity != null ? Number(point.salinity.toFixed(2)) : 0,
    }));
};

// Utility function to get date range information
export const getDataDateRange = (data: SensorDataPoint[]): DateRange => {
  return getDateRange(data.slice(-50)); // Match the data used in charts
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

// Utility function to format tooltip values with full timestamp
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

// Enhanced tooltip formatter that includes full date/time
export const formatTooltipLabel = (label: string, data: ChartDataPoint[]): string => {
  const dataPoint = data.find(d => d.timestamp === label);
  return dataPoint ? `${dataPoint.fullTimestamp}` : label;
}; 