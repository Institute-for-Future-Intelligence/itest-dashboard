import { useState, useEffect, useMemo } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import WeatherSidebar from '../components/weather/WeatherSidebar';
import WeatherContent from '../components/weather/WeatherContent';
import { useWeatherApi } from '../hooks/useWeatherApi';
import { transformWeatherDataToCharts } from '../utils/chartDataTransformer';
import type { Location, DateRange } from '../types/weather';
import { HAWAII_LOCATIONS } from '../utils/weatherConfig';

const WeatherPage = () => {
  // State management
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
  });
  const [selectedHourlyVariables, setSelectedHourlyVariables] = useState<string[]>([]);
  const [selectedDailyVariables, setSelectedDailyVariables] = useState<string[]>([]);

  // Weather API hook
  const { weatherState, fetchWeatherData, isLoading, hasData } = useWeatherApi();

  // Transform weather data to chart data (with serialized dependency to reduce recalculations)
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

  // Initialize default values
  useEffect(() => {
    // Set default location to Pearl Harbor
    if (HAWAII_LOCATIONS.length > 0) {
      setSelectedLocation(HAWAII_LOCATIONS[0]);
    }

    // Set default date range (last 7 days)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // Yesterday
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  }, []);

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
    <Container maxWidth={false} sx={{ py: 3, height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Weather Data Analysis
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Analyze historical weather data for Hawaii locations using Open Meteo API
      </Typography>

      <Stack direction="row" spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Left Sidebar - 20% */}
        <Box sx={{ width: '20%', minWidth: '300px' }}>
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

        {/* Main Content - 80% */}
        <Box sx={{ flex: 1 }}>
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