import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useWaterQualityStore } from '../store/useWaterQualityStore';
import { useUserStore } from '../store/useUserStore';
import type { WaterQualityDataPoint } from '../types/waterQuality';

export const useWaterQualityTable = () => {
  const { user } = useUserStore();
  const hasLoadedRef = useRef<string | null>(null);
  
  const {
    loading,
    error,
    filters,
    table,
    data,
    loadData,
    setPage,
    setRowsPerPage,
    toggleRowExpansion,
    setSort,
    clearFilters,
  } = useWaterQualityStore();
  
  // Load data on mount and user change
  useEffect(() => {
    if (user?.uid && !loading && hasLoadedRef.current !== user.uid) {
      hasLoadedRef.current = user.uid;
      loadData();
    }
  }, [user?.uid, loading, loadData]); // Include all dependencies
  
  // Handle sorting
  const handleSort = useCallback((field: keyof WaterQualityDataPoint) => {
    const isAsc = table.sortField === field && table.sortDirection === 'asc';
    setSort(field, isAsc ? 'desc' : 'asc');
  }, [table.sortField, table.sortDirection, setSort]);
  
  // Compute filtered and sorted data
  const filteredData = useMemo(() => {
    if (!table.sortField) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[table.sortField!];
      const bVal = b[table.sortField!];
      
      // Handle undefined values
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return table.sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [data, table.sortField, table.sortDirection]);
  
  // Compute paginated data
  const paginatedData = useMemo(() => {
    const startIndex = table.page * table.rowsPerPage;
    const endIndex = startIndex + table.rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, table.page, table.rowsPerPage]);
  
  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange) count++;
    if (filters.location) count++;
    if (filters.temperatureRange) count++;
    if (filters.phRange) count++;
    if (filters.salinityRange) count++;
    if (filters.conductivityRange) count++;
    if (filters.nitrateRange) count++;
    if (filters.nitriteRange) count++;
    if (filters.ammoniaRange) count++;
    if (filters.phosphateRange) count++;
    if (filters.enteredBy) count++;
    return count;
  }, [filters]);
  
  // Handle export to CSV
  const handleExport = useCallback(() => {
    if (filteredData.length === 0) return;
    
    // CSV headers
    const headers = [
      'Date', 'Location', 'Temperature (°C)', 'pH', 'Salinity (ppt)', 'Conductivity (µS/cm)',
      'Nitrate (mg/L)', 'Nitrite (mg/L)', 'Ammonia (mg/L)', 'Phosphate (mg/L)', 'Notes'
    ];
    
    // Format data for CSV
    const csvData = filteredData.map((row: WaterQualityDataPoint) => [
      new Date(row.date).toLocaleDateString(),
      row.location,
      row.temperature?.toFixed(1) || '',
      row.ph?.toFixed(2) || '',
      row.salinity?.toFixed(1) || '',
      row.conductivity?.toFixed(0) || '',
      row.nitrate?.toFixed(2) || '',
      row.nitrite?.toFixed(2) || '',
      row.ammonia?.toFixed(2) || '',
      row.phosphate?.toFixed(2) || '',
      row.notes || ''
    ].map(field => {
      // Escape quotes and wrap in quotes if contains comma
      const str = String(field);
      return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
    }));
    
    // Create and download CSV
    const csvContent = [headers.join(','), ...csvData.map((row: string[]) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `water_quality_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredData]);
  
  // Handle pagination
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, [setPage]);
  
  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, [setRowsPerPage]);
  
  // Handle row expansion
  const handleRowToggle = useCallback((rowId: string) => {
    toggleRowExpansion(rowId);
  }, [toggleRowExpansion]);
  

  
  return {
    // State
    loading,
    error,
    filters,
    table,
    filteredData,
    paginatedData,
    activeFiltersCount,
    
    // Actions
    handleSort,
    handleExport,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowToggle,
    clearFilters,
  };
}; 