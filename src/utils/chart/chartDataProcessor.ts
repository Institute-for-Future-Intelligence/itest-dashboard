import type { WeatherApiResponse } from '../../types/weather';
import type { ChartDataPoint } from '../../types/chart';

/**
 * Transforms raw weather API data into chart-ready data points
 * Filters out missing/invalid values to maintain data integrity
 */
export const processWeatherData = (
  weatherData: WeatherApiResponse['hourly'] | WeatherApiResponse['daily'],
  selectedVariables: string[]
): ChartDataPoint[] => {
  if (!weatherData || !weatherData.time) return [];

  // Transform each time point into a chart data point
  const dataPoints: ChartDataPoint[] = weatherData.time.map((time, index) => {
    const point: ChartDataPoint = {
      time: time,
      date: new Date(time).toLocaleDateString(),
    };

    // Add each selected variable's value if it exists and is valid
    selectedVariables.forEach(variable => {
      if (weatherData[variable] && Array.isArray(weatherData[variable])) {
        const value = (weatherData[variable] as number[])[index];
        // Only include valid numbers (exclude null, undefined, NaN)
        if (value !== null && value !== undefined && !isNaN(value)) {
          point[variable] = value;
        }
      }
    });

    return point;
  });

  // Filter out time points that have no valid data for any selected variable
  return dataPoints.filter(point => {
    const hasValidData = selectedVariables.some(variable => 
      point[variable] !== undefined && point[variable] !== null
    );
    return hasValidData;
  });
};

/**
 * Validates if the processed data has sufficient quality for visualization
 */
export const validateDataQuality = (
  originalTimePoints: number,
  processedDataPoints: number
): { isValid: boolean; completeness: number } => {
  const completeness = originalTimePoints > 0 ? (processedDataPoints / originalTimePoints) * 100 : 0;
  
  return {
    isValid: completeness > 10, // Require at least 10% data coverage
    completeness
  };
}; 