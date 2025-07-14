import { Box, CircularProgress, Typography, useTheme, alpha, Backdrop } from '@mui/material';
import { WaterDropOutlined } from '@mui/icons-material';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

const LoadingOverlay = ({ show, message = 'Loading...' }: LoadingOverlayProps) => {
  const theme = useTheme();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(10px)',
      }}
      open={show}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 4,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          boxShadow: theme.shadows[6],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <WaterDropOutlined 
              sx={{ 
                fontSize: '1.5rem', 
                color: theme.palette.primary.main,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0.5,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }} 
            />
          </Box>
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          Nā Puna ʻIke - Springs of Knowledge
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay; 