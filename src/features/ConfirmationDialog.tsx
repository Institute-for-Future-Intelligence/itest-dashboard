import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import type { ConfirmationState } from '../hooks/useConfirmation';

interface ConfirmationDialogProps {
  confirmationState: ConfirmationState;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  confirmationState,
  onConfirm,
  onCancel,
}) => {
  const { isOpen, options } = confirmationState;

  if (!options) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">
        {options.title}
      </DialogTitle>
      <DialogContent>
        <Typography id="confirmation-dialog-description" variant="body1">
          {options.message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onCancel} 
          color="primary"
          variant="outlined"
        >
          {options.cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color="primary" 
          variant={options.variant}
          autoFocus
        >
          {options.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 