import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Cached,
  CloudDownload,
  Speed,
  Info,
  Refresh,
  ViewList,
} from '@mui/icons-material';

interface CacheInfo {
  age: number;
  isExpired: boolean;
  recordCount: number;
  filters: any;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
}

interface SensorCacheStatusProps {
  cacheInfo: CacheInfo | null;
  paginationInfo: PaginationInfo;
  loading: boolean;
  recordCount: number;
  totalRecordsEstimate: number;
  onRefresh: () => void;
}

const SensorCacheStatus: React.FC<SensorCacheStatusProps> = ({
  cacheInfo,
  paginationInfo,
  loading,
  recordCount,
  totalRecordsEstimate,
  onRefresh,
}) => {
  const theme = useTheme();

  const getCacheStatusColor = () => {
    if (loading) return 'default';
    if (!cacheInfo) return 'warning';
    if (cacheInfo.isExpired) return 'error';
    if (cacheInfo.age < 1) return 'success';
    return 'primary';
  };

  const getCacheStatusStyles = () => {
    const status = getCacheStatusColor();
    switch (status) {
      case 'success':
        return {
          borderColor: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
        };
      case 'error':
        return {
          borderColor: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
        };
      case 'warning':
        return {
          borderColor: theme.palette.warning.main,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
        };
      case 'primary':
        return {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        };
      default:
        return {
          borderColor: theme.palette.text.secondary,
          backgroundColor: alpha(theme.palette.text.secondary, 0.1),
          color: theme.palette.text.secondary,
        };
    }
  };

  const getCacheStatusText = () => {
    if (loading) return 'Loading...';
    if (!cacheInfo) return 'No cache';
    if (cacheInfo.isExpired) return 'Cache expired';
    if (cacheInfo.age < 1) return 'Fresh data';
    return `Cached ${cacheInfo.age}m ago`;
  };

  const getPerformanceInfo = () => {
    if (!cacheInfo) return `Page ${paginationInfo.currentPage + 1} loaded from Firebase`;
    return `${cacheInfo.recordCount} records from cache • Page ${paginationInfo.currentPage + 1} • Saved Firebase reads`;
  };

  const getPaginationInfo = () => {
    const currentPage = paginationInfo.currentPage + 1;
    const hasMore = paginationInfo.hasMore;
    const isLoading = paginationInfo.isLoading;
    
    if (isLoading) return 'Loading page...';
    if (hasMore) return `Page ${currentPage} of many`;
    return `Page ${currentPage} of ${paginationInfo.totalPages}`;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        py: 1,
        px: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        flexWrap: 'wrap',
      }}
    >
      {/* Cache Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Cached 
          sx={{ 
            fontSize: 16, 
            color: getCacheStatusColor() === 'success' ? 'success.main' : 'text.secondary'
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            px: 1, 
            py: 0.5, 
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            border: `1px solid ${getCacheStatusStyles().borderColor}`,
            color: getCacheStatusStyles().color,
            backgroundColor: getCacheStatusStyles().backgroundColor,
          }}
        >
          {getCacheStatusText()}
        </Typography>
      </Box>

      {/* Pagination Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ViewList sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          {getPaginationInfo()}
        </Typography>
      </Box>

      {/* Performance Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          {getPerformanceInfo()}
        </Typography>
      </Box>

      {/* Record Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudDownload sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          {recordCount}/{totalRecordsEstimate}{paginationInfo.hasMore ? '+' : ''} records
        </Typography>
      </Box>

      {/* Refresh Button */}
      <Tooltip title="Refresh data from Firebase">
        <span>
          <IconButton 
            onClick={onRefresh} 
            disabled={loading || paginationInfo.isLoading}
            size="small"
            sx={{ ml: 'auto' }}
          >
            <Refresh sx={{ fontSize: 16 }} />
          </IconButton>
        </span>
      </Tooltip>

      {/* Info Tooltip */}
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Performance Optimizations:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              • Data cached for 5 minutes
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              • Cursor-based pagination: {paginationInfo.pageSize} records/page
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              • Smart defaults: Last 30 days, 1000 record limit
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              • Debounced filter queries (300ms)
            </Typography>
            <Typography variant="body2">
              • Page caching reduces Firebase queries
            </Typography>
          </Box>
        }
      >
        <Info sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
      </Tooltip>
    </Box>
  );
};

export default SensorCacheStatus; 