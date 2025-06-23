import React, { memo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import WaterQualityDesktopTable from './WaterQualityDesktopTable';
import WaterQualityMobileView from './WaterQualityMobileView';
import type { WaterQualityDataPoint } from '../../../types/waterQuality';

interface WaterQualityTableContentProps {
  data: WaterQualityDataPoint[];
  sortField?: keyof WaterQualityDataPoint;
  sortDirection?: 'asc' | 'desc';
  expandedRows: Set<string>;
  activeFiltersCount: number;
  onSort: (field: keyof WaterQualityDataPoint) => void;
  onToggleRow: (rowId: string) => void;
}

const WaterQualityTableContent: React.FC<WaterQualityTableContentProps> = memo(({
  data,
  sortField,
  sortDirection,
  expandedRows,
  activeFiltersCount,
  onSort,
  onToggleRow,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No data found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activeFiltersCount > 0 
            ? 'Try adjusting your filters or clear them to see all data.'
            : 'Add some water quality measurements to see them here.'
          }
        </Typography>
      </Box>
    );
  }
  
  return (
    <>
      {isMobile ? (
        <WaterQualityMobileView
          data={data}
          expandedRows={expandedRows}
          onToggleRow={onToggleRow}
        />
      ) : (
        <WaterQualityDesktopTable
          data={data}
          sortField={sortField}
          sortDirection={sortDirection}
          expandedRows={expandedRows}
          onSort={onSort}
          onToggleRow={onToggleRow}
        />
      )}
    </>
  );
});

WaterQualityTableContent.displayName = 'WaterQualityTableContent';

export default WaterQualityTableContent; 