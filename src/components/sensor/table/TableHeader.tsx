import React, { memo } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@mui/material';
import type { SensorDataPoint, SensorDataColumn } from '../../../types/sensor';

interface TableHeaderProps {
  columns: SensorDataColumn[];
  sortField?: keyof SensorDataPoint;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: keyof SensorDataPoint) => void;
}

const TableHeader: React.FC<TableHeaderProps> = memo(({
  columns,
  sortField,
  sortDirection,
  onSort,
}) => {
  const handleSort = (field: keyof SensorDataPoint) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell 
            key={column.key}
            sx={{ width: column.width }}
            sortDirection={sortField === column.key ? sortDirection : false}
          >
            {column.sortable && onSort ? (
              <TableSortLabel
                active={sortField === column.key}
                direction={sortField === column.key ? sortDirection : 'asc'}
                onClick={() => handleSort(column.key)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
        <TableCell width="50px" />
      </TableRow>
    </TableHead>
  );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader; 