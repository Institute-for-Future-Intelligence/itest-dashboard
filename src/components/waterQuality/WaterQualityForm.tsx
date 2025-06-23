import React, { memo } from 'react';
import { Box, Paper, Typography, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useWaterQualityForm } from '../../hooks/useWaterQualityForm';
import {
  FormDateTimeSection,
  FormLocationSection,
  FormParametersSection,
  FormNutrientsSection,
  FormOptionalSection,
  FormActions,
  FormValidationAlerts,
} from './form';

const WaterQualityForm: React.FC = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    formData,
    isSubmitting,
    validation,
    submitError,
    showDraftSaved,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearFormMessages,
  } = useWaterQualityForm();

  // Check if form is valid for submission
  const isFormValid = !!(formData.date && formData.time && formData.location);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add Water Quality Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Record water quality measurements from your monitoring location. 
          All measurement fields are optional - enter the data you have available.
        </Typography>
        {showDraftSaved && (
          <Chip 
            label="Draft auto-saved" 
            size="small" 
            color="success" 
            sx={{ mt: 1, opacity: 0.8 }}
          />
        )}
      </Box>

      {/* Form Validation Messages */}
      <FormValidationAlerts
        validation={validation}
        submitError={submitError}
        onClearMessages={clearFormMessages}
      />

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Form Sections */}
          <FormDateTimeSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <FormLocationSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <FormParametersSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <FormNutrientsSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <FormOptionalSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          {/* Action Buttons */}
          <FormActions
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            onReset={handleReset}
            isMobile={isMobile}
          />
        </Box>
      </Box>
    </Paper>
  );
});

WaterQualityForm.displayName = 'WaterQualityForm';

export default WaterQualityForm; 