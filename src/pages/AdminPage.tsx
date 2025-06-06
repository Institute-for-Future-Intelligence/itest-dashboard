import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { usePermissions } from '../hooks/usePermissions';
import AdminUserManagement from '../components/AdminUserManagement';
import { useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminPage = () => {
  const { isAdmin } = usePermissions();
  const [tabValue, setTabValue] = useState(0);

  // Redirect non-admins
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage users, system settings, and administrative functions.
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
          >
            <Tab label="User Management" {...a11yProps(0)} />
            <Tab label="System Settings" {...a11yProps(1)} />
            <Tab label="Analytics" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <AdminUserManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System configuration features will be implemented here.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrative analytics and reporting features will be implemented here.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminPage; 