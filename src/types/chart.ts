export interface ChartDataPoint {
  time: string;
  date: string;
  [key: string]: string | number;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
  unit: string;
}

export interface ChartConfig {
  title: string;
  type: 'line' | 'bar' | 'area';
  data: ChartDataPoint[];
  series: ChartSeries[];
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

export interface VisualizationSection {
  id: string;
  title: string;
  charts: ChartConfig[];
}

export const CHART_COLORS = [
  '#8884d8', // Purple
  '#82ca9d', // Green  
  '#ffc658', // Yellow
  '#ff7c7c', // Red
  '#8dd1e1', // Blue
  '#d084d0', // Pink
  '#ffb347', // Orange
  '#87ceeb', // Sky Blue
  '#dda0dd', // Plum
  '#98fb98', // Pale Green
  '#f0e68c', // Khaki
  '#ffa07a', // Light Salmon
  '#20b2aa', // Light Sea Green
  '#b0c4de', // Light Steel Blue
]; 