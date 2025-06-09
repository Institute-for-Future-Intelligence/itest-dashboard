import type { WeatherApiResponse } from '../types/weather';
import type { VisualizationSection } from '../types/chart';
import { processWeatherData } from './chart/chartDataProcessor';
import { getHourlyVariableGroups, getDailyVariableGroups } from './chart/chartGrouping';
import { createChartsFromGroups } from './chart/chartFactory';

/**
 * Main orchestrator - transforms weather API data into visualization sections
 * 
 * This function coordinates specialized modules to:
 * 1. Process raw API data into chart-ready points
 * 2. Group variables into logical chart categories  
 * 3. Create chart configurations from groups and data
 * 
 * Much cleaner and focused on coordination rather than implementation details
 */
export const transformWeatherDataToCharts = (
  weatherData: WeatherApiResponse,
  selectedHourlyVariables: string[],
  selectedDailyVariables: string[]
): VisualizationSection[] => {
  const sections: VisualizationSection[] = [];

  // Process Hourly Data
  if (weatherData.hourly && selectedHourlyVariables.length > 0) {
    const hourlyDataPoints = processWeatherData(weatherData.hourly, selectedHourlyVariables);
    const hourlyGroups = getHourlyVariableGroups(selectedHourlyVariables);
    const hourlyCharts = createChartsFromGroups(hourlyGroups, hourlyDataPoints);
    
    if (hourlyCharts.length > 0) {
      sections.push({
        id: 'hourly',
        title: 'Hourly Weather Data',
        charts: hourlyCharts,
      });
    }
  }

  // Process Daily Data
  if (weatherData.daily && selectedDailyVariables.length > 0) {
    const dailyDataPoints = processWeatherData(weatherData.daily, selectedDailyVariables);
    const dailyGroups = getDailyVariableGroups(selectedDailyVariables);
    const dailyCharts = createChartsFromGroups(dailyGroups, dailyDataPoints);
    
    if (dailyCharts.length > 0) {
      sections.push({
        id: 'daily',
        title: 'Daily Weather Data',
        charts: dailyCharts,
      });
    }
  }

  return sections;
}; 