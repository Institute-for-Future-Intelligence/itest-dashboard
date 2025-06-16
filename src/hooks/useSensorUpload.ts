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
  const setDuplicateInfo = useSensorStore(state => state.setDuplicateInfo);
  const setShowDuplicateDialog = useSensorStore(state => state.setShowDuplicateDialog);
  const setUploadResult = useSensorStore(state => state.setUploadResult);
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
      
      if (!result.validation.isValid) {
        setValidation(result.validation);
        setUploadStatus('error');
        setErrorMessage('File validation failed. Please check the errors below.');
        return;
      }

      // Check for duplicates during validation
      setUploadStatus('checking-duplicates');
      
      try {
        const duplicateInfo = await sensorService.checkForDuplicates(
          result.data,
          upload.selectedLocation
        );

        // Add duplicate info to validation result
        const enhancedValidation = {
          ...result.validation,
          duplicateInfo
        };

        setValidation(enhancedValidation);
        setDuplicateInfo(duplicateInfo);

        if (duplicateInfo.hasDuplicates) {
          // File is valid but has duplicates - user can still choose to upload
          setUploadStatus('idle');
        } else {
          // File is valid with no duplicates
          setUploadStatus('idle');
        }

      } catch (duplicateError) {
        // If duplicate checking fails, still allow upload but show warning
        console.warn('Duplicate checking failed:', duplicateError);
        const validationWithWarning = {
          ...result.validation,
          warnings: [
            ...result.validation.warnings,
            'Could not check for duplicates. Upload will proceed without duplicate detection.'
          ]
        };
        setValidation(validationWithWarning);
        setUploadStatus('idle');
      }

    } catch (error) {
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate file';
      setErrorMessage(errorMessage);
    }
  }, [setUploadStatus, setValidation, setErrorMessage, setDuplicateInfo, upload.selectedLocation]);

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

  const performUpload = useCallback(async (options: { skipDuplicates?: boolean; overwriteDuplicates?: boolean } = {}) => {
    if (!upload.selectedFile || !upload.validation?.isValid) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setShowDuplicateDialog(false);

    try {
      // Process the file again to get the data
      const result = await processExcelFile(upload.selectedFile);
      
      // Simulate progress updates
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 10, 90);
        setUploadProgress(currentProgress);
      }, 200);

      // Upload to Firestore with duplicate handling options
      const uploadResult = await sensorService.uploadSensorData(
        result.data,
        upload.selectedFile.name,
        userUid,
        upload.selectedLocation,
        options
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Store upload results for display
      setUploadResult({
        processedCount: uploadResult.processedCount,
        skippedCount: uploadResult.skippedCount,
        overwrittenCount: uploadResult.overwrittenCount,
      });
      
      // Reset form after a delay
      setTimeout(() => {
        resetUploadState();
      }, 3000); // Increased delay to show results

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
    setShowDuplicateDialog,
    setUploadResult,
    resetUploadState, 
    onUploadComplete
  ]);

  const handleUpload = useCallback(async () => {
    if (!upload.selectedFile || !upload.validation?.isValid) return;

    // If duplicates were found during validation, show dialog
    if (upload.duplicateInfo?.hasDuplicates) {
      setShowDuplicateDialog(true);
      return;
    }

    // No duplicates, proceed with direct upload
    await performUpload();
  }, [upload.selectedFile, upload.validation, upload.duplicateInfo, setShowDuplicateDialog]);

  const handleSkipDuplicates = useCallback(async () => {
    await performUpload({ skipDuplicates: true });
  }, [performUpload]);

  const handleOverwriteDuplicates = useCallback(async () => {
    await performUpload({ overwriteDuplicates: true });
  }, [performUpload]);

  const handleCancelDuplicateDialog = useCallback(() => {
    setShowDuplicateDialog(false);
    setDuplicateInfo(null);
    setUploadStatus('idle');
  }, [setShowDuplicateDialog, setDuplicateInfo, setUploadStatus]);

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
    handleSkipDuplicates,
    handleOverwriteDuplicates,
    handleCancelDuplicateDialog,
    setSelectedLocation,
  };
}; 