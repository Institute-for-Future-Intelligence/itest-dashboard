import React, { memo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SENSOR_LOCATIONS } from '../../../utils/locationConfig';

interface LocationFilterProps {
  location?: string;
  onLocationChange: (location: string | undefined) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = memo(({
  location,
  onLocationChange,
}) => {
  const handleLocationChange = (value: string) => {
    onLocationChange(value || undefined);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Site Location
      </Typography>
      <FormControl size="small" fullWidth>
        <InputLabel>Location</InputLabel>
        <Select
          value={location || ''}
          label="Location"
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <MenuItem value="">
            <em>All Locations</em>
          </MenuItem>
          {SENSOR_LOCATIONS.map((loc) => (
            <MenuItem key={loc.id} value={loc.id}>
              <Box>
                <Typography variant="body2">
                  {loc.name}
                </Typography>
                {loc.description && (
                  <Typography variant="caption" color="text.secondary">
                    {loc.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

LocationFilter.displayName = 'LocationFilter';

export default LocationFilter; 