import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
} from '@mui/material';
import { GitHub, Email, WaterDropOutlined } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'center' : 'flex-start'}
          spacing={isMobile ? 3 : 2}
        >
          {/* Brand Section */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WaterDropOutlined sx={{ fontSize: '1.2rem', color: 'white' }} />
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Nā Puna ʻIke
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.7rem',
                }}
              >
                Springs of Knowledge
              </Typography>
            </Box>
          </Stack>

          {/* Links Section */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={3}
            alignItems={isMobile ? 'center' : 'flex-start'}
          >
            {/* GitHub Repository */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <GitHub sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Link
                href="https://github.com/Institute-for-Future-Intelligence/itest-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                GitHub Repository
              </Link>
            </Stack>

            {/* Contact Information */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Contact: 
                <Link
                  href="mailto:andriy@intofuture.org"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    ml: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  andriy@intofuture.org
                </Link>
                {' | '}
                <Link
                  href="mailto:dylan@intofuture.org"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  dylan@intofuture.org
                </Link>
              </Typography>
            </Stack>
          </Stack>

          {/* Version/Status */}
          <Chip
            label="Beta"
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Stack>

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          © {new Date().getFullYear()} Institute for Future Intelligence.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 