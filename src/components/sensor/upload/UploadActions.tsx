import React, { memo } from 'react';
import {
  Box,
  Button,
} from '@mui/material';
import {
  CloudUpload,
  Clear,
} from '@mui/icons-material';
import type { ExcelValidationResult } from '../../../types/sensor';

type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

interface UploadActionsProps {
  selectedFile: File | null;
  validation: ExcelValidationResult | null;
  uploadStatus: UploadStatus;
  isUploading: boolean;
  onClearFile: () => void;
  onUpload: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = memo(({
  selectedFile,
  validation,
  uploadStatus,
  isUploading,
  onClearFile,
  onUpload,
}) => {
  if (!selectedFile) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        onClick={onClearFile}
        disabled={uploadStatus === 'uploading'}
        color="secondary"
        startIcon={<Clear />}
      >
        Clear File
      </Button>
      
      <Button
        variant="contained"
        onClick={onUpload}
        disabled={!validation?.isValid || isUploading}
        startIcon={<CloudUpload />}
      >
        {isUploading ? 'Uploading...' : 'Upload Data'}
      </Button>
    </Box>
  );
});

UploadActions.displayName = 'UploadActions';

export default UploadActions; 