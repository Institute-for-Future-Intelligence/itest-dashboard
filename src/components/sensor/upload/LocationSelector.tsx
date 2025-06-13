import React, { memo } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { SENSOR_LOCATIONS } from '../../../utils/locationConfig';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = memo(({
  selectedLocation,
  onLocationChange,
  disabled = false,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Site Location</InputLabel>
        <Select
          value={selectedLocation}
          label="Site Location"
          onChange={(e) => onLocationChange(e.target.value)}
          disabled={disabled}
        >
          {SENSOR_LOCATIONS.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
              {location.description && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({location.description})
                </Typography>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

LocationSelector.displayName = 'LocationSelector';

export default LocationSelector; 