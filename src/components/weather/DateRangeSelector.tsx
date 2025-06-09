import { Stack, TextField } from '@mui/material';
import type { DateRange } from '../../types/weather';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

const DateRangeSelector = ({ dateRange, onDateRangeChange }: DateRangeSelectorProps) => {
  const handleStartDateChange = (date: string) => {
    onDateRangeChange({
      ...dateRange,
      startDate: date,
    });
  };

  const handleEndDateChange = (date: string) => {
    onDateRangeChange({
      ...dateRange,
      endDate: date,
    });
  };

  // Get yesterday's date as max (for historical data)
  const getMaxDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Start Date"
        type="date"
        value={dateRange.startDate}
        onChange={(e) => handleStartDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: getMaxDate(),
        }}
        fullWidth
      />
      <TextField
        label="End Date"
        type="date"
        value={dateRange.endDate}
        onChange={(e) => handleEndDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: dateRange.startDate,
          max: getMaxDate(),
        }}
        fullWidth
      />
    </Stack>
  );
};

export default DateRangeSelector; 