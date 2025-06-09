import { 
  Box, 
  Paper, 
  Stack, 
  Button, 
  Typography,
  Alert,
  CircularProgress 
} from '@mui/material';
import { Download } from '@mui/icons-material';
import LocationSelector from './LocationSelector';
import DateRangeSelector from './DateRangeSelector';
import type { Location, DateRange, WeatherApiResponse } from '../../types/weather';

interface WeatherSidebarProps {
  selectedLocation: Location | null;
  dateRange: DateRange;
  selectedHourlyVariables: string[];
  selectedDailyVariables: string[];
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
  weatherData: WeatherApiResponse | null;
  onLocationChange: (location: Location) => void;
  onDateRangeChange: (dateRange: DateRange) => void;
  onFetchData: () => void;
}

const WeatherSidebar = ({
  selectedLocation,
  dateRange,
  selectedHourlyVariables,
  selectedDailyVariables,
  isLoading,
  error,
  hasData,
  weatherData,
  onLocationChange,
  onDateRangeChange,
  onFetchData,
}: WeatherSidebarProps) => {

  const canFetchData = selectedLocation && 
                      dateRange.startDate && 
                      dateRange.endDate &&
                      (selectedHourlyVariables.length > 0 || selectedDailyVariables.length > 0);

  const getSelectedVariablesCount = () => {
    return selectedHourlyVariables.length + selectedDailyVariables.length;
  };

  return (
    <Paper sx={{ p: 3, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom>
        Weather Data Parameters
      </Typography>
      
      <Stack spacing={3}>
        <LocationSelector
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
        />

        <DateRangeSelector
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Variables selected: {getSelectedVariablesCount()}
          </Typography>
          
          <Button
            variant="contained"
            fullWidth
            startIcon={isLoading ? <CircularProgress size={16} /> : <Download />}
            onClick={onFetchData}
            disabled={!canFetchData || isLoading}
            sx={{ mt: 1 }}
          >
            {isLoading ? 'Fetching...' : 'Fetch Weather Data'}
          </Button>
          
                      {!canFetchData && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {!selectedLocation ? 'Select a location' :
               !dateRange.startDate || !dateRange.endDate ? 'Select date range' :
               'Select at least one variable'}
            </Typography>
          )}

          {/* Success Message */}
          {hasData && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Weather data fetched successfully!{' '}
              {weatherData?.hourly && `${Object.keys(weatherData.hourly).length - 1} hourly variables`}
              {weatherData?.daily && weatherData?.hourly && ', '}
              {weatherData?.daily && `${Object.keys(weatherData.daily).length - 1} daily variables`}
            </Alert>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default WeatherSidebar; 