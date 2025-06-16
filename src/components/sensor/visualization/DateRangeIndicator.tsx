import React, { memo } from 'react';
import {
  Box,
  Typography,
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
        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.5,
            border: 1,
            borderColor: 'secondary.main',
            borderRadius: 2,
            color: 'secondary.main',
            backgroundColor: 'transparent',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Last {dataCount} readings
        </Typography>
      </Box>

      {dateRange.spansDays && (
        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 2,
            color: 'info.contrastText',
            backgroundColor: 'info.main',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Multi-day data
        </Typography>
      )}
    </Box>
  );
});

DateRangeIndicator.displayName = 'DateRangeIndicator';

export default DateRangeIndicator; 