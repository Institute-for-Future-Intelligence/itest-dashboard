import React, { memo } from 'react';
import { Box, Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';

interface FormActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onReset: () => void;
  isMobile?: boolean;
}

const FormActions: React.FC<FormActionsProps> = memo(({
  isSubmitting,
  isFormValid,
  onReset,
  isMobile = false,
}) => {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'));
  const shouldUseFullWidth = isMobile || isMobileDevice;

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      justifyContent: shouldUseFullWidth ? 'center' : 'flex-end',
      flexDirection: shouldUseFullWidth ? 'column' : 'row',
      mt: 3 
    }}>
      <Button
        variant="outlined"
        onClick={onReset}
        startIcon={<Refresh />}
        disabled={isSubmitting}
        fullWidth={shouldUseFullWidth}
      >
        Reset Form
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
        disabled={isSubmitting || !isFormValid}
        fullWidth={shouldUseFullWidth}
        sx={{ minWidth: 140 }}
      >
        {isSubmitting ? 'Saving...' : 'Save Data'}
      </Button>
    </Box>
  );
});

FormActions.displayName = 'FormActions';

export default FormActions; 