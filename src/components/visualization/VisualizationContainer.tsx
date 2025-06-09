import { Box, Typography, Paper, Alert } from '@mui/material';
import { BarChart as BarChartIcon } from '@mui/icons-material';
import VisualizationSection from './VisualizationSection';
import type { VisualizationSection as VisualizationSectionType } from '../../types/chart';

interface VisualizationContainerProps {
  sections: VisualizationSectionType[];
  hasData: boolean;
}

const VisualizationContainer = ({ sections, hasData }: VisualizationContainerProps) => {
  if (!hasData || sections.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <BarChartIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Data to Visualize
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {!hasData 
            ? 'Fetch weather data to see beautiful visualizations here'
            : 'Select some variables and fetch data to generate charts'
          }
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Data Visualizations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive charts showing weather patterns and trends
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Tip:</strong> Hover over data points for detailed information. 
        Click legend items to show/hide data series.
        <br />
        <strong>Note:</strong> Historical weather data typically has a 24-48 hour delay. 
        Missing values are excluded from charts to maintain data integrity.
      </Alert>

      {sections.map((section) => (
        <VisualizationSection key={section.id} section={section} />
      ))}
    </Box>
  );
};

export default VisualizationContainer; 