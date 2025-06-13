import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
  Paper,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Upload,
  ViewList,
  Refresh,
  BarChart,
} from '@mui/icons-material';
import { useUserStore } from '../store/useUserStore';
import { DEFAULT_PERMISSIONS } from '../types';
import { useSensorData } from '../hooks/useSensorData';

// Import sensor components
import SensorDataUpload from '../components/sensor/SensorDataUpload';
import SensorDataTable from '../components/sensor/SensorDataTable';
import SensorDataFiltersComponent from '../components/sensor/SensorDataFilters';
import SensorDataVisualization from '../components/sensor/SensorDataVisualization';
import SensorLocationDisplay from '../components/sensor/SensorLocationDisplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`sensor-tabpanel-${index}`}
    aria-labelledby={`sensor-tab-${index}`}
    {...other}
  >
    {value === index && children}
  </div>
);

const SensorPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useUserStore();
  
  // State management with custom hooks
  const {
    data: sensorData,
    loading,
    error,
    filters,
    hasData,
    currentLocation,
    handleRefresh,
  } = useSensorData();

  // Upload success state (managed locally for page-level messaging)
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  const handleUploadComplete = useCallback((_uploadId: string, recordCount: number) => {
    const successMessage = `Successfully uploaded ${recordCount} sensor data records!`;
    setUploadSuccess(successMessage);
    
    // Refresh data after upload
    handleRefresh();
    
    // Clear success message after delay
    setTimeout(() => setUploadSuccess(''), 5000);
  }, [handleRefresh]);

  const clearUploadSuccess = useCallback(() => {
    setUploadSuccess('');
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState(0);

  // Check permissions
  const userPermissions = user && user.role ? DEFAULT_PERMISSIONS[user.role] : null;
  const canUpload = userPermissions?.canUploadSensorData || false;
  const canView = userPermissions?.canViewSensorData || false;

  // Memoized handlers
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Combined error message (data error + upload success)
  const displayMessage = error || uploadSuccess;
  const messageType = error ? 'error' : uploadSuccess ? 'success' : null;

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Please log in to access sensor data.
        </Alert>
      </Container>
    );
  }

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          You don't have permission to view sensor data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sensor Data Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {canUpload 
            ? 'Upload and analyze environmental sensor data including humidity, CO₂, pH, and salinity measurements.'
            : 'View and analyze environmental sensor data including humidity, CO₂, pH, and salinity measurements.'
          }
        </Typography>
      </Box>

      {/* Error/Success Alert */}
      {displayMessage && (
        <Alert 
          severity={messageType || 'info'} 
          sx={{ mb: 2 }}
          onClose={messageType === 'success' ? clearUploadSuccess : undefined}
        >
          {displayMessage}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="sensor data tabs"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab
            icon={<ViewList />}
            label="View Data"
            id="sensor-tab-0"
            aria-controls="sensor-tabpanel-0"
          />
          <Tab
            icon={<BarChart />}
            label="Visualizations"
            id="sensor-tab-1"
            aria-controls="sensor-tabpanel-1"
          />
          {canUpload && (
            <Tab
              icon={<Upload />}
              label="Upload Data"
              id={canUpload ? "sensor-tab-2" : "sensor-tab-1"}
              aria-controls={canUpload ? "sensor-tabpanel-2" : "sensor-tabpanel-1"}
            />
          )}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {/* Data Viewing Tab */}
        <Box>
          {/* Filters */}
          <SensorDataFiltersComponent />

          {/* Location Display */}
          <SensorLocationDisplay
            currentLocation={currentLocation}
            isFiltered={!!filters.location}
            hasData={hasData}
          />

          {/* Data Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <SensorDataTable />
          )}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Data Visualization Tab */}
        <Box>
          <SensorDataVisualization
            data={sensorData}
            loading={loading}
          />
        </Box>
      </TabPanel>

      {canUpload && (
        <TabPanel value={activeTab} index={2}>
          {/* Data Upload Tab */}
          <Box>
            <Paper sx={{ p: 3 }}>
              <SensorDataUpload
                onUploadComplete={handleUploadComplete}
                userUid={user.uid}
              />
            </Paper>
          </Box>
        </TabPanel>
      )}

      {/* Floating Action Button for Refresh */}
      <Fab
        color="primary"
        aria-label="refresh data"
        onClick={handleRefresh}
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Refresh />
      </Fab>
    </Container>
  );
};

export default SensorPage;