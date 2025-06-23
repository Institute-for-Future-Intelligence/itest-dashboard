import React, { memo } from 'react';
import { Alert, Typography } from '@mui/material';
import type { WaterQualityValidationResult } from '../../../types/waterQuality';

interface FormValidationAlertsProps {
  validation: WaterQualityValidationResult | null;
  submitError: string | null;
  onClearMessages?: () => void;
}

const FormValidationAlerts: React.FC<FormValidationAlertsProps> = memo(({
  validation,
  submitError,
  onClearMessages,
}) => {
  if (!validation && !submitError) {
    return null;
  }

  return (
    <>
      {/* Validation Errors */}
      {validation && !validation.isValid && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Please fix the following errors:</Typography>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Validation Warnings */}
      {validation && validation.warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Warnings:</Typography>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Submit Errors */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={onClearMessages}>
          {submitError}
        </Alert>
      )}
    </>
  );
});

FormValidationAlerts.displayName = 'FormValidationAlerts';

export default FormValidationAlerts; 