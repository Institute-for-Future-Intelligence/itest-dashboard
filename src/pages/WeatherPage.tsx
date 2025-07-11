import { useEffect, useMemo } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import WeatherSidebar from '../components/weather/WeatherSidebar';
import WeatherContent from '../components/weather/WeatherContent';
import { useWeatherApi } from '../hooks/useWeatherApi';
import { useWeatherStore } from '../store/useWeatherStore';
import { transformWeatherDataToCharts } from '../utils/chartDataTransformer';
import { HAWAII_LOCATIONS } from '../utils/weatherConfig';

const WeatherPage = () => {
  // Zustand store
  const {
    selectedLocation,
    dateRange,
    selectedHourlyVariables,
    selectedDailyVariables,
    setSelectedLocation,
    setDateRange,
    setSelectedHourlyVariables,
    setSelectedDailyVariables,
    setData,
    setLoading,
    setError,
  } = useWeatherStore();

  // Weather API hook
  const { weatherState, fetchWeatherData, isLoading, hasData } = useWeatherApi();

  // Transform weather data to chart data (with memoized dependencies)
  const visualizationSections = useMemo(() => {
    if (!weatherState.data) return [];
    return transformWeatherDataToCharts(
      weatherState.data,
      selectedHourlyVariables,
      selectedDailyVariables
    );
  }, [
    weatherState.data, 
    selectedHourlyVariables,
    selectedDailyVariables
  ]);

  // Sync weather data from API hook to Zustand store
  useEffect(() => {
    setData(weatherState.data);
    setLoading(weatherState.loading);
    setError(weatherState.error);
  }, [weatherState.data, weatherState.loading, weatherState.error, setData, setLoading, setError]);

  // Initialize default values
  useEffect(() => {
    // Set default location to Pearl Harbor if not already set
    if (!selectedLocation && HAWAII_LOCATIONS.length > 0) {
      setSelectedLocation(HAWAII_LOCATIONS[0]);
    }

    // Set default date range (last 7 days) if not already set
    if (!dateRange.startDate || !dateRange.endDate) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1); // Yesterday
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago

      setDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    }
  }, [selectedLocation, dateRange, setSelectedLocation, setDateRange]);

  // Handle API data fetching
  const handleFetchData = async () => {
    if (!selectedLocation) return;

    try {
      await fetchWeatherData({
        location: selectedLocation,
        dateRange,
        hourlyVariables: selectedHourlyVariables,
        dailyVariables: selectedDailyVariables,
      });
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Weather Data Analysis
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Analyze historical weather data for Hawaii locations using Open Meteo API
      </Typography>

      <Stack 
        direction={{ xs: 'column', lg: 'row' }} 
        spacing={3} 
        sx={{ alignItems: 'flex-start' }}
      >
        {/* Left Sidebar - Sticky on larger screens */}
        <Box 
          sx={{ 
            width: { xs: '100%', lg: '300px' },
            flexShrink: 0,
            position: { xs: 'static', lg: 'sticky' },
            top: { lg: 24 },
            alignSelf: { lg: 'flex-start' },
            maxHeight: { lg: 'calc(100vh - 48px)' },
            overflow: { lg: 'auto' }
          }}
        >
          <WeatherSidebar
            selectedLocation={selectedLocation}
            dateRange={dateRange}
            selectedHourlyVariables={selectedHourlyVariables}
            selectedDailyVariables={selectedDailyVariables}
            isLoading={isLoading}
            error={weatherState.error}
            hasData={hasData}
            weatherData={weatherState.data}
            onLocationChange={setSelectedLocation}
            onDateRangeChange={setDateRange}
            onFetchData={handleFetchData}
          />
        </Box>

        {/* Main Content - Naturally expanding */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WeatherContent
            selectedHourlyVariables={selectedHourlyVariables}
            selectedDailyVariables={selectedDailyVariables}
            visualizationSections={visualizationSections}
            hasData={hasData}
            onHourlyVariablesChange={setSelectedHourlyVariables}
            onDailyVariablesChange={setSelectedDailyVariables}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default WeatherPage;