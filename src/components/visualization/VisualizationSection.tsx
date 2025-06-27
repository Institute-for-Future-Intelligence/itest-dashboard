import { Box, Typography, Divider, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import WeatherChart from './WeatherChart';
import type { VisualizationSection as VisualizationSectionType } from '../../types/chart';

interface VisualizationSectionProps {
  section: VisualizationSectionType;
}

const VisualizationSection = ({ section }: VisualizationSectionProps) => {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TrendingUp color="primary" />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
            }}
          >
            {section.title}
          </Typography>
          <Chip 
            label={`${section.charts.length} chart${section.charts.length > 1 ? 's' : ''}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Divider sx={{ opacity: 0.6 }} />
      </Box>
      
      {/* Charts Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {section.charts.map((chart, index) => (
          <Box 
            key={`${section.id}-chart-${index}`}
            sx={{
              // Add subtle hover effect for better interactivity
              '&:hover': {
                '& .MuiPaper-root': {
                  boxShadow: (theme) => theme.shadows[4],
                  transition: 'box-shadow 0.2s ease-in-out',
                }
              }
            }}
          >
            <WeatherChart config={chart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default VisualizationSection; 