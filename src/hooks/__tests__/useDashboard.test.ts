import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../useDashboard';

// Mock dependencies
const mockNavigate = vi.fn();
const mockHasPermission = vi.fn();
const mockSetSelectedFeature = vi.fn();
const mockSetLoading = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockPermissions = {
  hasPermission: mockHasPermission,
  isAdmin: false,
  isEducator: false,
  isStudent: true,
};

vi.mock('./usePermissions', () => ({
  usePermissions: () => mockPermissions,
}));

vi.mock('../store/useDashboardStore', () => ({
  useDashboardStore: () => ({
    selectedFeature: null,
    isLoading: false,
    setSelectedFeature: mockSetSelectedFeature,
    setLoading: mockSetLoading,
  }),
}));

vi.mock('../utils/dashboardConfig', () => ({
  FEATURE_CARDS: [
    {
      id: 'weather',
      title: 'Weather Data Analysis',
      iconComponent: vi.fn().mockImplementation(() => ({ muiName: 'CloudIcon' })),
      description: 'Weather analysis description',
      features: ['Feature 1', 'Feature 2'],
      path: '/weather',
      permission: 'canAccessWeatherData',
      color: '#2196f3',
      stats: 'Real-time API Data'
    },
    {
      id: 'sensors',
      title: 'Sensor Data Management',
      iconComponent: vi.fn().mockImplementation(() => ({ muiName: 'SensorsIcon' })),
      description: 'Sensor management description',
      features: ['Feature A', 'Feature B'],
      path: '/sensors',
      permission: 'canViewSensorData',
      color: '#4caf50',
      stats: 'Multi-parameter Tracking'
    },
  ],
}));

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset permission mocks
    mockPermissions.isAdmin = false;
    mockPermissions.isEducator = false;
    mockPermissions.isStudent = true;
    mockHasPermission.mockReturnValue(false);
  });

  describe('Initial State', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.selectedFeature).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.roleDisplayName).toBe('Student');
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('Role Display Name', () => {
    it('should return "Administrator" for admin users', () => {
      mockPermissions.isAdmin = true;
      mockPermissions.isEducator = false;
      mockPermissions.isStudent = false;

      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.roleDisplayName).toBe('Administrator');
    });

    it('should return "Educator" for educator users', () => {
      mockPermissions.isAdmin = false;
      mockPermissions.isEducator = true;
      mockPermissions.isStudent = false;

      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.roleDisplayName).toBe('Educator');
    });

    it('should return "Student" for student users', () => {
      mockPermissions.isAdmin = false;
      mockPermissions.isEducator = false;
      mockPermissions.isStudent = true;

      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.roleDisplayName).toBe('Student');
    });

    it('should return "User" for unknown roles', () => {
      mockPermissions.isAdmin = false;
      mockPermissions.isEducator = false;
      mockPermissions.isStudent = false;

      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.roleDisplayName).toBe('User');
    });
  });

  describe('Available Features', () => {
    it('should return features with availability based on permissions', () => {
      mockHasPermission.mockImplementation((permission) => {
        return permission === 'canAccessWeatherData';
      });

      const { result } = renderHook(() => useDashboard());
      
      const features = result.current.availableFeatures;
      expect(features).toHaveLength(2);
      expect(features[0].available).toBe(true); // weather
      expect(features[1].available).toBe(false); // sensors
    });

    it('should update availability when permissions change', () => {
      mockHasPermission.mockReturnValue(true);

      const { result, rerender } = renderHook(() => useDashboard());
      
      let features = result.current.availableFeatures;
      expect(features[0].available).toBe(true);
      expect(features[1].available).toBe(true);

      // Change permissions
      mockHasPermission.mockReturnValue(false);
      rerender();

      features = result.current.availableFeatures;
      expect(features[0].available).toBe(false);
      expect(features[1].available).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate to specified path', () => {
      const { result } = renderHook(() => useDashboard());
      
      act(() => {
        result.current.handleNavigate('/weather');
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/weather');
    });

    it('should set selected feature when provided', () => {
      const { result } = renderHook(() => useDashboard());
      
      act(() => {
        result.current.handleNavigate('/weather', 'weather');
      });
      
      expect(mockSetSelectedFeature).toHaveBeenCalledWith('weather');
      expect(mockNavigate).toHaveBeenCalledWith('/weather');
    });

    it('should not set selected feature when not provided', () => {
      const { result } = renderHook(() => useDashboard());
      
      act(() => {
        result.current.handleNavigate('/admin');
      });
      
      expect(mockSetSelectedFeature).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  describe('Feature Interaction', () => {
    it('should navigate when feature is available', () => {
      const { result } = renderHook(() => useDashboard());
      
      const mockFeature = {
        id: 'weather',
        title: 'Weather Data Analysis',
        iconComponent: vi.fn().mockImplementation(() => ({ muiName: 'CloudIcon' })) as any,
        description: 'Weather analysis',
        features: ['Feature 1'],
        path: '/weather',
        permission: 'canAccessWeatherData',
        color: '#2196f3',
        stats: 'Real-time',
        available: true,
      };
      
      act(() => {
        result.current.handleFeatureInteraction(mockFeature);
      });
      
      expect(mockSetSelectedFeature).toHaveBeenCalledWith('weather');
      expect(mockNavigate).toHaveBeenCalledWith('/weather');
    });

    it('should not navigate when feature is not available', () => {
      const { result } = renderHook(() => useDashboard());
      
      const mockFeature = {
        id: 'sensors',
        title: 'Sensor Data Management',
        iconComponent: vi.fn().mockImplementation(() => ({ muiName: 'SensorsIcon' })) as any,
        description: 'Sensor management',
        features: ['Feature A'],
        path: '/sensors',
        permission: 'canViewSensorData',
        color: '#4caf50',
        stats: 'Multi-parameter',
        available: false,
      };
      
      act(() => {
        result.current.handleFeatureInteraction(mockFeature);
      });
      
      expect(mockSetSelectedFeature).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should provide setLoading function', () => {
      const { result } = renderHook(() => useDashboard());
      
      act(() => {
        result.current.setLoading(true);
      });
      
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });
}); 