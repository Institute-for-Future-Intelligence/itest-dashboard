import React, { memo } from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Info,
} from '@mui/icons-material';

type UploadStatus = 'idle' | 'validating' | 'checking-duplicates' | 'uploading' | 'success' | 'error';

interface UploadResult {
  processedCount: number;
  skippedCount?: number;
  overwrittenCount?: number;
}

interface UploadProgressProps {
  uploadStatus: UploadStatus;
  uploadProgress: number;
  errorMessage: string;
  uploadResult?: UploadResult | null;
}

const UploadProgress: React.FC<UploadProgressProps> = memo(({
  uploadStatus,
  uploadProgress,
  errorMessage,
  uploadResult,
}) => {
  const getStatusColor = (status: UploadStatus): "success" | "error" | "info" | "default" => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'validating':
      case 'checking-duplicates':
      case 'uploading': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'error': return <ErrorIcon />;
      case 'validating':
      case 'checking-duplicates':
      case 'uploading': return <Info />;
      default: return undefined;
    }
  };

  const getStatusLabel = (status: UploadStatus): string => {
    switch (status) {
      case 'validating': return 'Validating';
      case 'checking-duplicates': return 'Checking Duplicates';
      case 'uploading': return 'Uploading';
      case 'success': return 'Upload Complete';
      case 'error': return 'Error';
      default: return '';
    }
  };

  if (uploadStatus === 'idle') {
    return null;
  }

  return (
    <Box>
      {/* Status Display */}
      <Box sx={{ mb: 2 }}>
        <Chip
          icon={getStatusIcon(uploadStatus)}
          label={getStatusLabel(uploadStatus)}
          color={getStatusColor(uploadStatus)}
          variant="outlined"
        />
      </Box>

      {/* Progress Bar */}
      {(uploadStatus === 'uploading' || uploadStatus === 'validating' || uploadStatus === 'checking-duplicates') && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant={uploadStatus === 'uploading' ? 'determinate' : 'indeterminate'}
            value={uploadProgress}
          />
          {uploadStatus === 'uploading' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {uploadProgress}% complete
            </Typography>
          )}
        </Box>
      )}

      {/* Success Results */}
      {uploadStatus === 'success' && uploadResult && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Upload completed successfully!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
              • {uploadResult.processedCount} records uploaded
            </Typography>
            {uploadResult.skippedCount !== undefined && uploadResult.skippedCount > 0 && (
              <Typography variant="body2" color="info.main">
                • {uploadResult.skippedCount} duplicate records skipped
              </Typography>
            )}
            {uploadResult.overwrittenCount !== undefined && uploadResult.overwrittenCount > 0 && (
              <Typography variant="body2" color="warning.main">
                • {uploadResult.overwrittenCount} existing records updated
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
});

UploadProgress.displayName = 'UploadProgress';

export default UploadProgress; 