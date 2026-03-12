import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, ViewList, BarChart } from '@mui/icons-material';
import { useUserStore } from '../store/useUserStore';
import { useObservationStore } from '../store/useObservationStore';
import { ObservationForm, ObservationTable, ObservationVisualization } from '../components/observations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`observations-tabpanel-${index}`}
    aria-labelledby={`observations-tab-${index}`}
    {...other}
  >
    {value === index && children}
  </div>
);

const ObservationsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useUserStore();
  const { form, clearFormMessages } = useObservationStore();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
      if (newValue !== 0) clearFormMessages();
    },
    [clearFormMessages]
  );

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Please log in to access observations.</Alert>
      </Container>
    );
  }

  const displayMessage =
    form.submitSuccess ? 'Observation saved successfully!' : null;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Seaweed Observations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track limu (seaweed) growth, water quality, lighting conditions, and system interventions
          across cultivation sessions. Data is recorded manually by educators and students.
        </Typography>
      </Box>

      {displayMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearFormMessages}>
          {displayMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="observations tabs"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab icon={<Add />} label="Add Observation" id="observations-tab-0" aria-controls="observations-tabpanel-0" />
          <Tab icon={<ViewList />} label="View Data" id="observations-tab-1" aria-controls="observations-tabpanel-1" />
          <Tab icon={<BarChart />} label="Visualizations" id="observations-tab-2" aria-controls="observations-tabpanel-2" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <ObservationForm />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ObservationTable />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <ObservationVisualization />
      </TabPanel>
    </Container>
  );
};

export default ObservationsPage;
