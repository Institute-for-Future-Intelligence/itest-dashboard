import React, { memo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Assessment
} from '@mui/icons-material';

interface DashboardHeroProps {
  roleDisplayName: string;
}

const DashboardHero: React.FC<DashboardHeroProps> = memo(({ roleDisplayName }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        p: { xs: 3, md: 6 },
        mb: 4,
        borderRadius: 3,
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          mb: 2
        }}
      >
        📊 Data Science Dashboard
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}
      >
        Comprehensive environmental data analysis platform for Nā Puna ʻIke - the springs of knowledge. 
        Query, visualize, and analyze weather, sensor, and water quality data with powerful tools and insights.
      </Typography>

      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        flexWrap="wrap" 
        sx={{ mb: 2 }}
      >
        <Chip 
          icon={<Analytics />} 
          label="Real-time Analytics" 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          icon={<TrendingUp />} 
          label="Data Visualization" 
          color="secondary" 
          variant="outlined" 
        />
        <Chip 
          icon={<Assessment />} 
          label="Statistical Analysis" 
          color="info" 
          variant="outlined" 
        />
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          Welcome back! 
          <Chip 
            label={roleDisplayName} 
            size="small" 
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
          />
        </Typography>
      </Box>
    </Paper>
  );
});

DashboardHero.displayName = 'DashboardHero';

export default DashboardHero; 