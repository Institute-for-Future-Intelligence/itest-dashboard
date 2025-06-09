import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { GitHub, Email } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[900] 
          : theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'center' : 'flex-start'}
          spacing={isMobile ? 3 : 2}
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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Contact:
            </Typography>
            <Link
              href="mailto:andriy@intofuture.org"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              andriy@intofuture.org
            </Link>
            <Typography variant="body2" color="text.secondary">
              |
            </Typography>
            <Link
              href="mailto:dylan@intofuture.org"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              dylan@intofuture.org
            </Link>
          </Stack>

          {/* Copyright */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              textAlign: isMobile ? 'center' : 'right',
            }}
          >
            © 2025 Institute for Future Intelligence
          </Typography>
        </Stack>

        {/* Mobile Layout Divider */}
        {isMobile && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: 'center',
                opacity: 0.7,
              }}
            >
              Built with React, TypeScript & Material-UI
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Footer; 