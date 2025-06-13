import { useEffect, useCallback } from 'react';
import { useSensorStore } from '../store/useSensorStore';
import type { SensorDataFilters, SensorDataPoint } from '../types/sensor';

/**
 * Custom hook for sensor data operations
 * Provides a clean API for components to interact with sensor data
 */
export const useSensorData = () => {
  const {
    data,
    loading,
    error,
    filters,
    table,
    setFilters,
    setSort,
    loadData,
    clearFilters,
    getFilteredData,
  } = useSensorStore();

  // Load data on mount and when filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoized handlers
  const handleFiltersChange = useCallback((newFilters: SensorDataFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleApplyFilters = useCallback(() => {
    loadData(filters);
  }, [loadData, filters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleSort = useCallback((field: keyof SensorDataPoint, direction: 'asc' | 'desc') => {
    setSort(field, direction);
  }, [setSort]);

  const handleRefresh = useCallback(() => {
    loadData(filters);
  }, [loadData, filters]);

  return {
    // State
    data,
    loading,
    error,
    filters,
    sortField: table.sortField,
    sortDirection: table.sortDirection,
    
    // Computed
    hasData: data.length > 0,
    hasError: !!error,
    currentLocation: filters.location || '',
    filteredData: getFilteredData(),
    
    // Actions
    handleFiltersChange,
    handleApplyFilters,
    handleClearFilters,
    handleSort,
    handleRefresh,
  };
}; 