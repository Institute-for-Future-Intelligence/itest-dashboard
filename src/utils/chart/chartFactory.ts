import type { ChartConfig, ChartSeries, ChartDataPoint } from '../../types/chart';
import { HOURLY_VARIABLES, DAILY_VARIABLES } from '../weatherConfig';
import { CHART_COLORS } from '../../types/chart';
import type { VariableGroup } from './chartGrouping';

/**
 * Creates a chart configuration from processed data and variable group
 */
export const createChart = (
  group: VariableGroup,
  dataPoints: ChartDataPoint[],
  xAxisKey: string = 'time',
  height: number = 300
): ChartConfig => {
  const series = createChartSeries(group.variables);

  return {
    title: group.name,
    type: group.type,
    data: dataPoints,
    series,
    xAxisKey,
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