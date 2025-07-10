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
} from '@mui/material';
import { useSensorStore } from '../../store/useSensorStore';
import TableHeader from './table/TableHeader';
import TableDataRow from './table/TableDataRow';
import MobileDataCard from './table/MobileDataCard';
import { TABLE_COLUMNS, ROWS_PER_PAGE_OPTIONS } from './table/TableUtils';
import type { SensorDataPoint } from '../../types/sensor';

const SensorDataTable: React.FC = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Zustand store selectors
  const data = useSensorStore(state => state.data);
  const loading = useSensorStore(state => state.loading);
  const table = useSensorStore(state => state.table);
  const getPaginatedData = useSensorStore(state => state.getPaginatedData);
  
  // Zustand store actions
  const setPage = useSensorStore(state => state.setPage);
  const setRowsPerPage = useSensorStore(state => state.setRowsPerPage);
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

  // Get paginated data
  const paginatedData = getPaginatedData();

  const handleSort = (field: keyof SensorDataPoint) => {
    const newDirection = 
      table.sortField === field && table.sortDirection === 'asc' ? 'desc' : 'asc';
    setSort(field, newDirection);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading sensor data...</Typography>
      </Box>
    );
  }

  if (!safeData.length) {
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
          Sensor Data ({safeData.length} records)
        </Typography>
        
        {paginatedData.map((row) => (
          <MobileDataCard key={row.id} row={row} />
        ))}
        
        <TablePagination
          component="div"
          count={safeData.length}
          page={table.page}
          onPageChange={handleChangePage}
          rowsPerPage={table.rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </Box>
    );
  }

  // Desktop Table View
  return (
    <Paper sx={{ width: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          Sensor Data ({safeData.length} records)
        </Typography>
      </Box>
      
      <TableContainer>
        <Table stickyHeader>
          <TableHeader
            columns={TABLE_COLUMNS}
            sortField={table.sortField}
            sortDirection={table.sortDirection}
            onSort={handleSort}
          />
          
          <TableBody>
            {paginatedData.map((row, index) => {
              const previousRow = index > 0 ? paginatedData[index - 1] : undefined;
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
        count={safeData.length}
        page={table.page}
        onPageChange={handleChangePage}
        rowsPerPage={table.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      />
    </Paper>
  );
});

SensorDataTable.displayName = 'SensorDataTable';

export default SensorDataTable; 