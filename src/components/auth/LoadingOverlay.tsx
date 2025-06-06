import { Box, LinearProgress, Fade } from '@mui/material';

interface LoadingOverlayProps {
  show: boolean;
}

const LoadingOverlay = ({ show }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <Fade in={true}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
        }}
      >
        <LinearProgress 
          sx={{ 
            height: 3,
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#DB4437',
            },
          }} 
        />
      </Box>
    </Fade>
  );
};

export default LoadingOverlay; 