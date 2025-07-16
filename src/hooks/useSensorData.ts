import { useEffect, useCallback } from 'react';
import { useSensorStore } from '../store/useSensorStore';
import type { SensorDataFilters, SensorDataPoint } from '../types/sensor';

/**
 * Custom hook for sensor data operations - OPTIMIZED FOR PERFORMANCE
 * Provides a clean API for components to interact with sensor data
 * Features caching, cursor-based pagination, and smart loading to reduce Firebase queries
 */
export const useSensorData = () => {
  const {
    data,
    loading,
    error,
    filters,
    cache,
    pagination,
    table,
    setFilters,
    setSort,
    loadData,
    loadPage,
    loadDataDebounced,
    clearFilters,
    clearCache,
    setPageSize,
    goToPage,
    resetPagination,
    getFilteredData,
    getCurrentPageData,
    getTotalRecordsEstimate,
  } = useSensorStore();

  // Smart data loading - only load if no valid cache exists
  useEffect(() => {
    const shouldLoadData = () => {
      // Always load if no cache exists
      if (!cache) return true;
      
      // Check if cache is expired (5 minutes)
      const CACHE_TTL = 5 * 60 * 1000;
      const cacheAge = Date.now() - cache.timestamp;
      if (cacheAge >= CACHE_TTL) return true;
      
      // Check if current filters match cached filters
      const currentFiltersHash = JSON.stringify(filters, Object.keys(filters).sort());
      if (currentFiltersHash !== cache.filtersHash) return true;
      
      return false;
    };

    if (shouldLoadData()) {
      loadData();
    }
  }, [loadData, cache, filters]);

  // Memoized handlers
  const handleFiltersChange = useCallback((newFilters: SensorDataFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleFiltersChangeDebounced = useCallback((newFilters: SensorDataFilters) => {
    loadDataDebounced(newFilters);
  }, [loadDataDebounced]);

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
    loadData(filters, true); // Force refresh
  }, [loadData, filters]);

  const handleClearCache = useCallback(() => {
    clearCache();
  }, [clearCache]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    goToPage(page);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageSize(pageSize);
  }, [setPageSize]);

  const handleLoadPage = useCallback((page: number) => {
    loadPage(page);
  }, [loadPage]);

  const handleResetPagination = useCallback(() => {
    resetPagination();
  }, [resetPagination]);

  // Performance indicators
  const getCacheInfo = useCallback(() => {
    if (!cache) return null;
    
    const cacheAge = Date.now() - cache.timestamp;
    const cacheAgeMinutes = Math.floor(cacheAge / (1000 * 60));
    
    return {
      age: cacheAgeMinutes,
      isExpired: cacheAge >= 5 * 60 * 1000,
      recordCount: cache.data.length,
      filters: cache.filters
    };
  }, [cache]);

  return {
    // State
    data,
    loading,
    error,
    filters,
    sortField: table.sortField,
    sortDirection: table.sortDirection,
    
    // Pagination state
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      hasMore: pagination.hasMore,
      isLoading: pagination.isLoading,
    },
    
    // Computed
    hasData: data.length > 0,
    hasError: !!error,
    currentLocation: filters.location || '',
    filteredData: getFilteredData(),
    currentPageData: getCurrentPageData(),
    totalRecordsEstimate: getTotalRecordsEstimate(),
    cacheInfo: getCacheInfo(),
    
    // Actions
    handleFiltersChange,
    handleFiltersChangeDebounced,
    handleApplyFilters,
    handleClearFilters,
    handleSort,
    handleRefresh,
    handleClearCache,
    
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    handleLoadPage,
    handleResetPagination,
  };
}; 