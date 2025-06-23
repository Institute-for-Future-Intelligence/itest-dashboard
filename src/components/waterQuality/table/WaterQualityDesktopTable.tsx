import React, { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { WATER_QUALITY_LOCATIONS } from '../../../utils/locationConfig';
import type { WaterQualityDataPoint, WaterQualityColumn } from '../../../types/waterQuality';

interface WaterQualityDesktopTableProps {
  data: WaterQualityDataPoint[];
  sortField?: keyof WaterQualityDataPoint;
  sortDirection?: 'asc' | 'desc';
  expandedRows: Set<string>;
  onSort: (field: keyof WaterQualityDataPoint) => void;
  onToggleRow: (rowId: string) => void;
}

// Format functions for different data types
const formatValue = (value: any, type: string): string => {
  if (value === null || value === undefined || value === '') return '—';
  
  switch (type) {
    case 'temperature':
      return `${Number(value).toFixed(1)}°C`;
    case 'ph':
      return Number(value).toFixed(2);
    case 'salinity':
      return `${Number(value).toFixed(1)} ppt`;
    case 'conductivity':
      return `${Number(value).toFixed(0)} µS/cm`;
    case 'nutrient':
      return `${Number(value).toFixed(2)} mg/L`;
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'location':
      const location = WATER_QUALITY_LOCATIONS.find(loc => loc.id === value);
      return location ? location.name : value;
    default:
      return String(value);
  }
};

// Table column definitions
const TABLE_COLUMNS: WaterQualityColumn[] = [
  { key: 'date', label: 'Date', sortable: true, format: (value) => formatValue(value, 'date'), width: '120px' },
  { key: 'location', label: 'Location', sortable: true, format: (value) => formatValue(value, 'location'), width: '150px' },
  { key: 'temperature', label: 'Temp', sortable: true, format: (value) => formatValue(value, 'temperature'), width: '100px' },
  { key: 'ph', label: 'pH', sortable: true, format: (value) => formatValue(value, 'ph'), width: '80px' },
  { key: 'salinity', label: 'Salinity', sortable: true, format: (value) => formatValue(value, 'salinity'), width: '100px' },
  { key: 'conductivity', label: 'Conductivity', sortable: true, format: (value) => formatValue(value, 'conductivity'), width: '120px' },
  { key: 'nitrate', label: 'NO₃⁻', sortable: true, format: (value) => formatValue(value, 'nutrient'), width: '100px' },
  { key: 'nitrite', label: 'NO₂⁻', sortable: true, format: (value) => formatValue(value, 'nutrient'), width: '100px' },
  { key: 'ammonia', label: 'NH₃', sortable: true, format: (value) => formatValue(value, 'nutrient'), width: '100px' },
  { key: 'phosphate', label: 'PO₄³⁻', sortable: true, format: (value) => formatValue(value, 'nutrient'), width: '100px' },
];

const WaterQualityDesktopTable: React.FC<WaterQualityDesktopTableProps> = memo(({
  data,
  sortField,
  sortDirection,
  expandedRows,
  onSort,
  onToggleRow,
}) => {
  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {TABLE_COLUMNS.map((column) => (
              <TableCell 
                key={column.key} 
                sx={{ width: column.width, fontWeight: 'bold' }}
                sortDirection={sortField === column.key ? sortDirection : false}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={sortField === column.key}
                    direction={sortField === column.key ? sortDirection : 'asc'}
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            <TableCell sx={{ width: '60px' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} hover>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column.key}>
                  {column.format ? column.format(row[column.key]) : String(row[column.key] || '—')}
                </TableCell>
              ))}
              <TableCell>
                {row.notes && (
                  <Tooltip title={row.notes} arrow>
                    <IconButton size="small" onClick={() => onToggleRow(row.id)}>
                      {expandedRows.has(row.id) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

WaterQualityDesktopTable.displayName = 'WaterQualityDesktopTable';

export default WaterQualityDesktopTable; 