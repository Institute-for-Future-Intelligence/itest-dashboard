import { useState } from 'react';
import type { WeatherApiParams, WeatherApiResponse, WeatherState } from '../types/weather';

export const useWeatherApi = () => {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    loading: false,
    data: null,
    error: null,
  });

  const buildApiUrl = (params: WeatherApiParams): string => {
    const baseUrl = 'https://archive-api.open-meteo.com/v1/archive';
    const searchParams = new URLSearchParams({
      latitude: params.location.latitude.toString(),
      longitude: params.location.longitude.toString(),
      start_date: params.dateRange.startDate,
      end_date: params.dateRange.endDate,
      timezone: 'Pacific/Honolulu', // Hawaii timezone
    });

    // Add hourly variables if any selected
    if (params.hourlyVariables.length > 0) {
      searchParams.append('hourly', params.hourlyVariables.join(','));
    }

    // Add daily variables if any selected
    if (params.dailyVariables.length > 0) {
      searchParams.append('daily', params.dailyVariables.join(','));
    }

    return `${baseUrl}?${searchParams.toString()}`;
  };

  const fetchWeatherData = async (params: WeatherApiParams) => {
    try {
      setWeatherState({ loading: true, data: null, error: null });

      // Validate that at least one variable is selected
      if (params.hourlyVariables.length === 0 && params.dailyVariables.length === 0) {
        throw new Error('Please select at least one weather variable');
      }

      // Validate date range
      const startDate = new Date(params.dateRange.startDate);
      const endDate = new Date(params.dateRange.endDate);
      const today = new Date();
      
      if (startDate >= today) {
        throw new Error('Start date must be in the past (historical data only)');
      }
      
      if (endDate >= today) {
        throw new Error('End date must be in the past (historical data only)');
      }
      
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }

      // Build API URL
      const apiUrl = buildApiUrl(params);
      console.log('Fetching weather data from:', apiUrl);

      // Fetch data
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: WeatherApiResponse = await response.json();
      
      setWeatherState({ loading: false, data, error: null });
      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      setWeatherState({ loading: false, data: null, error: errorMessage });
      throw error;
    }
  };

  const clearData = () => {
    setWeatherState({ loading: false, data: null, error: null });
  };

  return {
    weatherState,
    fetchWeatherData,
    clearData,
    isLoading: weatherState.loading,
    hasData: !!weatherState.data,
    hasError: !!weatherState.error,
  };
}; 