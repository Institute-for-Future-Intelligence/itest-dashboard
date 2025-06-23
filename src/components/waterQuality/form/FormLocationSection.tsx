import React, { memo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import { LocationOn, OpenInNew } from '@mui/icons-material';
import { WATER_QUALITY_LOCATIONS } from '../../../utils/locationConfig';
import type { WaterQualityFormData } from '../../../types/waterQuality';

interface FormLocationSectionProps {
  formData: WaterQualityFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const FormLocationSection: React.FC<FormLocationSectionProps> = memo(({
  formData,
  onInputChange,
}) => {
  const selectedLocation = WATER_QUALITY_LOCATIONS.find(loc => loc.id === formData.location);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LocationOn color="primary" />
        <Typography variant="h6">
          Monitoring Location
        </Typography>
      </Box>
      
      <FormControl fullWidth required>
        <InputLabel>Location</InputLabel>
        <Select
          value={formData.location}
          label="Location"
          onChange={(e) => onInputChange('location', e.target.value)}
        >
          {WATER_QUALITY_LOCATIONS.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <LocationOn fontSize="small" />
                <Typography>{location.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Location Info Card */}
      {selectedLocation && (
        <Card variant="outlined" sx={{ bgcolor: 'background.default', mt: 2 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {selectedLocation.name}
            </Typography>
            {selectedLocation.description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedLocation.description}
              </Typography>
            )}
            {selectedLocation.coordinates && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Coordinates: {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
                </Typography>
                {selectedLocation.mapUrl && (
                  <Link 
                    href={selectedLocation.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    View on Map <OpenInNew fontSize="inherit" />
                  </Link>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
});

FormLocationSection.displayName = 'FormLocationSection';

export default FormLocationSection; 