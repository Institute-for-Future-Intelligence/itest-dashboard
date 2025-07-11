import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { 
  FileDownload, 
  TableChart, 
  Description,
  KeyboardArrowDown 
} from '@mui/icons-material';
import { useWeatherStore } from '../../store/useWeatherStore';

interface WeatherExportButtonProps {
  disabled?: boolean;
}

const WeatherExportButton: React.FC<WeatherExportButtonProps> = ({ 
  disabled = false 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { 
    isExporting, 
    exportError, 
    exportToCSV, 
    exportToExcel, 
    clearExportError,
    canExport 
  } = useWeatherStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = async () => {
    handleMenuClose();
    await exportToCSV();
  };

  const handleExportExcel = async () => {
    handleMenuClose();
    await exportToExcel();
  };

  const isDisabled = disabled || isExporting || !canExport();

  return (
    <Box>
      <Button
        variant="contained"
        fullWidth
        startIcon={isExporting ? <CircularProgress size={16} /> : <FileDownload />}
        endIcon={<KeyboardArrowDown />}
        onClick={handleMenuOpen}
        disabled={isDisabled}
      >
        {isExporting ? 'Exporting...' : 'Export as'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleExportCSV} disabled={isExporting}>
          <ListItemIcon>
            <Description fontSize="small" />
          </ListItemIcon>
          <ListItemText>CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel} disabled={isExporting}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>XLSX</ListItemText>
        </MenuItem>
      </Menu>

      {exportError && (
        <Alert 
          severity="error" 
          onClose={clearExportError}
          sx={{ mt: 2 }}
        >
          {exportError}
        </Alert>
      )}

      {!canExport() && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Fetch weather data first to enable export
        </Typography>
      )}
    </Box>
  );
};

export default WeatherExportButton; 