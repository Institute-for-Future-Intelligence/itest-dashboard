import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { SensorDataPoint } from '../../../types/sensor';

interface MobileDataCardProps {
  row: SensorDataPoint;
}

const MobileDataCard: React.FC<MobileDataCardProps> = memo(({ row }) => {
  const theme = useTheme();

  const getValueColor = (field: keyof SensorDataPoint, value: number): string => {
    if (value == null || isNaN(value)) {
      return theme.palette.text.secondary;
    }
    
    switch (field) {
      case 'humidity':
      case 'externalHumidity':
        if (value < 30 || value > 80) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'co2':
        if (value > 1000) return theme.palette.error.main;
        if (value > 800) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'ph':
        if (value < 7 || value > 8.5) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'temperature':
        if (value < 0 || value > 40) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'waterTemperature':
        if (value < 10 || value > 35) return theme.palette.warning.main;
        return theme.palette.text.primary;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {row.timestamp && row.timestamp.toLocaleDateString ? row.timestamp.toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.timestamp && row.timestamp.toLocaleTimeString ? row.timestamp.toLocaleTimeString() : 'N/A'}
          </Typography>
        </Box>
        
        {/* Temperature readings */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Temperature
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 0.5 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Air Temp</Typography>
              <Typography variant="body1" sx={{ color: row.temperature != null ? getValueColor('temperature', row.temperature) : 'inherit' }}>
                {row.temperature != null && !isNaN(row.temperature) ? `${row.temperature.toFixed(1)}°C` : '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Water Temp</Typography>
              <Typography variant="body1" sx={{ color: row.waterTemperature != null ? getValueColor('waterTemperature', row.waterTemperature) : 'inherit' }}>
                {row.waterTemperature != null && !isNaN(row.waterTemperature) ? `${row.waterTemperature.toFixed(1)}°C` : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Humidity readings */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Humidity
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 0.5 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Humidity</Typography>
              <Typography variant="body1" sx={{ color: row.humidity != null ? getValueColor('humidity', row.humidity) : 'inherit' }}>
                {row.humidity != null && !isNaN(row.humidity) ? `${row.humidity.toFixed(1)}%` : '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Ext. Humidity</Typography>
              <Typography variant="body1" sx={{ color: row.externalHumidity != null ? getValueColor('externalHumidity', row.externalHumidity) : 'inherit' }}>
                {row.externalHumidity != null && !isNaN(row.externalHumidity) ? `${row.externalHumidity.toFixed(1)}%` : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Chemical readings */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Chemical Parameters
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, mt: 0.5 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">CO₂</Typography>
              <Typography variant="body1" sx={{ color: row.co2 != null ? getValueColor('co2', row.co2) : 'inherit' }}>
                {row.co2 != null && !isNaN(row.co2) ? `${row.co2.toFixed(0)} ppm` : '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">pH</Typography>
              <Typography variant="body1" sx={{ color: row.ph != null ? getValueColor('ph', row.ph) : 'inherit' }}>
                {row.ph != null && !isNaN(row.ph) ? row.ph.toFixed(2) : '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">Salinity</Typography>
              <Typography variant="body1">
                {row.salinity != null && !isNaN(row.salinity) ? `${row.salinity.toFixed(2)} ppt` : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

MobileDataCard.displayName = 'MobileDataCard';

export default MobileDataCard; 