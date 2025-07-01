import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DashboardState {
  // UI state
  selectedFeature: string | null;
  isLoading: boolean;
  
  // Actions
  setSelectedFeature: (feature: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Complex actions
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedFeature: null,
      isLoading: false,
      
      // Actions
      setSelectedFeature: (selectedFeature) => set({ selectedFeature }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Complex actions
      reset: () => set({
        selectedFeature: null,
        isLoading: false,
      }),
    }),
    { name: 'dashboard-store' }
  )
); 