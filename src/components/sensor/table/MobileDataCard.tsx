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
        if (value < 30 || value > 80) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'co2':
        if (value > 1000) return theme.palette.error.main;
        if (value > 800) return theme.palette.warning.main;
        return theme.palette.text.primary;
      case 'ph':
        if (value < 7 || value > 8.5) return theme.palette.warning.main;
        return theme.palette.text.primary;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {row.timestamp && row.timestamp.toLocaleDateString ? row.timestamp.toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.timestamp && row.timestamp.toLocaleTimeString ? row.timestamp.toLocaleTimeString() : 'N/A'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Humidity</Typography>
            <Typography variant="body1" sx={{ color: row.humidity != null ? getValueColor('humidity', row.humidity) : 'inherit' }}>
              {row.humidity != null && !isNaN(row.humidity) ? `${row.humidity.toFixed(1)}%` : '-'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">CO₂</Typography>
            <Typography variant="body1" sx={{ color: row.co2 != null ? getValueColor('co2', row.co2) : 'inherit' }}>
              {row.co2 != null && !isNaN(row.co2) ? `${row.co2.toFixed(0)} ppm` : '-'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">pH</Typography>
            <Typography variant="body1" sx={{ color: row.ph != null ? getValueColor('ph', row.ph) : 'inherit' }}>
              {row.ph != null && !isNaN(row.ph) ? row.ph.toFixed(3) : '-'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Salinity</Typography>
            <Typography variant="body1">
              {row.salinity != null && !isNaN(row.salinity) ? `${row.salinity.toFixed(4)} ppt` : '-'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

MobileDataCard.displayName = 'MobileDataCard';

export default MobileDataCard; 