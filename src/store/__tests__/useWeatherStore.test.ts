import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeatherStore } from '../useWeatherStore';

// Mock the weatherExport utility
vi.mock('../../utils/weatherExport', () => ({
  exportWeatherData: vi.fn(),
}));

import { exportWeatherData } from '../../utils/weatherExport';

describe('useWeatherStore export functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useWeatherStore.getState().reset();
  });

  describe('exportToCSV', () => {
    it('should export CSV when data is available', async () => {
      const store = useWeatherStore.getState();
      
      // Set up store with required data
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setDateRange({
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      });
      store.setSelectedHourlyVariables(['temperature_2m']);
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      await store.exportToCSV();

      expect(exportWeatherData).toHaveBeenCalledWith(
        {
          location: expect.objectContaining({ name: 'Pearl Harbor' }),
          dateRange: { startDate: '2024-01-15', endDate: '2024-01-20' },
          weatherData: expect.objectContaining({ latitude: 21.3629 }),
          selectedHourlyVariables: ['temperature_2m'],
          selectedDailyVariables: [],
        },
        expect.objectContaining({
          format: 'csv',
          includeHourly: true,
          includeDaily: false,
        })
      );
    });

    it('should set error when no data is available', async () => {
      const store = useWeatherStore.getState();
      
      await store.exportToCSV();

      expect(store.exportError).toBe('No data available for export');
      expect(exportWeatherData).not.toHaveBeenCalled();
    });

    it('should set loading state during export', async () => {
      const store = useWeatherStore.getState();
      
      // Set up store with required data
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      // Mock exportWeatherData to be async
      const mockExport = vi.mocked(exportWeatherData);
      mockExport.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const exportPromise = store.exportToCSV();
      
      // Check loading state is true during export
      expect(store.isExporting).toBe(true);
      
      await exportPromise;
      
      // Check loading state is false after export
      expect(store.isExporting).toBe(false);
    });

    it('should handle export errors gracefully', async () => {
      const store = useWeatherStore.getState();
      
      // Set up store with required data
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      // Mock exportWeatherData to throw an error
      const mockExport = vi.mocked(exportWeatherData);
      mockExport.mockRejectedValue(new Error('Export failed'));

      await store.exportToCSV();

      expect(store.exportError).toBe('Export failed');
      expect(store.isExporting).toBe(false);
    });
  });

  describe('exportToExcel', () => {
    it('should export Excel when data is available', async () => {
      const store = useWeatherStore.getState();
      
      // Set up store with required data
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setSelectedDailyVariables(['temperature_2m_max']);
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        daily: {
          time: ['2024-01-15'],
          temperature_2m_max: [25.0],
        },
      });

      await store.exportToExcel();

      expect(exportWeatherData).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedDailyVariables: ['temperature_2m_max'],
        }),
        expect.objectContaining({
          format: 'xlsx',
          includeHourly: false,
          includeDaily: true,
        })
      );
    });
  });

  describe('canExport', () => {
    it('should return true when all required data is available', () => {
      const store = useWeatherStore.getState();
      
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setSelectedHourlyVariables(['temperature_2m']);
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      expect(store.canExport()).toBe(true);
    });

    it('should return false when no data is available', () => {
      const store = useWeatherStore.getState();
      
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setSelectedHourlyVariables(['temperature_2m']);

      expect(store.canExport()).toBe(false);
    });

    it('should return false when no location is selected', () => {
      const store = useWeatherStore.getState();
      
      store.setSelectedHourlyVariables(['temperature_2m']);
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      expect(store.canExport()).toBe(false);
    });

    it('should return false when no variables are selected', () => {
      const store = useWeatherStore.getState();
      
      store.setSelectedLocation({
        name: 'Pearl Harbor',
        latitude: 21.3629,
        longitude: -157.9565,
      });
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });

      expect(store.canExport()).toBe(false);
    });
  });

  describe('clearExportError', () => {
    it('should clear export error', () => {
      const store = useWeatherStore.getState();
      
      // Set an error first
      store.exportToCSV(); // This will set an error due to no data
      expect(store.exportError).toBeTruthy();
      
      store.clearExportError();
      expect(store.exportError).toBe(null);
    });
  });

  describe('reset', () => {
    it('should reset export state', () => {
      const store = useWeatherStore.getState();
      
      // Set some export state
      store.setData({
        latitude: 21.3629,
        longitude: -157.9565,
        timezone: 'Pacific/Honolulu',
        hourly: {
          time: ['2024-01-15T00:00'],
          temperature_2m: [20.5],
        },
      });
      
      store.reset();
      
      expect(store.isExporting).toBe(false);
      expect(store.exportError).toBe(null);
      expect(store.data).toBe(null);
    });
  });
}); 