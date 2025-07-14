import { 
  Box, 
  Typography, 
  Stack, 
  Chip, 
  Paper,
  Container,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Analytics, 
  TrendingUp, 
  Assessment,
  WaterDropOutlined,
  DataUsage
} from '@mui/icons-material';
interface DashboardHeroProps {
  roleDisplayName: string;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ roleDisplayName }) => {
  const theme = useTheme();

  const features = [
    {
      icon: <Analytics sx={{ fontSize: '1.5rem' }} />,
      label: 'Real-time Analytics',
      color: theme.palette.primary.main,
    },
    {
      icon: <TrendingUp sx={{ fontSize: '1.5rem' }} />,
      label: 'Data Visualization',
      color: theme.palette.secondary.main,
    },
    {
      icon: <Assessment sx={{ fontSize: '1.5rem' }} />,
      label: 'Statistical Analysis',
      color: theme.palette.info.main,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Paper 
        elevation={0}
        sx={{ 
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 4, md: 6 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}>
            {/* Left side - Main content */}
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <WaterDropOutlined sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5,
                      }}
                    >
                      Nā Puna ʻIke
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                      }}
                    >
                      Data Science Platform
                    </Typography>
                  </Box>
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    fontWeight: 400,
                  }}
                >
                  Comprehensive environmental data analysis platform for Nā Puna ʻIke - the springs of knowledge. 
                  Query, visualize, and analyze weather, sensor, and water quality data with powerful tools and insights.
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
                  {features.map((feature, index) => (
                    <Chip
                      key={index}
                      icon={feature.icon}
                      label={feature.label}
                      sx={{
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        height: 40,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(feature.color, 0.2),
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>

            {/* Right side - Welcome card */}
            <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <DataUsage 
                      sx={{ 
                        fontSize: '3rem', 
                        color: theme.palette.primary.main,
                        opacity: 0.8,
                      }} 
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Welcome back!
                    </Typography>
                    <Chip 
                      label={roleDisplayName}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        lineHeight: 1.5,
                      }}
                    >
                      Access your environmental data dashboard and explore insights from multiple data sources.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardHero; 