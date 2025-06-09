import type { Location, WeatherVariable } from '../types/weather';

export const HAWAII_LOCATIONS: Location[] = [
  {
    name: 'Pearl Harbor',
    latitude: 21.3629,
    longitude: -157.9565,
    timezone: 'Pacific/Honolulu'
  },
  {
    name: 'Kaneohe',
    latitude: 21.4014,
    longitude: -157.7979,
    timezone: 'Pacific/Honolulu'
  },
  {
    name: "Makapu'u",
    latitude: 21.3096,
    longitude: -157.6499,
    timezone: 'Pacific/Honolulu'
  }
];

export const HOURLY_VARIABLES: WeatherVariable[] = [
  { name: 'Temperature', unit: '°C', apiParam: 'temperature_2m', category: 'temperature' },
  { name: 'Humidity', unit: '%', apiParam: 'relative_humidity_2m', category: 'humidity' },
  { name: 'Precipitation', unit: 'mm', apiParam: 'precipitation', category: 'precipitation' },
  { name: 'Pressure', unit: 'hPa', apiParam: 'surface_pressure', category: 'pressure' },
  { name: 'Cloud Cover', unit: '%', apiParam: 'cloud_cover', category: 'other' },
  { name: 'Low Cloud Cover', unit: '%', apiParam: 'cloud_cover_low', category: 'other' },
  { name: 'Mid Cloud Cover', unit: '%', apiParam: 'cloud_cover_mid', category: 'other' },
  { name: 'High Cloud Cover', unit: '%', apiParam: 'cloud_cover_high', category: 'other' },
  { name: 'Evapotranspiration', unit: 'mm', apiParam: 'et0_fao_evapotranspiration', category: 'other' },
  { name: 'Wind Speed', unit: 'm/s', apiParam: 'wind_speed_10m', category: 'wind' },
  { name: 'Wind Direction', unit: '°', apiParam: 'wind_direction_10m', category: 'wind' },
  { name: 'Wind Gusts', unit: 'm/s', apiParam: 'wind_gusts_10m', category: 'wind' },
  { name: 'Shortwave Radiation (Instant)', unit: 'W/m²', apiParam: 'shortwave_radiation', category: 'radiation' },
  { name: 'Diffuse Radiation', unit: 'W/m²', apiParam: 'diffuse_radiation', category: 'radiation' }
];

export const DAILY_VARIABLES: WeatherVariable[] = [
  { name: 'Max Temperature', unit: '°C', apiParam: 'temperature_2m_max', category: 'temperature' },
  { name: 'Min Temperature', unit: '°C', apiParam: 'temperature_2m_min', category: 'temperature' },
  { name: 'Mean Temperature', unit: '°C', apiParam: 'temperature_2m_mean', category: 'temperature' },
  { name: 'Daylight Duration', unit: 's', apiParam: 'daylight_duration', category: 'other' },
  { name: 'Sunshine Duration', unit: 's', apiParam: 'sunshine_duration', category: 'other' },
  { name: 'Precipitation Hours', unit: 'h', apiParam: 'precipitation_hours', category: 'precipitation' },
  { name: 'Shortwave Radiation (Sum)', unit: 'MJ/m²', apiParam: 'shortwave_radiation_sum', category: 'radiation' }
]; 