import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { SensorDataFilters } from '../../../types/sensor';

interface DateRangeFilterProps {
  dateRange?: SensorDataFilters['dateRange'];
  onDateRangeChange: (dateRange: SensorDataFilters['dateRange']) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = memo(({
  dateRange,
  onDateRangeChange,
}) => {
  const handleStartDateChange = (date: Date | null) => {
    onDateRangeChange({
      start: date || new Date(),
      end: dateRange?.end || new Date(),
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    onDateRangeChange({
      start: dateRange?.start || new Date(),
      end: date || new Date(),
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Date Range
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DatePicker
          label="Start Date"
          value={dateRange?.start || null}
          onChange={handleStartDateChange}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
        />
        <DatePicker
          label="End Date"
          value={dateRange?.end || null}
          onChange={handleEndDateChange}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
        />
      </Box>
    </Box>
  );
});

DateRangeFilter.displayName = 'DateRangeFilter';

export default DateRangeFilter; 