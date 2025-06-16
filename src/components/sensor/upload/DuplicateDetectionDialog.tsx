import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { DuplicateDetectionResult } from '../../../firebase/sensorService';

interface DuplicateDetectionDialogProps {
  open: boolean;
  duplicateInfo: DuplicateDetectionResult | null;
  onClose: () => void;
  onSkipDuplicates: () => void;
  onOverwriteDuplicates: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DuplicateDetectionDialog: React.FC<DuplicateDetectionDialogProps> = memo(({
  open,
  duplicateInfo,
  onClose,
  onSkipDuplicates,
  onOverwriteDuplicates,
  onCancel,
  loading = false,
}) => {
  if (!duplicateInfo) return null;

  const { duplicateCount, newDataCount, duplicateEntries, dateRange } = duplicateInfo;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6">
            Duplicate Data Detected
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Some data in your upload file already exists in the database. Please choose how to proceed.
          </Typography>
        </Alert>

        {/* Summary Statistics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upload Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<InfoIcon />}
              label={`${duplicateCount + newDataCount} Total Records`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<WarningIcon />}
              label={`${duplicateCount} Duplicates Found`}
              color="warning"
              variant="filled"
            />
            <Chip
              icon={<InfoIcon />}
              label={`${newDataCount} New Records`}
              color="success"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Date Range */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Data Date Range
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Duplicate Details */}
        {duplicateEntries.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Duplicate Entries (showing first 5)
            </Typography>
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {duplicateEntries.slice(0, 5).map((entry, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ScheduleIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Row ${entry.rowIndex + 1}`}
                    secondary={`${entry.timestamp.toLocaleString()}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {duplicateEntries.length > 5 && (
                <ListItem>
                  <ListItemText
                    primary={`... and ${duplicateEntries.length - 5} more duplicates`}
                    primaryTypographyProps={{ variant: 'caption', fontStyle: 'italic' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        {/* Options Explanation */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            How would you like to handle the duplicates?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Skip Duplicates
              </Typography>
              <Typography variant="caption">
                Only upload the {newDataCount} new records. Existing data will remain unchanged.
              </Typography>
            </Alert>
            <Alert severity="warning" sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Overwrite Duplicates
              </Typography>
              <Typography variant="caption">
                Update existing records with new values and upload {newDataCount} new records.
              </Typography>
            </Alert>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          color="inherit"
        >
          Cancel Upload
        </Button>
        <Button
          onClick={onSkipDuplicates}
          disabled={loading || newDataCount === 0}
          color="primary"
          variant="outlined"
        >
          Skip Duplicates ({newDataCount} new)
        </Button>
        <Button
          onClick={onOverwriteDuplicates}
          disabled={loading}
          color="warning"
          variant="contained"
        >
          Overwrite Duplicates ({duplicateCount} updated)
        </Button>
      </DialogActions>
    </Dialog>
  );
});

DuplicateDetectionDialog.displayName = 'DuplicateDetectionDialog';

export default DuplicateDetectionDialog; 