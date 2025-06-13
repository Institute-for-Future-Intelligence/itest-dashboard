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

type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

interface UploadProgressProps {
  uploadStatus: UploadStatus;
  uploadProgress: number;
  errorMessage: string;
}

const UploadProgress: React.FC<UploadProgressProps> = memo(({
  uploadStatus,
  uploadProgress,
  errorMessage,
}) => {
  const getStatusColor = (status: UploadStatus): "success" | "error" | "info" | "default" => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'validating':
      case 'uploading': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'error': return <ErrorIcon />;
      case 'validating':
      case 'uploading': return <Info />;
      default: return undefined;
    }
  };

  const getStatusLabel = (status: UploadStatus): string => {
    switch (status) {
      case 'validating': return 'Validating';
      case 'uploading': return 'Uploading';
      case 'success': return 'Success';
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
      {(uploadStatus === 'uploading' || uploadStatus === 'validating') && (
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