import { Box, Typography, Stack, Card, CardContent } from '@mui/material';
import { usePermissions } from '../hooks/usePermissions';
import { AdminPanelSettings, School, Person } from '@mui/icons-material';

function HomePage() {
  const { user, isAdmin, isEducator, isStudent } = usePermissions();

  const getRoleIcon = () => {
    if (isAdmin) return <AdminPanelSettings color="primary" />;
    if (isEducator) return <School color="primary" />;
    if (isStudent) return <Person color="primary" />;
    return null;
  };

  const getWelcomeMessage = () => {
    if (isAdmin) return "You have full access to all dashboard features.";
    if (isEducator) return "You can manage water quality data, view analytics, and export data.";
    if (isStudent) return "You can enter water quality measurements and view dashboard data.";
    return "Welcome to the iTEST Dashboard!";
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          {getRoleIcon()}
          <Typography variant="h4" component="h1">
            Welcome, User!
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Role: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getWelcomeMessage()}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Always visible - Dashboard overview */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View your recent activity and system status.
            </Typography>
          </CardContent>
        </Card>

        {/* Water Quality - Available to all roles */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Water Quality Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter and manage water quality measurements.
            </Typography>
          </CardContent>
        </Card>

        {/* Admin-only features */}
        {isAdmin && (
          <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Admin Panel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users, system settings, and advanced configurations.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Educator and Admin features */}
        {(isEducator || isAdmin) && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View trends, generate reports, and analyze collected data.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Sensor data - All users can view, only educators/admins can upload */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sensor Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(isEducator || isAdmin) 
                ? 'View and upload environmental sensor data from monitoring sites.'
                : 'View environmental sensor data including humidity, CO₂, pH, and salinity measurements.'
              }
            </Typography>
          </CardContent>
        </Card>
      </Stack>


    </Box>
  );
}

export default HomePage;