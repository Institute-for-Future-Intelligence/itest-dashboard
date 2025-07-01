import { describe, it, expect, beforeEach } from 'vitest';
import { useDashboardStore } from '../useDashboardStore';

describe('useDashboardStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useDashboardStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useDashboardStore.getState();
      
      expect(state.selectedFeature).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Actions', () => {
    it('should set selected feature', () => {
      const { setSelectedFeature } = useDashboardStore.getState();
      
      setSelectedFeature('weather');
      
      expect(useDashboardStore.getState().selectedFeature).toBe('weather');
    });

    it('should clear selected feature', () => {
      const { setSelectedFeature } = useDashboardStore.getState();
      
      setSelectedFeature('sensors');
      expect(useDashboardStore.getState().selectedFeature).toBe('sensors');
      
      setSelectedFeature(null);
      expect(useDashboardStore.getState().selectedFeature).toBeNull();
    });

    it('should set loading state', () => {
      const { setLoading } = useDashboardStore.getState();
      
      setLoading(true);
      expect(useDashboardStore.getState().isLoading).toBe(true);
      
      setLoading(false);
      expect(useDashboardStore.getState().isLoading).toBe(false);
    });

    it('should reset state to initial values', () => {
      const { setSelectedFeature, setLoading, reset } = useDashboardStore.getState();
      
      // Set some state
      setSelectedFeature('water-quality');
      setLoading(true);
      
      // Verify state is set
      expect(useDashboardStore.getState().selectedFeature).toBe('water-quality');
      expect(useDashboardStore.getState().isLoading).toBe(true);
      
      // Reset and verify
      reset();
      expect(useDashboardStore.getState().selectedFeature).toBeNull();
      expect(useDashboardStore.getState().isLoading).toBe(false);
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple accesses', () => {
      const { setSelectedFeature } = useDashboardStore.getState();
      
      setSelectedFeature('sensors');
      
      // Access state multiple times to ensure persistence
      expect(useDashboardStore.getState().selectedFeature).toBe('sensors');
      expect(useDashboardStore.getState().selectedFeature).toBe('sensors');
    });

    it('should allow multiple state updates', () => {
      const { setSelectedFeature, setLoading } = useDashboardStore.getState();
      
      setSelectedFeature('weather');
      setLoading(true);
      
      expect(useDashboardStore.getState().selectedFeature).toBe('weather');
      expect(useDashboardStore.getState().isLoading).toBe(true);
      
      setSelectedFeature('water-quality');
      
      expect(useDashboardStore.getState().selectedFeature).toBe('water-quality');
      expect(useDashboardStore.getState().isLoading).toBe(true); // Should remain unchanged
    });
  });
}); 