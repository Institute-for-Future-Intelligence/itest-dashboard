import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sensorService } from '../sensorService';
import type { RawSensorData } from '../../types/sensor';
import { Timestamp } from 'firebase/firestore';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  writeBatch: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
  Timestamp: Object.assign(
    vi.fn().mockImplementation(function(seconds: number, nanoseconds: number) {
      return { 
        seconds, 
        nanoseconds,
        toDate: vi.fn(() => new Date(seconds * 1000))
      };
    }),
    {
      now: vi.fn(() => ({ seconds: 1640995200, nanoseconds: 0 })),
      fromDate: vi.fn((date: Date) => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 })),
    }
  ),
}));

// Mock Firebase config
vi.mock('../firebase', () => ({
  db: {},
}));

describe('sensorService - Extended Variables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadSensorData', () => {
    it('should process all 7 sensor variables correctly', async () => {
      const mockRawData: RawSensorData[] = [
        {
          Date: '2024-01-15',
          Temperature: 25.5,
          'Water Temperature ': 26.8,
          Humidity: 82.5,
          'Ext.Humidity': 69.1,
          CO2: 444,
          pH: 8.04,
          Salinity: 33.30,
        },
      ];

      const mockBatch = {
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };

      const { writeBatch, doc, collection } = await import('firebase/firestore');
      (writeBatch as any).mockReturnValue(mockBatch);
      (doc as any).mockReturnValue({ id: 'test-upload-id' });
      (collection as any).mockReturnValue({});

      const result = await sensorService.uploadSensorData(mockRawData, 'test-file.xlsx', 'test-user', 'test-location');

      expect(result.uploadId).toBeDefined();
      expect(result.processedCount).toBe(1);
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();

      // Check that upload metadata was set correctly
      const uploadMetadataCall = mockBatch.set.mock.calls.find(call => 
        call[1].fileName === 'test-file.xlsx'
      );
      expect(uploadMetadataCall).toBeDefined();
      expect(uploadMetadataCall![1]).toMatchObject({
        fileName: 'test-file.xlsx',
        location: 'test-location',
        uploadedBy: 'test-user',
        recordCount: 1,
      });

      // Check that sensor data was set correctly
      const sensorDataCall = mockBatch.set.mock.calls.find(call => 
        call[1].humidity === 82.5
      );
      expect(sensorDataCall).toBeDefined();
      expect(sensorDataCall![1]).toMatchObject({
        location: 'test-location',
        humidity: 82.5,
        co2: 444,
        ph: 8.04,
        salinity: 33.30,
        temperature: 25.5,
        waterTemperature: 26.8,
        externalHumidity: 69.1,
        uploadedBy: 'test-user',
      });
    });

    it('should handle missing values for new variables', async () => {
      const mockRawData: RawSensorData[] = [
        {
          Date: '2024-01-15',
          Temperature: NaN,
          'Water Temperature ': NaN,
          Humidity: 82.5,
          'Ext.Humidity': NaN,
          CO2: 444,
          pH: 8.04,
          Salinity: 33.30,
        },
      ];

      const mockBatch = {
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };

      const { writeBatch, doc, collection } = await import('firebase/firestore');
      (writeBatch as any).mockReturnValue(mockBatch);
      (doc as any).mockReturnValue({ id: 'test-upload-id' });
      (collection as any).mockReturnValue({});

      const result = await sensorService.uploadSensorData(mockRawData, 'test-file.xlsx', 'test-user', 'test-location');

      expect(result.uploadId).toBeDefined();
      expect(result.processedCount).toBe(1);

      const sensorDataCall = mockBatch.set.mock.calls.find(call => 
        call[1].humidity === 82.5
      );
      expect(sensorDataCall).toBeDefined();
      expect(sensorDataCall![1].temperature).toBeNaN();
      expect(sensorDataCall![1].waterTemperature).toBeNaN();
      expect(sensorDataCall![1].externalHumidity).toBeNaN();
      expect(sensorDataCall![1].humidity).toBe(82.5);
    });
  });

  describe('getSensorData', () => {
    it('should filter by new temperature variables', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'doc1',
            data: () => ({
              id: 'doc1',
              timestamp: new Timestamp(1640995200, 0),
              date: '2024-01-15',
              location: 'test-location',
              humidity: 82.5,
              co2: 444,
              ph: 8.04,
              salinity: 33.30,
              temperature: 25.5,
              waterTemperature: 26.8,
              externalHumidity: 69.1,
              uploadedBy: 'test-user',
              uploadedAt: new Timestamp(1640995200, 0),
            }),
          },
        ],
      };

      const { getDocs, query, collection, where } = await import('firebase/firestore');
      (getDocs as any).mockResolvedValue(mockQuerySnapshot);
      (query as any).mockReturnValue({});
      (collection as any).mockReturnValue({});
      (where as any).mockReturnValue({});

      const result = await sensorService.getSensorData({
        temperatureRange: { min: 25.0, max: 26.0 },
        waterTemperatureRange: { min: 26.0, max: 27.0 },
        externalHumidityRange: { min: 69.0, max: 70.0 },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        temperature: 25.5,
        waterTemperature: 26.8,
        externalHumidity: 69.1,
      });
    });
  });

  describe('getSensorDataStats', () => {
    it('should calculate statistics for all 7 variables', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            data: () => ({
              timestamp: new Timestamp(1640995200, 0),
              humidity: 82.5,
              co2: 444,
              ph: 8.04,
              salinity: 33.30,
              temperature: 25.5,
              waterTemperature: 26.8,
              externalHumidity: 69.1,
            }),
          },
          {
            data: () => ({
              timestamp: new Timestamp(1640995300, 0),
              humidity: 78.2,
              co2: 442,
              ph: 8.05,
              salinity: 33.25,
              temperature: 24.8,
              waterTemperature: 25.9,
              externalHumidity: 71.2,
            }),
          },
        ],
      };

      const { getDocs, query, collection } = await import('firebase/firestore');
      (getDocs as any).mockResolvedValue(mockQuerySnapshot);
      (query as any).mockReturnValue({});
      (collection as any).mockReturnValue({});

      const result = await sensorService.getSensorDataStats();

      expect(result.totalRecords).toBe(2);
      expect(result.averages).toHaveProperty('temperature');
      expect(result.averages).toHaveProperty('waterTemperature');
      expect(result.averages).toHaveProperty('externalHumidity');
      expect(result.ranges).toHaveProperty('temperature');
      expect(result.ranges).toHaveProperty('waterTemperature');
      expect(result.ranges).toHaveProperty('externalHumidity');
      
      // Check that the calculations are correct
      expect(result.averages.temperature).toBeCloseTo(25.15, 2);
      expect(result.averages.waterTemperature).toBeCloseTo(26.35, 2);
      expect(result.averages.externalHumidity).toBeCloseTo(70.15, 2);
    });
  });
}); 