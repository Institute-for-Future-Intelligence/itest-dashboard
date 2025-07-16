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
  startAfter: vi.fn(),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (writeBatch as any).mockReturnValue(mockBatch);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).mockReturnValue({ id: 'test-upload-id' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(writeBatch).mockReturnValue(mockBatch as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(doc).mockReturnValue({ id: 'test-upload-id' } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(collection).mockReturnValue({} as any);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(query).mockReturnValue({} as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(collection).mockReturnValue({} as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(where).mockReturnValue({} as any);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(query).mockReturnValue({} as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(collection).mockReturnValue({} as any);

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

  describe('getSensorDataPaginated', () => {
    it('should return paginated data with cursor for next page', async () => {
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
          {
            id: 'doc2',
            data: () => ({
              id: 'doc2',
              timestamp: new Timestamp(1640995260, 0),
              date: '2024-01-15',
              location: 'test-location',
              humidity: 83.0,
              co2: 445,
              ph: 8.05,
              salinity: 33.31,
              temperature: 25.6,
              waterTemperature: 26.9,
              externalHumidity: 69.2,
              uploadedBy: 'test-user',
              uploadedAt: new Timestamp(1640995260, 0),
            }),
          },
          {
            id: 'doc3',
            data: () => ({
              id: 'doc3',
              timestamp: new Timestamp(1640995320, 0),
              date: '2024-01-15',
              location: 'test-location',
              humidity: 83.5,
              co2: 446,
              ph: 8.06,
              salinity: 33.32,
              temperature: 25.7,
              waterTemperature: 27.0,
              externalHumidity: 69.3,
              uploadedBy: 'test-user',
              uploadedAt: new Timestamp(1640995320, 0),
            }),
          },
        ],
      };

      const { getDocs, query, collection, where, orderBy, limit, startAfter } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);
      vi.mocked(startAfter).mockReturnValue({} as any);

      const result = await sensorService.getSensorDataPaginated({}, undefined, 2);

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 'doc1' }),
          expect.objectContaining({ id: 'doc2' }),
        ]),
        hasMore: true,
        lastDoc: expect.any(Object),
      });
      expect(result.data).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.lastDoc).toBeDefined();
    });

    it('should handle last page correctly', async () => {
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

      const { getDocs, query, collection, where, orderBy, limit, startAfter } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);
      vi.mocked(startAfter).mockReturnValue({} as any);

      const result = await sensorService.getSensorDataPaginated({}, undefined, 2);

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 'doc1' }),
        ]),
        hasMore: false,
        lastDoc: undefined,
      });
      expect(result.data).toHaveLength(1);
      expect(result.hasMore).toBe(false);
      expect(result.lastDoc).toBeUndefined();
    });

    it('should apply smart defaults for pagination', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      await sensorService.getSensorDataPaginated({}, undefined, 50);

      // Verify smart defaults are applied
      expect(where).toHaveBeenCalledWith('date', '>=', expect.any(String));
      expect(where).toHaveBeenCalledWith('date', '<=', expect.any(String));
      expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(limit).toHaveBeenCalledWith(51); // pageSize + 1
    });

    it('should handle cursor pagination with startAfter', async () => {
      const mockCursor = { id: 'cursor-doc' };
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'doc2',
            data: () => ({
              id: 'doc2',
              timestamp: new Timestamp(1640995260, 0),
              date: '2024-01-15',
              location: 'test-location',
              humidity: 83.0,
              co2: 445,
              ph: 8.05,
              salinity: 33.31,
              temperature: 25.6,
              waterTemperature: 26.9,
              externalHumidity: 69.2,
              uploadedBy: 'test-user',
              uploadedAt: new Timestamp(1640995260, 0),
            }),
          },
        ],
      };

      const { getDocs, query, collection, where, orderBy, limit, startAfter } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);
      vi.mocked(startAfter).mockReturnValue({} as any);

      await sensorService.getSensorDataPaginated({}, mockCursor, 1);

      expect(startAfter).toHaveBeenCalledWith(mockCursor);
    });

    it('should apply client-side numeric range filters', async () => {
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
          {
            id: 'doc2',
            data: () => ({
              id: 'doc2',
              timestamp: new Timestamp(1640995260, 0),
              date: '2024-01-15',
              location: 'test-location',
              humidity: 85.0, // Outside range
              co2: 445,
              ph: 8.05,
              salinity: 33.31,
              temperature: 25.6,
              waterTemperature: 26.9,
              externalHumidity: 69.2,
              uploadedBy: 'test-user',
              uploadedAt: new Timestamp(1640995260, 0),
            }),
          },
        ],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      const result = await sensorService.getSensorDataPaginated({
        humidityRange: { min: 80.0, max: 84.0 },
      }, undefined, 2);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('doc1');
    });
  });

  describe('getSensorData performance optimizations', () => {
    it('should apply default limits to prevent loading all records', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      await sensorService.getSensorData({});

      // Verify default limit is applied
      expect(limit).toHaveBeenCalledWith(1000); // DEFAULT_LIMIT
    });

    it('should apply smart default date range', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      await sensorService.getSensorData({});

      // Verify smart default date range is applied (last 30 days)
      expect(where).toHaveBeenCalledWith('date', '>=', expect.any(String));
      expect(where).toHaveBeenCalledWith('date', '<=', expect.any(String));
    });

    it('should respect user-provided limits', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      await sensorService.getSensorData({ limit: 500 });

      // Verify user-provided limit is respected
      expect(limit).toHaveBeenCalledWith(500);
    });

    it('should respect user-provided date range', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);
      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(limit).mockReturnValue({} as any);

      const userDateRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      await sensorService.getSensorData({ dateRange: userDateRange });

      // Verify user-provided date range is respected
      expect(where).toHaveBeenCalledWith('date', '>=', '2024-01-01');
      expect(where).toHaveBeenCalledWith('date', '<=', '2024-01-31');
    });
  });
}); 