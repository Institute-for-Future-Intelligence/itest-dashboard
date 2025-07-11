import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WeatherApiResponse, Location, DateRange } from '../types/weather';
import { exportWeatherData, type ExportOptions } from '../utils/weatherExport';

interface WeatherState {
  // Data state
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
  
  // UI state
  selectedLocation: Location | null;
  dateRange: DateRange;
  selectedHourlyVariables: string[];
  selectedDailyVariables: string[];
  isVariableSelectorCollapsed: boolean;
  
  // Export state
  isExporting: boolean;
  exportError: string | null;
  
  // Actions
  setData: (data: WeatherApiResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  setDateRange: (dateRange: DateRange) => void;
  setSelectedHourlyVariables: (variables: string[]) => void;
  setSelectedDailyVariables: (variables: string[]) => void;
  setVariableSelectorCollapsed: (collapsed: boolean) => void;
  toggleVariableSelectorCollapse: () => void;
  
  // Export actions
  exportToCSV: (options?: Partial<ExportOptions>) => Promise<void>;
  exportToExcel: (options?: Partial<ExportOptions>) => Promise<void>;
  clearExportError: () => void;
  
  // Computed getters
  hasData: () => boolean;
  hasError: () => boolean;
  isComplete: () => boolean; // All required fields filled
  canExport: () => boolean; // Can export data
  
  // Complex actions
  clearAll: () => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set, get) => ({
      // Initial state
      data: null,
      loading: false,
      error: null,
      selectedLocation: null,
      dateRange: { startDate: '', endDate: '' },
      selectedHourlyVariables: [],
      selectedDailyVariables: [],
      isVariableSelectorCollapsed: false,
      
      // Export state
      isExporting: false,
      exportError: null,
      
      // Simple actions
      setData: (data) => set({ data, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
      setDateRange: (dateRange) => set({ dateRange }),
      setSelectedHourlyVariables: (selectedHourlyVariables) => set({ selectedHourlyVariables }),
      setSelectedDailyVariables: (selectedDailyVariables) => set({ selectedDailyVariables }),
      setVariableSelectorCollapsed: (isVariableSelectorCollapsed) => set({ isVariableSelectorCollapsed }),
      toggleVariableSelectorCollapse: () => set((state) => ({ 
        isVariableSelectorCollapsed: !state.isVariableSelectorCollapsed 
      })),
      
      // Export actions
      exportToCSV: async (options) => {
        const state = get();
        if (!state.data || !state.selectedLocation) {
          set({ exportError: 'No data available for export' });
          return;
        }

        try {
          set({ isExporting: true, exportError: null });
          
          const exportData = {
            location: state.selectedLocation,
            dateRange: state.dateRange,
            weatherData: state.data,
            selectedHourlyVariables: state.selectedHourlyVariables,
            selectedDailyVariables: state.selectedDailyVariables,
          };

          const defaultOptions: ExportOptions = {
            format: 'csv' as const,
            includeHourly: state.selectedHourlyVariables.length > 0,
            includeDaily: state.selectedDailyVariables.length > 0,
          };

          const exportOptions = { ...defaultOptions, ...options };
          exportWeatherData(exportData, exportOptions);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to export CSV';
          set({ exportError: errorMessage });
        } finally {
          set({ isExporting: false });
        }
      },
      
      exportToExcel: async (options) => {
        const state = get();
        if (!state.data || !state.selectedLocation) {
          set({ exportError: 'No data available for export' });
          return;
        }

        try {
          set({ isExporting: true, exportError: null });
          
          const exportData = {
            location: state.selectedLocation,
            dateRange: state.dateRange,
            weatherData: state.data,
            selectedHourlyVariables: state.selectedHourlyVariables,
            selectedDailyVariables: state.selectedDailyVariables,
          };

          const defaultOptions: ExportOptions = {
            format: 'xlsx' as const,
            includeHourly: state.selectedHourlyVariables.length > 0,
            includeDaily: state.selectedDailyVariables.length > 0,
          };

          const exportOptions = { ...defaultOptions, ...options };
          exportWeatherData(exportData, exportOptions);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to export Excel';
          set({ exportError: errorMessage });
        } finally {
          set({ isExporting: false });
        }
      },
      
      clearExportError: () => set({ exportError: null }),
      
      // Computed getters
      hasData: () => !!get().data,
      hasError: () => !!get().error,
      isComplete: () => {
        const state = get();
        return !!(
          state.selectedLocation &&
          state.dateRange.startDate &&
          state.dateRange.endDate &&
          (state.selectedHourlyVariables.length > 0 || state.selectedDailyVariables.length > 0)
        );
      },
      canExport: () => {
        const state = get();
        return !!(
          state.data &&
          state.selectedLocation &&
          (state.selectedHourlyVariables.length > 0 || state.selectedDailyVariables.length > 0)
        );
      },
      
      // Complex actions
      clearAll: () => set({
        data: null,
        loading: false,
        error: null,
        isExporting: false,
        exportError: null,
      }),
      
      reset: () => set({
        data: null,
        loading: false,
        error: null,
        selectedLocation: null,
        dateRange: { startDate: '', endDate: '' },
        selectedHourlyVariables: [],
        selectedDailyVariables: [],
        isVariableSelectorCollapsed: false,
        isExporting: false,
        exportError: null,
      }),
    }),
    { name: 'weather-store' }
  )
); 