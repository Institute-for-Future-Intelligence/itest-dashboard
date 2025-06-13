import { useCallback } from 'react';
import { processExcelFile, validateExcelFile } from '../utils/excelProcessor';
import { sensorService } from '../firebase/sensorService';
import { useSensorStore } from '../store/useSensorStore';

interface UseSensorUploadProps {
  userUid: string;
  onUploadComplete?: (uploadId: string, recordCount: number) => void;
}

export const useSensorUpload = ({ userUid, onUploadComplete }: UseSensorUploadProps) => {
  // Zustand store selectors
  const upload = useSensorStore(state => state.upload);
  
  // Zustand store actions
  const setSelectedFile = useSensorStore(state => state.setSelectedFile);
  const setValidation = useSensorStore(state => state.setValidation);
  const setUploadStatus = useSensorStore(state => state.setUploadStatus);
  const setUploadProgress = useSensorStore(state => state.setUploadProgress);
  const setErrorMessage = useSensorStore(state => state.setErrorMessage);
  const setDragOver = useSensorStore(state => state.setDragOver);
  const setSelectedLocation = useSensorStore(state => state.setSelectedLocation);
  const resetUploadState = useSensorStore(state => state.resetUploadState);

  const validateFileInternal = useCallback(async (file: File) => {
    setUploadStatus('validating');
    setValidation(null);

    try {
      // Basic file validation
      const fileValidation = validateExcelFile(file);
      if (!fileValidation.isValid) {
        throw new Error(fileValidation.error || 'File validation failed');
      }

      // Process and validate Excel content
      const result = await processExcelFile(file);
      setValidation(result.validation);
      
      if (result.validation.isValid) {
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
        setErrorMessage('File validation failed. Please check the errors below.');
      }
    } catch (error) {
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate file';
      setErrorMessage(errorMessage);
    }
  }, [setUploadStatus, setValidation, setErrorMessage]);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setValidation(null);
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadProgress(0);
    
    // Automatically validate the file
    await validateFileInternal(file);
  }, [setSelectedFile, setValidation, setUploadStatus, setErrorMessage, setUploadProgress, validateFileInternal]);

  const handleClearFile = useCallback(() => {
    resetUploadState();
  }, [resetUploadState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [setDragOver, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, [setDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, [setDragOver]);

  const handleUpload = useCallback(async () => {
    if (!upload.selectedFile || !upload.validation?.isValid) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Process the file again to get the data
      const result = await processExcelFile(upload.selectedFile);
      
      // Simulate progress updates
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 10, 90);
        setUploadProgress(currentProgress);
      }, 200);

      // Upload to Firestore
      const uploadResult = await sensorService.uploadSensorData(
        result.data,
        upload.selectedFile.name,
        userUid,
        upload.selectedLocation
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Reset form after a delay
      setTimeout(() => {
        resetUploadState();
      }, 2000);

      onUploadComplete?.(uploadResult.uploadId, uploadResult.processedCount);

    } catch (error) {
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setErrorMessage(errorMessage);
    }
  }, [
    upload.selectedFile, 
    upload.validation, 
    upload.selectedLocation,
    userUid, 
    setUploadStatus, 
    setUploadProgress, 
    setErrorMessage, 
    resetUploadState, 
    onUploadComplete
  ]);

  return {
    // State
    upload,
    
    // Actions
    handleFileSelect,
    handleClearFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleUpload,
    setSelectedLocation,
  };
}; 