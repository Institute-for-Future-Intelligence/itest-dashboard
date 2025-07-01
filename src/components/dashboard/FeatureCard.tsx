import React, { memo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import type { FeatureCardConfig } from '../../utils/dashboardConfig';

interface FeatureCardProps {
  feature: FeatureCardConfig & { available: boolean };
  onInteraction: (feature: FeatureCardConfig & { available: boolean }) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({ feature, onInteraction }) => {
  const theme = useTheme();
  const IconComponent = feature.iconComponent;

  const handleClick = () => {
    onInteraction(feature);
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        opacity: feature.available ? 1 : 0.6,
        '&:hover': feature.available ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
        border: feature.available ? `1px solid ${alpha(feature.color, 0.2)}` : undefined
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconComponent sx={{ fontSize: 40, color: feature.color }} />
          <Typography variant="h6" component="h3" sx={{ ml: 2, fontWeight: 'bold' }}>
            {feature.title}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {feature.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Key Features:
          </Typography>
          <Stack spacing={0.5}>
            {feature.features.map((feat, idx) => (
              <Typography 
                key={idx} 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                • {feat}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Chip 
          label={feature.stats}
          size="small"
          sx={{ 
            backgroundColor: alpha(feature.color, 0.1),
            color: feature.color,
            fontWeight: 'bold'
          }}
        />
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant={feature.available ? "contained" : "outlined"}
          fullWidth
          endIcon={<ArrowForward />}
          onClick={handleClick}
          disabled={!feature.available}
          sx={{
            backgroundColor: feature.available ? feature.color : undefined,
            '&:hover': {
              backgroundColor: feature.available ? alpha(feature.color, 0.8) : undefined,
            }
          }}
        >
          {feature.available ? 'Explore Data' : 'Access Restricted'}
        </Button>
      </CardActions>
    </Card>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard; 