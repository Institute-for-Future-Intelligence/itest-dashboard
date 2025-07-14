import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { WaterDropOutlined } from '@mui/icons-material';

const AppBrand = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[3],
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <WaterDropOutlined sx={{ fontSize: '1.2rem' }} />
      </Avatar>
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: -0.5,
            transition: 'all 0.3s ease',
          }}
        >
          Nā Puna ʻIke
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            lineHeight: 1.2,
            display: { xs: 'none', sm: 'block' },
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          Springs of Knowledge
        </Typography>
      </Box>
    </Box>
  );
};

export default AppBrand; 