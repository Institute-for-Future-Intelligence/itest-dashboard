import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';
import { usePermissions } from './usePermissions';
import { FEATURE_CARDS } from '../utils/dashboardConfig';
import type { FeatureCardConfig } from '../utils/dashboardConfig';
import type { RolePermissions } from '../types';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { hasPermission, isAdmin, isEducator, isStudent } = usePermissions();
  
  // Dashboard store
  const { selectedFeature, isLoading, setSelectedFeature, setLoading } = useDashboardStore();

  // Navigation handler
  const handleNavigate = useCallback((path: string, featureId?: string) => {
    if (featureId) {
      setSelectedFeature(featureId);
    }
    navigate(path);
  }, [navigate, setSelectedFeature]);

  // Get role display name
  const getRoleDisplayName = useCallback(() => {
    if (isAdmin) return 'Administrator';
    if (isEducator) return 'Educator';
    if (isStudent) return 'Student';
    return 'User';
  }, [isAdmin, isEducator, isStudent]);

  // Get available feature cards based on permissions
  const getAvailableFeatures = useCallback((): (FeatureCardConfig & { available: boolean })[] => {
    return FEATURE_CARDS.map(feature => ({
      ...feature,
      available: hasPermission(feature.permission as keyof RolePermissions)
    }));
  }, [hasPermission]);

  // Feature interaction handler
  const handleFeatureInteraction = useCallback((feature: FeatureCardConfig & { available: boolean }) => {
    if (feature.available) {
      handleNavigate(feature.path, feature.id);
    }
  }, [handleNavigate]);

  return {
    // State
    selectedFeature,
    isLoading,
    
    // Computed values
    roleDisplayName: getRoleDisplayName(),
    availableFeatures: getAvailableFeatures(),
    
    // Actions
    handleNavigate,
    handleFeatureInteraction,
    setLoading,
    
    // Permission helpers
    isAdmin,
    hasPermission,
  };
}; 