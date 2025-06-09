import { Box, Typography, Divider } from '@mui/material';
import WeatherChart from './WeatherChart';
import type { VisualizationSection as VisualizationSectionType } from '../../types/chart';

interface VisualizationSectionProps {
  section: VisualizationSectionType;
}

const VisualizationSection = ({ section }: VisualizationSectionProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: 'primary.main',
          mb: 3
        }}
      >
        {section.title}
      </Typography>
      
      <Divider sx={{ mb: 3, opacity: 0.6 }} />
      
      <Box>
        {section.charts.map((chart, index) => (
          <WeatherChart key={`${section.id}-chart-${index}`} config={chart} />
        ))}
      </Box>
    </Box>
  );
};

export default VisualizationSection; 