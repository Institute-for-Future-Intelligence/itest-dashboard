import { Box, Typography, Avatar, useTheme } from '@mui/material';

const AppBrand = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          backgroundColor: theme.palette.secondary.main,
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        iT
      </Avatar>
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.2rem' },
            letterSpacing: '-0.5px',
            fontFamily: 'inherit',
          }}
        >
          iTEST
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.8,
            fontSize: '0.7rem',
            lineHeight: 1,
            display: { xs: 'none', sm: 'block' },
            fontFamily: 'inherit',
          }}
        >
          Data Science
        </Typography>
      </Box>
    </Box>
  );
};

export default AppBrand; 