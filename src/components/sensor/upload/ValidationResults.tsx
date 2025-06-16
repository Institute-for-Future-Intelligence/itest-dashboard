import React, { memo } from 'react';
import {
  Box,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { ExcelValidationResult } from '../../../types/sensor';

interface ValidationResultsProps {
  validation: ExcelValidationResult | null;
}

const ValidationResults: React.FC<ValidationResultsProps> = memo(({ validation }) => {
  if (!validation) {
    return null;
  }

  const { isValid, errors, warnings, rowCount, validRowCount, duplicateInfo } = validation;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Overall Status */}
      <Alert 
        severity={isValid ? 'success' : 'error'} 
        icon={isValid ? <CheckCircle /> : <ErrorIcon />}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {isValid ? 'File validation successful' : 'File validation failed'}
        </Typography>
        <Typography variant="body2">
          {validRowCount} of {rowCount} rows are valid
        </Typography>
      </Alert>

      {/* Duplicate Detection Results */}
      {duplicateInfo && (
        <Box sx={{ mb: 2 }}>
          <Alert 
            severity={duplicateInfo.hasDuplicates ? 'warning' : 'info'}
            icon={duplicateInfo.hasDuplicates ? <Warning /> : <InfoIcon />}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              {duplicateInfo.hasDuplicates ? 'Duplicate Data Detected' : 'No Duplicates Found'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Chip
                size="small"
                label={`${duplicateInfo.newDataCount} New Records`}
                color="success"
                variant="outlined"
              />
              {duplicateInfo.hasDuplicates && (
                <Chip
                  size="small"
                  label={`${duplicateInfo.duplicateCount} Duplicates`}
                  color="warning"
                  variant="filled"
                />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Data range: {duplicateInfo.dateRange.start.toLocaleDateString()} - {duplicateInfo.dateRange.end.toLocaleDateString()}
            </Typography>

            {duplicateInfo.hasDuplicates && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                You'll be asked how to handle duplicates when you click Upload.
              </Typography>
            )}
          </Alert>
        </Box>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Errors ({errors.length})
            </Typography>
          </Alert>
          <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
            {errors.map((error, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={error}
                  primaryTypographyProps={{ variant: 'body2', color: 'error' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Warnings ({warnings.length})
            </Typography>
          </Alert>
          <List dense sx={{ maxHeight: 150, overflow: 'auto' }}>
            {warnings.map((warning, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={warning}
                  primaryTypographyProps={{ variant: 'body2', color: 'warning.main' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
});

ValidationResults.displayName = 'ValidationResults';

export default ValidationResults; 