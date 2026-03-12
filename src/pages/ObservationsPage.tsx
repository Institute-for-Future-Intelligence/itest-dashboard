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
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Add, ViewList, BarChart, FileDownload } from '@mui/icons-material';
import { useUserStore } from '../store/useUserStore';
import { useObservationStore } from '../store/useObservationStore';
import { observationService } from '../firebase/observationService';
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
  const { form, clearFormMessages, loadData } = useObservationStore();

  const [activeTab, setActiveTab] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
      if (newValue !== 0) clearFormMessages();
    },
    [clearFormMessages]
  );

  const handleImport = useCallback(async () => {
    if (!user) return;
    setImporting(true);
    setImportResult(null);
    setImportError(null);
    try {
      const result = await observationService.seedHistoricalData(user.uid);
      setImportResult(result);
      loadData({ sortBy: 'date', sortOrder: 'desc' });
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }, [user, loadData]);

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
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Seaweed Observations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track limu (seaweed) growth, water quality, lighting conditions, and system interventions
            across cultivation sessions. Data is recorded manually by educators and students.
          </Typography>
        </Box>
        {isAdmin && (
          <Tooltip title="Import the 6 historical records from Ken Kozuma's Feb–Mar 2026 emails. Duplicate entries are skipped automatically.">
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={importing ? <CircularProgress size={16} /> : <FileDownload />}
                onClick={handleImport}
                disabled={importing}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {importing ? 'Importing…' : 'Import Historical Data'}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      {importResult && (
        <Alert severity={importResult.inserted > 0 ? 'success' : 'info'} sx={{ mb: 2 }} onClose={() => setImportResult(null)}>
          {importResult.inserted > 0
            ? `Imported ${importResult.inserted} record${importResult.inserted !== 1 ? 's' : ''} successfully.`
            : 'All records already exist — nothing new to import.'}
          {importResult.skipped > 0 && ` (${importResult.skipped} duplicate${importResult.skipped !== 1 ? 's' : ''} skipped)`}
        </Alert>
      )}
      {importError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setImportError(null)}>
          {importError}
        </Alert>
      )}

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
