import React, { memo, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface FileDropZoneProps {
  selectedFile: File | null;
  isDragOver: boolean;
  onFileSelect: (file: File) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  disabled?: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = memo(({
  selectedFile,
  isDragOver,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        border: isDragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
        backgroundColor: isDragOver ? '#f5f5f5' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        mb: 2,
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={handleClick}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {selectedFile ? selectedFile.name : 'Drop Excel file here or click to browse'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .xlsx, .xls (Max 10MB)
        </Typography>
      </Box>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </Paper>
  );
});

FileDropZone.displayName = 'FileDropZone';

export default FileDropZone; 