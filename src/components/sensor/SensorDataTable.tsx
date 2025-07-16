import React, { memo, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  LinearProgress,
  alpha,
} from '@mui/material';
import { useSensorStore } from '../../store/useSensorStore';
import TableHeader from './table/TableHeader';
import TableDataRow from './table/TableDataRow';
import MobileDataCard from './table/MobileDataCard';
import { TABLE_COLUMNS } from './table/TableUtils';
import type { SensorDataPoint } from '../../types/sensor';

const SensorDataTable: React.FC = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Zustand store selectors - updated for cursor pagination
  const data = useSensorStore(state => state.data);
  const loading = useSensorStore(state => state.loading);
  const pagination = useSensorStore(state => state.pagination);
  const table = useSensorStore(state => state.table);
  const getTotalRecordsEstimate = useSensorStore(state => state.getTotalRecordsEstimate);
  
  // Zustand store actions - updated for cursor pagination
  const setPageSize = useSensorStore(state => state.setPageSize);
  const goToPage = useSensorStore(state => state.goToPage);
  const toggleRowExpansion = useSensorStore(state => state.toggleRowExpansion);
  const setSort = useSensorStore(state => state.setSort);

  // Ensure data is properly formatted
  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => item && typeof item === 'object' && item.id).map(item => ({
      ...item,
      // Ensure numeric fields exist with default values for display
      humidity: item.humidity ?? null,
      co2: item.co2 ?? null,
      ph: item.ph ?? null,
      salinity: item.salinity ?? null,
      temperature: item.temperature ?? null,
      waterTemperature: item.waterTemperature ?? null,
      externalHumidity: item.externalHumidity ?? null,
    }));
  }, [data]);

  // Get total records estimate for pagination
  const totalRecordsEstimate = getTotalRecordsEstimate();

  const handleSort = (field: keyof SensorDataPoint) => {
    const newDirection = 
      table.sortField === field && table.sortDirection === 'asc' ? 'desc' : 'asc';
    setSort(field, newDirection);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    goToPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
  };

  // Custom pagination component with Firebase-aware features
  const renderPaginationInfo = () => {
    const startRecord = pagination.currentPage * pagination.pageSize + 1;
    const endRecord = startRecord + safeData.length - 1;
    const totalDisplay = pagination.hasMore ? `${totalRecordsEstimate}+` : totalRecordsEstimate;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startRecord}–{endRecord} of {totalDisplay} records
        </Typography>
        
        {pagination.hasMore && (
          <Typography 
            variant="body2" 
            sx={{ 
              px: 1, 
              py: 0.5, 
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
              border: `1px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            More available
          </Typography>
        )}
        
        {pagination.isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress sx={{ width: 60, height: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  if (loading && !pagination.isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography>Loading sensor data...</Typography>
      </Box>
    );
  }

  if (!safeData.length && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No sensor data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload some data to see it here.
        </Typography>
      </Box>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Sensor Data
        </Typography>
        
        {renderPaginationInfo()}
        
        {safeData.map((row) => (
          <MobileDataCard key={row.id} row={row} />
        ))}
        
        <TablePagination
          component="div"
          count={pagination.hasMore ? -1 : totalRecordsEstimate} // -1 for unknown total
          page={pagination.currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[25, 50, 100]}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}–${to} of ${count !== -1 ? count : 'many'}`
          }
          labelRowsPerPage="Records per page:"
          disabled={pagination.isLoading}
        />
      </Box>
    );
  }

  // Desktop Table View
  return (
    <Paper sx={{ width: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          Sensor Data
        </Typography>
      </Box>
      
      {renderPaginationInfo()}
      
      <TableContainer>
        <Table stickyHeader>
          <TableHeader
            columns={TABLE_COLUMNS}
            sortField={table.sortField}
            sortDirection={table.sortDirection}
            onSort={handleSort}
          />
          
          <TableBody>
            {safeData.map((row, index) => {
              const previousRow = index > 0 ? safeData[index - 1] : undefined;
              const isExpanded = table.expandedRows.has(row.id);
              
              return (
                <TableDataRow
                  key={row.id}
                  row={row}
                  previousRow={previousRow}
                  columns={TABLE_COLUMNS}
                  isExpanded={isExpanded}
                  onToggleExpansion={toggleRowExpansion}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={pagination.hasMore ? -1 : totalRecordsEstimate} // -1 for unknown total
        page={pagination.currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} of ${count !== -1 ? count : 'many'}`
        }
        labelRowsPerPage="Records per page:"
        disabled={pagination.isLoading}
        showFirstButton
        showLastButton={!pagination.hasMore}
      />
    </Paper>
  );
});

SensorDataTable.displayName = 'SensorDataTable';

export default SensorDataTable; 