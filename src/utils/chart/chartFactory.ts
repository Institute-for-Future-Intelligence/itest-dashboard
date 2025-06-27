import type { ChartConfig, ChartSeries, ChartDataPoint } from '../../types/chart';
import { HOURLY_VARIABLES, DAILY_VARIABLES } from '../weatherConfig';
import { CHART_COLORS } from '../../types/chart';
import type { VariableGroup } from './chartGrouping';

/**
 * Calculate optimal chart height based on chart type, data, and series count
 */
const calculateOptimalHeight = (
  chartType: string,
  seriesCount: number,
  dataPointsCount: number
): number => {
  // Base heights for different chart types
  const baseHeights = {
    line: 350,
    area: 380,
    bar: 400,
  };

  let baseHeight = baseHeights[chartType as keyof typeof baseHeights] || 350;

  // Adjust for multiple series (more series need more height for readability)
  if (seriesCount > 1) {
    baseHeight += Math.min(seriesCount * 25, 100); // Max additional 100px
  }

  // Adjust for data density (more data points might need more height)
  if (dataPointsCount > 100) {
    baseHeight += 50;
  } else if (dataPointsCount > 50) {
    baseHeight += 25;
  }

  // Ensure reasonable bounds
  return Math.min(Math.max(baseHeight, 300), 600);
};

/**
 * Creates a chart configuration from processed data and variable group
 */
export const createChart = (
  group: VariableGroup,
  dataPoints: ChartDataPoint[],
  xAxisKey: string = 'time',
  customHeight?: number
): ChartConfig => {
  const series = createChartSeries(group.variables);

  // Calculate optimal height if not provided
  const height = customHeight || calculateOptimalHeight(
    group.type,
    series.length,
    dataPoints.length
  );

  /**
   * generates a ChartConfig obj to include axis keys and labels
   */
  const firstVar = group.variables[0];
  const variableMeta = [...HOURLY_VARIABLES, ...DAILY_VARIABLES].find(
    v => v.apiParam === firstVar
  );

  const xAxisLabel = xAxisKey === 'time' ? 'Time of Day' : 'Date';
  const yAxisLabel = variableMeta ? `${variableMeta.name} (${variableMeta.unit})` : 'Value';

  return {
    title: group.name,
    type: group.type,
    data: dataPoints,
    series,
    xAxisKey,
    xAxisLabel,
    yAxisLabel,
    height,
  };
};

/**
 * Creates chart series configurations for given variables
 */
export const createChartSeries = (variables: string[]): ChartSeries[] => {
  return variables.map((variable, index) => {
    const variableConfig = [...HOURLY_VARIABLES, ...DAILY_VARIABLES].find(
      v => v.apiParam === variable
    );

    return {
      dataKey: variable,
      name: variableConfig?.name || variable,
      color: CHART_COLORS[index % CHART_COLORS.length],
      unit: variableConfig?.unit || '',
    };
  });
};

/**
 * Batch creates multiple charts from variable groups and data
 */
export const createChartsFromGroups = (
  groups: VariableGroup[],
  dataPoints: ChartDataPoint[]
): ChartConfig[] => {
  return groups.map(group => createChart(group, dataPoints));
};

/**
 * Enhanced chart creation with responsive sizing
 */
export const createResponsiveChart = (
  group: VariableGroup,
  dataPoints: ChartDataPoint[],
  options: {
    xAxisKey?: string;
    customHeight?: number;
    isCompact?: boolean;
  } = {}
): ChartConfig => {
  const { xAxisKey = 'time', customHeight, isCompact = false } = options;
  
  let height = customHeight;
  
  if (!height) {
    height = calculateOptimalHeight(group.type, group.variables.length, dataPoints.length);
    
    // Apply compact mode adjustment
    if (isCompact) {
      height = Math.max(height * 0.75, 250);
    }
  }

  return createChart(group, dataPoints, xAxisKey, height);
}; 