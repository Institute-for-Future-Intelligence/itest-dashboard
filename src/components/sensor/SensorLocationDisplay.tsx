import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  Link
} from '@mui/material';
import { 
  LocationOn, 
  OpenInNew, 
  Map 
} from '@mui/icons-material';
import { getLocationName, getLocationDetails } from '../../utils/locationConfig';

interface SensorLocationDisplayProps {
  currentLocation: string | null;
  isFiltered: boolean;
  hasData: boolean;
}

/**
 * Displays the current sensor location as a chip with context and additional details
 * Memoized for performance optimization
 */
const SensorLocationDisplay: React.FC<SensorLocationDisplayProps> = memo(({
  currentLocation,
  isFiltered,
  hasData,
}) => {
  if (!currentLocation) {
    return null;
  }

  const locationDetails = getLocationDetails(currentLocation);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Showing data from:
        </Typography>
        <Chip
          icon={<LocationOn />}
          label={getLocationName(currentLocation)}
          color="primary"
          variant="outlined"
          size="small"
        />
        {!isFiltered && hasData && (
          <Typography variant="caption" color="text.secondary">
            (all locations)
          </Typography>
        )}
      </Box>
      
      {locationDetails && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
          {locationDetails.description && (
            <Typography variant="caption" color="text.secondary">
              {locationDetails.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {locationDetails.website && (
              <Tooltip title="Visit site information">
                <IconButton
                  size="small"
                  component={Link}
                  href={locationDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ p: 0.5 }}
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {locationDetails.mapUrl && (
              <Tooltip title="View on map">
                <IconButton
                  size="small"
                  component={Link}
                  href={locationDetails.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ p: 0.5 }}
                >
                  <Map fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
});

SensorLocationDisplay.displayName = 'SensorLocationDisplay';

export default SensorLocationDisplay; 