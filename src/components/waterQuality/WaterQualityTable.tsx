import React, { memo, useState } from 'react';
import {
  Paper,
  Box,
  Collapse,
  TablePagination,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useWaterQualityTable } from '../../hooks/useWaterQualityTable';
import {
  WaterQualityTableHeader,
  WaterQualityTableFilters,
  WaterQualityTableContent,
} from './table';

const WaterQualityTable: React.FC = memo(() => {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    loading,
    error,
    filters,
    table,
    filteredData,
    paginatedData,
    activeFiltersCount,
    handleSort,
    handleExport,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowToggle,
    clearFilters,
  } = useWaterQualityTable();
  
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading water quality data...</Typography>
        </Box>
      </Paper>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {/* Header with actions and filter chips */}
      <WaterQualityTableHeader
        filteredDataLength={filteredData.length}
        activeFiltersCount={activeFiltersCount}
        filters={filters}
        onExport={handleExport}
        onClearFilters={clearFilters}
        onToggleFilters={setShowFilters}
        showFilters={showFilters}
      />
      
      {/* Filters Panel */}
      <Collapse in={showFilters}>
        <Box sx={{ px: 3, pb: 2 }}>
          <WaterQualityTableFilters />
        </Box>
      </Collapse>
      
      {/* Data Content (Desktop Table or Mobile Cards) */}
      <WaterQualityTableContent
        data={paginatedData}
        sortField={table.sortField}
        sortDirection={table.sortDirection}
        expandedRows={table.expandedRows}
        activeFiltersCount={activeFiltersCount}
        onSort={handleSort}
        onToggleRow={handleRowToggle}
      />
      
      {/* Pagination */}
      {filteredData.length > 0 && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={table.page}
          onPageChange={handlePageChange}
          rowsPerPage={table.rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </Paper>
  );
});

WaterQualityTable.displayName = 'WaterQualityTable';

export default WaterQualityTable; 