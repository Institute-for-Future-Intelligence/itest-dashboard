import React, { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import type { StatisticsData } from './VisualizationUtils';

interface StatisticsCardsProps {
  statistics: StatisticsData;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = memo(({ statistics }) => {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: 2, 
      mb: 3 
    }}>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="body2">
            Humidity
          </Typography>
          <Typography variant="h6">
            {statistics.humidity.avg}%
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Range: {statistics.humidity.min}% - {statistics.humidity.max}%
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="body2">
            CO₂
          </Typography>
          <Typography variant="h6">
            {statistics.co2.avg} ppm
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Range: {statistics.co2.min} - {statistics.co2.max} ppm
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="body2">
            pH Level
          </Typography>
          <Typography variant="h6">
            {statistics.ph.avg}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Range: {statistics.ph.min} - {statistics.ph.max}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="body2">
            Salinity
          </Typography>
          <Typography variant="h6">
            {statistics.salinity.avg} ppt
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Range: {statistics.salinity.min} - {statistics.salinity.max} ppt
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
});

StatisticsCards.displayName = 'StatisticsCards';

export default StatisticsCards; 