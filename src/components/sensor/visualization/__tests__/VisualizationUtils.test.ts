import { describe, it, expect } from 'vitest';
import { processChartData, calculateStatistics } from '../VisualizationUtils';
import type { SensorDataPoint } from '../../../../types/sensor';
import { Timestamp } from 'firebase/firestore';

// Mock sensor data with all 7 variables
const createMockSensorData = (overrides: Partial<SensorDataPoint> = {}): SensorDataPoint => ({
  id: '1',
  date: '2024-01-15',
  humidity: 82.5,
  co2: 444,
  ph: 8.04,
  salinity: 33.30,
  temperature: 25.5,
  waterTemperature: 26.8,
  externalHumidity: 69.1,
  location: 'test-location',
  timestamp: new Date('2024-01-15T12:00:00Z'),
  uploadedBy: 'test-user',
  uploadedAt: new Timestamp(Date.now() / 1000, 0),
  ...overrides,
});

describe('VisualizationUtils - Extended Sensor Variables', () => {
  describe('processChartData', () => {
    it('should process chart data with all 7 sensor variables', () => {
      const mockData = [
        createMockSensorData({ 
          id: '1', 
          date: '2024-01-15', 
          timestamp: new Date('2024-01-15T12:00:00Z')
        }),
        createMockSensorData({ 
          id: '2', 
          date: '2024-01-16', 
          timestamp: new Date('2024-01-16T12:00:00Z'),
          temperature: 24.8, 
          waterTemperature: 25.9, 
          externalHumidity: 71.2 
        }),
      ];

      const result = processChartData(mockData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: expect.any(String),
        fullTimestamp: expect.any(String),
        date: '1/15/2024',
        humidity: 82.5,
        co2: 444,
        ph: 8.04,
        salinity: 33.30,
        temperature: 25.5,
        waterTemperature: 26.8,
        externalHumidity: 69.1,
      });
      expect(result[1]).toEqual({
        timestamp: expect.any(String),
        fullTimestamp: expect.any(String),
        date: '1/16/2024',
        humidity: 82.5,
        co2: 444,
        ph: 8.04,
        salinity: 33.30,
        temperature: 24.8,
        waterTemperature: 25.9,
        externalHumidity: 71.2,
      });
    });

    it('should handle missing values for new variables', () => {
      const mockData = [
        createMockSensorData({ temperature: NaN, waterTemperature: NaN, externalHumidity: NaN }),
      ];

      const result = processChartData(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].temperature).toBeNaN();
      expect(result[0].waterTemperature).toBeNaN();
      expect(result[0].externalHumidity).toBeNaN();
    });

    it('should sort data by date correctly', () => {
      const mockData = [
        createMockSensorData({ 
          id: '1', 
          date: '2024-01-15', 
          timestamp: new Date('2024-01-15T12:00:00Z')
        }),
        createMockSensorData({ 
          id: '2', 
          date: '2024-01-16', 
          timestamp: new Date('2024-01-16T12:00:00Z')
        }),
        createMockSensorData({ 
          id: '3', 
          date: '2024-01-17', 
          timestamp: new Date('2024-01-17T12:00:00Z')
        }),
      ];

      const result = processChartData(mockData);

      expect(result[0].date).toBe('1/15/2024');
      expect(result[1].date).toBe('1/16/2024');
      expect(result[2].date).toBe('1/17/2024');
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate statistics for all sensor variables', () => {
      const mockData = [
        createMockSensorData({ temperature: 25.5, waterTemperature: 26.8, externalHumidity: 69.1 }),
        createMockSensorData({ temperature: 24.8, waterTemperature: 25.9, externalHumidity: 71.2 }),
        createMockSensorData({ temperature: 26.2, waterTemperature: 27.1, externalHumidity: 68.5 }),
      ];

      const result = calculateStatistics(mockData);

      expect(result.temperature).toEqual({
        min: 24.8,
        max: 26.2,
        avg: 25.5,
      });

      expect(result.waterTemperature).toEqual({
        min: 25.9,
        max: 27.1,
        avg: 26.6,
      });

      expect(result.externalHumidity).toEqual({
        min: 68.5,
        max: 71.2,
        avg: 69.6,
      });
    });

    it('should handle NaN values in statistics calculation', () => {
      const mockData = [
        createMockSensorData({ temperature: 25.5, waterTemperature: NaN, externalHumidity: 69.1 }),
        createMockSensorData({ temperature: NaN, waterTemperature: 25.9, externalHumidity: NaN }),
      ];

      const result = calculateStatistics(mockData);

      expect(result.temperature).toEqual({
        min: 25.5,
        max: 25.5,
        avg: 25.5,
      });

      expect(result.waterTemperature).toEqual({
        min: 25.9,
        max: 25.9,
        avg: 25.9,
      });

      expect(result.externalHumidity).toEqual({
        min: 69.1,
        max: 69.1,
        avg: 69.1,
      });
    });

    it('should handle empty data array', () => {
      const result = calculateStatistics([]);

      expect(result.temperature).toEqual({
        min: 0,
        max: 0,
        avg: 0,
      });

      expect(result.waterTemperature).toEqual({
        min: 0,
        max: 0,
        avg: 0,
      });

      expect(result.externalHumidity).toEqual({
        min: 0,
        max: 0,
        avg: 0,
      });
    });

    it('should calculate averages correctly with precision', () => {
      const mockData = [
        createMockSensorData({ temperature: 25.123, waterTemperature: 26.456, externalHumidity: 69.789 }),
        createMockSensorData({ temperature: 24.567, waterTemperature: 25.321, externalHumidity: 71.234 }),
      ];

      const result = calculateStatistics(mockData);

      expect(result.temperature.avg).toBeCloseTo(24.8, 1);
      expect(result.waterTemperature.avg).toBeCloseTo(25.9, 1);
      expect(result.externalHumidity.avg).toBeCloseTo(70.5, 1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle data with only some variables present', () => {
      const mockData = [
        createMockSensorData({ temperature: 25.5, waterTemperature: 0, externalHumidity: 69.1 }),
      ];

      const result = processChartData(mockData);
      
      expect(result[0].temperature).toBe(25.5);
      expect(result[0].waterTemperature).toBe(0);
      expect(result[0].externalHumidity).toBe(69.1);
    });

    it('should handle extreme values without errors', () => {
      const mockData = [
        createMockSensorData({ 
          temperature: -50, 
          waterTemperature: 60, 
          externalHumidity: 120 
        }),
      ];

      const result = processChartData(mockData);
      
      expect(result[0].temperature).toBe(-50);
      expect(result[0].waterTemperature).toBe(60);
      expect(result[0].externalHumidity).toBe(120);
    });

    it('should handle duplicate dates correctly', () => {
      const mockData = [
        createMockSensorData({ 
          id: '1', 
          date: '2024-01-15', 
          timestamp: new Date('2024-01-15T12:00:00Z'),
          temperature: 25.5 
        }),
        createMockSensorData({ 
          id: '2', 
          date: '2024-01-15', 
          timestamp: new Date('2024-01-15T13:00:00Z'),
          temperature: 26.0 
        }),
      ];

      const result = processChartData(mockData);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('1/15/2024');
      expect(result[1].date).toBe('1/15/2024');
    });
  });
}); 