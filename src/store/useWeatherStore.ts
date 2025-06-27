import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WeatherApiResponse, Location, DateRange } from '../types/weather';

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
  
  // Computed getters
  hasData: () => boolean;
  hasError: () => boolean;
  isComplete: () => boolean; // All required fields filled
  
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
      
      // Complex actions
      clearAll: () => set({
        data: null,
        loading: false,
        error: null,
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
      }),
    }),
    { name: 'weather-store' }
  )
); 