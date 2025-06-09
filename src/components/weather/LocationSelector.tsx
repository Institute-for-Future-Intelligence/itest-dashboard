import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { Location } from '../../types/weather';
import { HAWAII_LOCATIONS } from '../../utils/weatherConfig';

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationChange: (location: Location) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="location-select-label">Location</InputLabel>
      <Select
        labelId="location-select-label"
        value={selectedLocation?.id || ''}
        label="Location"
        onChange={(e) => {
          const location = HAWAII_LOCATIONS.find(loc => loc.id === e.target.value);
          if (location) {
            onLocationChange(location);
          }
        }}
      >
        {HAWAII_LOCATIONS.map((location) => (
          <MenuItem key={location.id} value={location.id}>
            {location.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationSelector; 