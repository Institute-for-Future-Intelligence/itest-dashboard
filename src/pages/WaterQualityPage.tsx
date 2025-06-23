import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  ViewList,
  BarChart,
} from '@mui/icons-material';
import { useUserStore } from '../store/useUserStore';
import { useWaterQualityStore } from '../store/useWaterQualityStore';
import { DEFAULT_PERMISSIONS } from '../types';

// Import water quality components
import { 
  WaterQualityForm, 
  WaterQualityTable, 
  WaterQualityVisualization 
} from '../components/waterQuality';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`water-quality-tabpanel-${index}`}
    aria-labelledby={`water-quality-tab-${index}`}
    {...other}
  >
    {value === index && children}
  </div>
);

const WaterQualityPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useUserStore();
  
  // Water quality store
  const {
    data,
    error,
    form,
    clearFormMessages,
  } = useWaterQualityStore();

  // UI state
  const [activeTab, setActiveTab] = useState(0);

  // Note: Data loading is now handled by individual components (table hook, etc.)
  // No need for page-level data loading

  // Check permissions - for now, all users can enter and view their own data
  const userPermissions = user && user.role ? DEFAULT_PERMISSIONS[user.role] : null;
  const canView = userPermissions?.canViewSensorData || false; // Reuse sensor permissions for now
  const canAdd = user !== null; // All logged-in users can add water quality data

  // Memoized handlers
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Clear form messages when switching tabs
    if (newValue !== 0) {
      clearFormMessages();
    }
  }, [clearFormMessages]);

  // Display messages
  const displayMessage = error || (form.submitSuccess ? 'Water quality data submitted successfully!' : null);
  const messageType = error ? 'error' : form.submitSuccess ? 'success' : null;

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Please log in to access water quality data.
        </Alert>
      </Container>
    );
  }

  if (!canView && !canAdd) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          You don't have permission to access water quality data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Water Quality Data Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Record and analyze water quality parameters including temperature, pH, salinity, conductivity, 
          and nutrient levels (nitrates, nitrites, ammonia, phosphates) from various monitoring sites.
        </Typography>
      </Box>

      {/* Error/Success Alert */}
      {displayMessage && (
        <Alert 
          severity={messageType || 'info'} 
          sx={{ mb: 2 }}
          onClose={messageType === 'success' ? clearFormMessages : undefined}
        >
          {displayMessage}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="water quality data tabs"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          {canAdd && (
            <Tab
              icon={<Add />}
              label="Add Data"
              id="water-quality-tab-0"
              aria-controls="water-quality-tabpanel-0"
            />
          )}
          <Tab
            icon={<ViewList />}
            label="View Data"
            id={`water-quality-tab-${canAdd ? 1 : 0}`}
            aria-controls={`water-quality-tabpanel-${canAdd ? 1 : 0}`}
          />
          <Tab
            icon={<BarChart />}
            label="Visualizations"
            id={`water-quality-tab-${canAdd ? 2 : 1}`}
            aria-controls={`water-quality-tabpanel-${canAdd ? 2 : 1}`}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {canAdd && (
        <TabPanel value={activeTab} index={0}>
          {/* Data Entry Form */}
          <WaterQualityForm />
        </TabPanel>
      )}

      <TabPanel value={activeTab} index={canAdd ? 1 : 0}>
        {/* Data Viewing Tab */}
        <WaterQualityTable />
      </TabPanel>

      <TabPanel value={activeTab} index={canAdd ? 2 : 1}>
        {/* Visualizations Tab */}
        <Box>
          {data.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No data available for visualization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some water quality data to see charts and analysis.
              </Typography>
            </Paper>
          ) : (
            <WaterQualityVisualization />
          )}
        </Box>
      </TabPanel>
    </Container>
  );
};

export default WaterQualityPage;