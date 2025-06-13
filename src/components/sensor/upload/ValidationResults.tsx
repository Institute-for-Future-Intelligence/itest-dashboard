import React, { memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import type { ExcelValidationResult } from '../../../types/sensor';

interface ValidationResultsProps {
  validation: ExcelValidationResult | null;
}

const ValidationResults: React.FC<ValidationResultsProps> = memo(({ validation }) => {
  if (!validation) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Validation Results
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          Total Rows: {validation.rowCount} | Valid Rows: {validation.validRowCount}
        </Typography>
      </Box>

      {validation.errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Errors ({validation.errors.length})
          </Typography>
          <List dense>
            {validation.errors.slice(0, 5).map((error, index) => (
              <ListItem key={index} dense>
                <ListItemText primary={error} />
              </ListItem>
            ))}
            {validation.errors.length > 5 && (
              <ListItem>
                <ListItemText primary={`... and ${validation.errors.length - 5} more errors`} />
              </ListItem>
            )}
          </List>
        </Box>
      )}

      {validation.warnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="warning.main" gutterBottom>
            Warnings ({validation.warnings.length})
          </Typography>
          <List dense>
            {validation.warnings.slice(0, 5).map((warning, index) => (
              <ListItem key={index} dense>
                <ListItemText primary={warning} />
              </ListItem>
            ))}
            {validation.warnings.length > 5 && (
              <ListItem>
                <ListItemText primary={`... and ${validation.warnings.length - 5} more warnings`} />
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Paper>
  );
});

ValidationResults.displayName = 'ValidationResults';

export default ValidationResults; 