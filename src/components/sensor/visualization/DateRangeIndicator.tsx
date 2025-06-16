import React, { memo } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import type { DateRange } from './VisualizationUtils';

interface DateRangeIndicatorProps {
  dateRange: DateRange;
  dataCount: number;
}

const DateRangeIndicator: React.FC<DateRangeIndicatorProps> = memo(({ 
  dateRange, 
  dataCount 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mb: 2,
      p: 2,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 1,
      border: `1px solid ${theme.palette.divider}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarIcon color="primary" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          Date Range:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {dateRange.formattedRange}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TimelineIcon color="secondary" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          Showing:
        </Typography>
        <Chip 
          label={`Last ${dataCount} readings`}
          size="small"
          color="secondary"
          variant="outlined"
        />
      </Box>

      {dateRange.spansDays && (
        <Chip 
          label="Multi-day data"
          size="small"
          color="info"
          variant="filled"
        />
      )}
    </Box>
  );
});

DateRangeIndicator.displayName = 'DateRangeIndicator';

export default DateRangeIndicator; 