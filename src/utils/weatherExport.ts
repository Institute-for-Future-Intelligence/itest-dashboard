import type { WeatherApiResponse, Location, DateRange } from '../types/weather';

export interface WeatherExportData {
  location: Location;
  dateRange: DateRange;
  weatherData: WeatherApiResponse;
  selectedHourlyVariables: string[];
  selectedDailyVariables: string[];
}

export interface ExportOptions {
  format: 'csv' | 'xlsx';
  includeHourly: boolean;
  includeDaily: boolean;
}

/**
 * Convert weather data to CSV format
 */
export const convertToCSV = (data: Record<string, string | number>[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle null/undefined values
        if (value === null || value === undefined) return '';
        // Escape values that contain commas or quotes
        const stringValue = String(value);
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

/**
 * Download file with given content
 */
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate safe filename based on location and date range
 */
export const generateFilename = (
  location: Location,
  dateRange: DateRange,
  dataType: 'hourly' | 'daily' | 'combined',
  extension: string
): string => {
  const locationName = location.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const startDate = dateRange.startDate.replace(/-/g, '');
  const endDate = dateRange.endDate.replace(/-/g, '');
  
  return `${locationName}_${dataType}_${startDate}_${endDate}.${extension}`;
};

/**
 * Process weather data for export
 */
export const processWeatherDataForExport = (
  weatherData: WeatherApiResponse,
  selectedHourlyVariables: string[],
  selectedDailyVariables: string[]
): { hourlyData: Record<string, string | number>[]; dailyData: Record<string, string | number>[] } => {
  const hourlyData: Record<string, string | number>[] = [];
  const dailyData: Record<string, string | number>[] = [];

  // Process hourly data
  if (weatherData.hourly && weatherData.hourly.time && selectedHourlyVariables.length > 0) {
    const timeArray = weatherData.hourly.time;
    
    for (let i = 0; i < timeArray.length; i++) {
      const row: Record<string, string | number> = {
        time: timeArray[i],
        date: new Date(timeArray[i]).toLocaleDateString(),
        hour: new Date(timeArray[i]).getHours()
      };
      
      selectedHourlyVariables.forEach(variable => {
        if (weatherData.hourly![variable] && Array.isArray(weatherData.hourly![variable])) {
          const value = (weatherData.hourly![variable] as number[])[i];
          row[variable] = value !== null && value !== undefined ? value : '';
        }
      });
      
      hourlyData.push(row);
    }
  }

  // Process daily data
  if (weatherData.daily && weatherData.daily.time && selectedDailyVariables.length > 0) {
    const timeArray = weatherData.daily.time;
    
    for (let i = 0; i < timeArray.length; i++) {
      const row: Record<string, string | number> = {
        time: timeArray[i],
        date: new Date(timeArray[i]).toLocaleDateString()
      };
      
      selectedDailyVariables.forEach(variable => {
        if (weatherData.daily![variable] && Array.isArray(weatherData.daily![variable])) {
          const value = (weatherData.daily![variable] as number[])[i];
          row[variable] = value !== null && value !== undefined ? value : '';
        }
      });
      
      dailyData.push(row);
    }
  }

  return { hourlyData, dailyData };
};

/**
 * Export weather data to CSV
 */
export const exportWeatherDataToCSV = (exportData: WeatherExportData, options: ExportOptions) => {
  const { location, dateRange, weatherData, selectedHourlyVariables, selectedDailyVariables } = exportData;
  const { hourlyData, dailyData } = processWeatherDataForExport(weatherData, selectedHourlyVariables, selectedDailyVariables);

  if (options.includeHourly && hourlyData.length > 0) {
    const hourlyCSV = convertToCSV(hourlyData);
    const hourlyFilename = generateFilename(location, dateRange, 'hourly', 'csv');
    downloadFile(hourlyCSV, hourlyFilename, 'text/csv');
  }

  if (options.includeDaily && dailyData.length > 0) {
    const dailyCSV = convertToCSV(dailyData);
    const dailyFilename = generateFilename(location, dateRange, 'daily', 'csv');
    downloadFile(dailyCSV, dailyFilename, 'text/csv');
  }
};

/**
 * Export weather data to Excel (using CSV format with .xlsx extension for simplicity)
 * Note: For true Excel support, you'd need a library like SheetJS
 */
export const exportWeatherDataToExcel = (exportData: WeatherExportData, options: ExportOptions) => {
  const { location, dateRange, weatherData, selectedHourlyVariables, selectedDailyVariables } = exportData;
  const { hourlyData, dailyData } = processWeatherDataForExport(weatherData, selectedHourlyVariables, selectedDailyVariables);

  // For now, we'll create separate files for hourly and daily data
  // In a production app, you'd want to use a proper Excel library to create multi-sheet workbooks
  
  if (options.includeHourly && hourlyData.length > 0) {
    const hourlyCSV = convertToCSV(hourlyData);
    const hourlyFilename = generateFilename(location, dateRange, 'hourly', 'xlsx');
    downloadFile(hourlyCSV, hourlyFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  if (options.includeDaily && dailyData.length > 0) {
    const dailyCSV = convertToCSV(dailyData);
    const dailyFilename = generateFilename(location, dateRange, 'daily', 'xlsx');
    downloadFile(dailyCSV, dailyFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
};

/**
 * Main export function - handles both CSV and Excel formats
 */
export const exportWeatherData = (exportData: WeatherExportData, options: ExportOptions) => {
  if (!exportData.weatherData || (!options.includeHourly && !options.includeDaily)) {
    console.warn('No data to export or no export options selected');
    return;
  }

  try {
    if (options.format === 'csv') {
      exportWeatherDataToCSV(exportData, options);
    } else if (options.format === 'xlsx') {
      exportWeatherDataToExcel(exportData, options);
    }
  } catch (error) {
    console.error('Error exporting weather data:', error);
    throw new Error('Failed to export weather data');
  }
}; 