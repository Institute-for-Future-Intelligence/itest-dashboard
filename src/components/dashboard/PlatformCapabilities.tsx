import React, { memo } from 'react';
import {
  Paper,
  Typography,
  Box
} from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { PLATFORM_CAPABILITIES } from '../../utils/dashboardConfig';

const PlatformCapabilities: React.FC = memo(() => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Assessment sx={{ mr: 1 }} />
        Platform Capabilities
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3 
      }}>
        {PLATFORM_CAPABILITIES.map((capability) => {
          const IconComponent = capability.iconComponent;
          
          return (
            <Box key={capability.id} sx={{ textAlign: 'center', p: 2 }}>
              <IconComponent sx={{ fontSize: 48, color: capability.color, mb: 1 }} />
              <Typography variant="h6" color="primary">{capability.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {capability.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
});

PlatformCapabilities.displayName = 'PlatformCapabilities';

export default PlatformCapabilities; 