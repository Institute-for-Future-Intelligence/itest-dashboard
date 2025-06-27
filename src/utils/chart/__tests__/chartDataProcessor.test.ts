import { describe, it, expect } from 'vitest';
import { processWeatherData, validateDataQuality } from '../chartDataProcessor';
import type { WeatherApiResponse } from '../../../types/weather';

describe('chartDataProcessor', () => {
  describe('processWeatherData', () => {
    it('should process valid weather data correctly', () => {
      const mockWeatherData: WeatherApiResponse['hourly'] = {
        time: ['2024-01-01T12:00:00Z', '2024-01-01T13:00:00Z'], // Use midday to avoid timezone edge cases
        temperature_2m: [68.9, 69.8], // Fahrenheit values (previously 20.5°C, 21.0°C)
        humidity_2m: [65, 68],
      };

      const result = processWeatherData(mockWeatherData, ['temperature_2m', 'humidity_2m']);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        time: '2024-01-01T12:00:00Z',
        date: new Date('2024-01-01T12:00:00Z').toLocaleDateString(), // Use actual conversion for consistency
        temperature_2m: 68.9,
        humidity_2m: 65,
      });
    });

    it('should filter out missing values', () => {
      const mockWeatherData: WeatherApiResponse['hourly'] = {
        time: ['2024-01-01T00:00:00Z', '2024-01-01T01:00:00Z', '2024-01-01T02:00:00Z'],
        temperature_2m: [68.9, null, 71.6], // Fahrenheit values (previously 20.5°C, 22.0°C)
        humidity_2m: [65, 68, null],
      };

      const result = processWeatherData(mockWeatherData, ['temperature_2m', 'humidity_2m']);

      expect(result).toHaveLength(3);
      expect(result[0].temperature_2m).toBe(68.9);
      expect(result[1].temperature_2m).toBeUndefined(); // null values filtered out
      expect(result[2].humidity_2m).toBeUndefined(); // null values filtered out
    });

    it('should filter out time points with no valid data', () => {
      const mockWeatherData: WeatherApiResponse['hourly'] = {
        time: ['2024-01-01T00:00:00Z', '2024-01-01T01:00:00Z'],
        temperature_2m: [68.9, null], // Fahrenheit value (previously 20.5°C)
        humidity_2m: [null, null],
      };

      const result = processWeatherData(mockWeatherData, ['temperature_2m', 'humidity_2m']);

      expect(result).toHaveLength(1); // Only first time point has valid data
      expect(result[0].temperature_2m).toBe(68.9);
    });

    it('should return empty array for empty data', () => {
      const result = processWeatherData(undefined, ['temperature_2m']);
      expect(result).toEqual([]);
    });
  });

  describe('validateDataQuality', () => {
    it('should calculate completeness correctly', () => {
      const result = validateDataQuality(100, 75);
      
      expect(result.completeness).toBe(75);
      expect(result.isValid).toBe(true);
    });

    it('should mark low completeness as invalid', () => {
      const result = validateDataQuality(100, 5);
      
      expect(result.completeness).toBe(5);
      expect(result.isValid).toBe(false);
    });

    it('should handle zero original points', () => {
      const result = validateDataQuality(0, 0);
      
      expect(result.completeness).toBe(0);
      expect(result.isValid).toBe(false);
    });
  });
}); 