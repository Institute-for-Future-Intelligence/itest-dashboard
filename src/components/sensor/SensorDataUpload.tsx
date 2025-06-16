import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useSensorUpload } from '../../hooks/useSensorUpload';
import LocationSelector from './upload/LocationSelector';
import FileDropZone from './upload/FileDropZone';
import UploadActions from './upload/UploadActions';
import UploadProgress from './upload/UploadProgress';
import ValidationResults from './upload/ValidationResults';
import DuplicateDetectionDialog from './upload/DuplicateDetectionDialog';

interface SensorDataUploadProps {
  onUploadComplete?: (uploadId: string, recordCount: number) => void;
  userUid: string;
}

const SensorDataUpload: React.FC<SensorDataUploadProps> = memo(({
  onUploadComplete,
  userUid,
}) => {
  const {
    upload,
    handleFileSelect,
    handleClearFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleUpload,
    handleSkipDuplicates,
    handleOverwriteDuplicates,
    handleCancelDuplicateDialog,
    setSelectedLocation,
  } = useSensorUpload({ userUid, onUploadComplete });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Sensor Data
      </Typography>
      
      <LocationSelector
        selectedLocation={upload.selectedLocation}
        onLocationChange={setSelectedLocation}
        disabled={upload.uploadStatus === 'uploading'}
      />

      <FileDropZone
        selectedFile={upload.selectedFile}
        isDragOver={upload.isDragOver}
        onFileSelect={handleFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={upload.uploadStatus === 'uploading'}
      />

      <UploadActions
        selectedFile={upload.selectedFile}
        validation={upload.validation}
        uploadStatus={upload.uploadStatus}
        isUploading={upload.isUploading}
        onClearFile={handleClearFile}
        onUpload={handleUpload}
      />

      <UploadProgress
        uploadStatus={upload.uploadStatus}
        uploadProgress={upload.uploadProgress}
        errorMessage={upload.errorMessage}
        uploadResult={upload.uploadResult}
      />

      <ValidationResults validation={upload.validation} />

      <DuplicateDetectionDialog
        open={upload.showDuplicateDialog}
        duplicateInfo={upload.duplicateInfo}
        onClose={handleCancelDuplicateDialog}
        onSkipDuplicates={handleSkipDuplicates}
        onOverwriteDuplicates={handleOverwriteDuplicates}
        onCancel={handleCancelDuplicateDialog}
        loading={upload.uploadStatus === 'uploading'}
      />
    </Box>
  );
});

SensorDataUpload.displayName = 'SensorDataUpload';

export default SensorDataUpload; 