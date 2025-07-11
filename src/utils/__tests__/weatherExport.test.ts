import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  convertToCSV,
  downloadFile,
  generateFilename,
  processWeatherDataForExport,
  exportWeatherDataToCSV,
  exportWeatherDataToExcel,
  exportWeatherData,
} from '../weatherExport';
import type { WeatherApiResponse, Location, DateRange } from '../../types/weather';

// Mock URL and DOM methods
const mockURL = {
  createObjectURL: vi.fn(() => 'mock-blob-url'),
  revokeObjectURL: vi.fn(),
};
Object.defineProperty(window, 'URL', { value: mockURL });

// Mock document methods
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockCreateElement = vi.fn(() => ({
  href: '',
  download: '',
  click: mockClick,
}));

Object.defineProperty(document, 'createElement', { value: mockCreateElement });
Object.defineProperty(document.body, 'appendChild', { value: mockAppendChild });
Object.defineProperty(document.body, 'removeChild', { value: mockRemoveChild });

// Helper to create complete mock weather data
const createMockWeatherData = (data: Partial<WeatherApiResponse> = {}): WeatherApiResponse => ({
  latitude: 21.3629,
  longitude: -157.9565,
  timezone: 'Pacific/Honolulu',
  ...data,
});

describe('weatherExport utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('convertToCSV', () => {
    it('should convert simple data to CSV format', () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Boston' },
      ];

      const result = convertToCSV(data);
      const expected = 'name,age,city\nJohn,30,New York\nJane,25,Boston';
      
      expect(result).toBe(expected);
    });

    it('should handle data with commas and quotes', () => {
      const data = [
        { description: 'Test, with comma', value: 123 },
        { description: 'Test "with quotes"', value: 456 },
      ];

      const result = convertToCSV(data);
      
      expect(result).toContain('"Test, with comma"');
      expect(result).toContain('"Test ""with quotes"""');
    });

    it('should handle null and undefined values', () => {
      const data = [
        { name: 'John', age: null as any, city: undefined as any },
        { name: 'Jane', age: 25, city: 'Boston' },
      ];

      const result = convertToCSV(data);
      
      expect(result).toContain('John,,');
      expect(result).toContain('Jane,25,Boston');
    });

    it('should return empty string for empty data', () => {
      const result = convertToCSV([]);
      expect(result).toBe('');
    });
  });

  describe('generateFilename', () => {
    const location: Location = {
      name: 'Pearl Harbor',
      latitude: 21.3629,
      longitude: -157.9565,
    };

    const dateRange: DateRange = {
      startDate: '2024-01-15',
      endDate: '2024-01-20',
    };

    it('should generate filename for hourly data', () => {
      const result = generateFilename(location, dateRange, 'hourly', 'csv');
      expect(result).toBe('pearl_harbor_hourly_20240115_20240120.csv');
    });

    it('should generate filename for daily data', () => {
      const result = generateFilename(location, dateRange, 'daily', 'xlsx');
      expect(result).toBe('pearl_harbor_daily_20240115_20240120.xlsx');
    });

    it('should handle location names with special characters', () => {
      const locationWithSpecial: Location = {
        name: "Makapu'u Point",
        latitude: 21.3096,
        longitude: -157.6499,
      };

      const result = generateFilename(locationWithSpecial, dateRange, 'combined', 'csv');
      expect(result).toBe('makapu_u_point_combined_20240115_20240120.csv');
    });
  });

  describe('processWeatherDataForExport', () => {
    const mockWeatherData: WeatherApiResponse = {
      latitude: 21.3629,
      longitude: -157.9565,
      timezone: 'Pacific/Honolulu',
      hourly: {
        time: ['2024-01-15T00:00', '2024-01-15T01:00', '2024-01-15T02:00'],
        temperature_2m: [20.5, 21.0, 20.8],
        relative_humidity_2m: [65, 68, 70],
        precipitation: [0, 0.1, 0],
      },
      daily: {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [25.0, 24.5],
        temperature_2m_min: [18.0, 17.5],
      },
    };

    it('should process hourly data correctly', () => {
      const selectedHourlyVariables = ['temperature_2m', 'relative_humidity_2m'];
      const selectedDailyVariables: string[] = [];

      const result = processWeatherDataForExport(
        mockWeatherData,
        selectedHourlyVariables,
        selectedDailyVariables
      );

      expect(result.hourlyData).toHaveLength(3);
      expect(result.dailyData).toHaveLength(0);

      expect(result.hourlyData[0]).toEqual({
        time: '2024-01-15T00:00',
        date: expect.any(String),
        hour: 0,
        temperature_2m: 20.5,
        relative_humidity_2m: 65,
      });

      expect(result.hourlyData[1]).toEqual({
        time: '2024-01-15T01:00',
        date: expect.any(String),
        hour: 1,
        temperature_2m: 21.0,
        relative_humidity_2m: 68,
      });
    });

    it('should process daily data correctly', () => {
      const selectedHourlyVariables: string[] = [];
      const selectedDailyVariables = ['temperature_2m_max', 'temperature_2m_min'];

      const result = processWeatherDataForExport(
        mockWeatherData,
        selectedHourlyVariables,
        selectedDailyVariables
      );

      expect(result.hourlyData).toHaveLength(0);
      expect(result.dailyData).toHaveLength(2);

      expect(result.dailyData[0]).toEqual({
        time: '2024-01-15',
        date: expect.any(String),
        temperature_2m_max: 25.0,
        temperature_2m_min: 18.0,
      });
    });

    it('should handle missing variables gracefully', () => {
      const selectedHourlyVariables = ['temperature_2m', 'nonexistent_variable'];
      const selectedDailyVariables: string[] = [];

      const result = processWeatherDataForExport(
        mockWeatherData,
        selectedHourlyVariables,
        selectedDailyVariables
      );

      expect(result.hourlyData).toHaveLength(3);
      expect(result.hourlyData[0]).toHaveProperty('temperature_2m', 20.5);
      expect(result.hourlyData[0]).not.toHaveProperty('nonexistent_variable');
    });

    it('should handle null values in weather data', () => {
      const dataWithNulls: WeatherApiResponse = {
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00', '2024-01-15T01:00'],
          temperature_2m: [20.5, null],
          relative_humidity_2m: [65, 68],
        },
      };

      const result = processWeatherDataForExport(
        dataWithNulls,
        ['temperature_2m', 'relative_humidity_2m'],
        []
      );

      expect(result.hourlyData[0]).toHaveProperty('temperature_2m', 20.5);
      expect(result.hourlyData[1].temperature_2m).toBe(''); // null becomes empty string
      expect(result.hourlyData[1]).toHaveProperty('relative_humidity_2m', 68);
    });
  });

  describe('downloadFile', () => {
    it('should create and trigger download correctly', () => {
      const content = 'test,data\n1,2';
      const filename = 'test.csv';
      const mimeType = 'text/csv';

      downloadFile(content, filename, mimeType);

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('mock-blob-url');
    });
  });

  describe('exportWeatherDataToCSV', () => {
    const mockExportData = {
      location: { name: 'Test Location', latitude: 0, longitude: 0 },
      dateRange: { startDate: '2024-01-15', endDate: '2024-01-20' },
      weatherData: createMockWeatherData({
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
        daily: {
          time: ['2024-01-15'],
          temperature_2m_max: [25.0],
        },
      }),
      selectedHourlyVariables: ['temperature_2m'],
      selectedDailyVariables: ['temperature_2m_max'],
    };

    it('should export hourly data when includeHourly is true', () => {
      exportWeatherDataToCSV(mockExportData, {
        format: 'csv',
        includeHourly: true,
        includeDaily: false,
      });

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should export daily data when includeDaily is true', () => {
      exportWeatherDataToCSV(mockExportData, {
        format: 'csv',
        includeHourly: false,
        includeDaily: true,
      });

      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should export both hourly and daily data when both are true', () => {
      exportWeatherDataToCSV(mockExportData, {
        format: 'csv',
        includeHourly: true,
        includeDaily: true,
      });

      // Should be called twice (once for hourly, once for daily)
      expect(mockURL.createObjectURL).toHaveBeenCalledTimes(2);
      expect(mockClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('exportWeatherDataToExcel', () => {
    const mockExportData = {
      location: { name: 'Test Location', latitude: 0, longitude: 0 },
      dateRange: { startDate: '2024-01-15', endDate: '2024-01-20' },
      weatherData: createMockWeatherData({
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      }),
      selectedHourlyVariables: ['temperature_2m'],
      selectedDailyVariables: [],
    };

    it('should export Excel format with correct MIME type', () => {
      exportWeatherDataToExcel(mockExportData, {
        format: 'xlsx',
        includeHourly: true,
        includeDaily: false,
      });

      expect(mockURL.createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      );
    });
  });

  describe('exportWeatherData', () => {
    const mockExportData = {
      location: { name: 'Test Location', latitude: 0, longitude: 0 },
      dateRange: { startDate: '2024-01-15', endDate: '2024-01-20' },
      weatherData: createMockWeatherData({
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      }),
      selectedHourlyVariables: ['temperature_2m'],
      selectedDailyVariables: [],
    };

    it('should handle CSV export', () => {
      exportWeatherData(mockExportData, {
        format: 'csv',
        includeHourly: true,
        includeDaily: false,
      });

      expect(mockURL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle Excel export', () => {
      exportWeatherData(mockExportData, {
        format: 'xlsx',
        includeHourly: true,
        includeDaily: false,
      });

      expect(mockURL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle missing weather data gracefully', () => {
      const dataWithoutWeather = {
        ...mockExportData,
        weatherData: null,
      };

      // Should not throw error
      expect(() => {
        exportWeatherData(dataWithoutWeather as any, {
          format: 'csv',
          includeHourly: true,
          includeDaily: false,
        });
      }).not.toThrow();
    });

    it('should handle no export options selected', () => {
      // Should not throw error
      expect(() => {
        exportWeatherData(mockExportData, {
          format: 'csv',
          includeHourly: false,
          includeDaily: false,
        });
      }).not.toThrow();
    });
  });
}); 