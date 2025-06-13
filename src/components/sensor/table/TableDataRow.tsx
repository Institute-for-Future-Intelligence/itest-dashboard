import React, { memo } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import type { SensorDataPoint, SensorDataColumn } from '../../../types/sensor';

interface TableDataRowProps {
  row: SensorDataPoint;
  previousRow?: SensorDataPoint;
  columns: SensorDataColumn[];
  isExpanded: boolean;
  onToggleExpansion: (rowId: string) => void;
}

const TableDataRow: React.FC<TableDataRowProps> = memo(({
  row,
  previousRow,
  columns,
  isExpanded,
  onToggleExpansion,
}) => {
  const theme = useTheme();

  const getValueTrend = (current: number, previous: number): 'up' | 'down' | 'same' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" fontSize="small" />;
      case 'down': return <TrendingDown color="error" fontSize="small" />;
      default: return <Remove color="disabled" fontSize="small" />;
    }
  };

  const getValueColor = (field: keyof SensorDataPoint, value: number): string => {
    if (value == null || isNaN(value)) {
      return theme.palette.text.secondary;
    }
    
    switch (field) {
      case 'humidity':
        if (value < 30 || value > 80) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'co2':
        if (value > 1000) return theme.palette.error.main;
        if (value > 800) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'ph':
        if (value < 7 || value > 8.5) return theme.palette.warning.main;
        return theme.palette.text.primary;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <>
      <TableRow 
        hover
        sx={{ cursor: 'pointer' }}
        onClick={() => onToggleExpansion(row.id)}
      >
        {columns.map((column) => {
          const value = row[column.key];
          const formattedValue = column.format ? column.format(value) : String(value);
          const color = typeof value === 'number' ? getValueColor(column.key, value) : undefined;
          
          return (
            <TableCell 
              key={column.key}
              sx={{ color }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {formattedValue}
                {previousRow && 
                 typeof value === 'number' && 
                 !isNaN(value) && 
                 typeof previousRow[column.key] === 'number' && 
                 !isNaN(previousRow[column.key] as number) && (
                  getTrendIcon(getValueTrend(value, previousRow[column.key] as number))
                )}
              </Box>
            </TableCell>
          );
        })}
        
        <TableCell>
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell colSpan={columns.length + 1} sx={{ py: 0 }}>
          <Collapse in={isExpanded}>
            <Box sx={{ py: 2, px: 1, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Additional Information
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Record ID
                  </Typography>
                  <Typography variant="body2">
                    {row.id}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date (ISO)
                  </Typography>
                  <Typography variant="body2">
                    {row.date}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded At
                  </Typography>
                  <Typography variant="body2">
                    {row.uploadedAt?.toDate?.()?.toLocaleString() || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

TableDataRow.displayName = 'TableDataRow';

export default TableDataRow; 