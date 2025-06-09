import type { Location, HourlyVariable, DailyVariable } from '../types/weather';

export const HAWAII_LOCATIONS: Location[] = [
  {
    id: 'pearl-harbor',
    name: 'Pearl Harbor',
    latitude: 21.3629,
    longitude: -157.9565
  },
  {
    id: 'kaneohe',
    name: 'Kaneohe',
    latitude: 21.4014,
    longitude: -157.7979
  },
  {
    id: 'makapuu',
    name: "Makapu'u",
    latitude: 21.3096,
    longitude: -157.6499
  }
];

export const HOURLY_VARIABLES: HourlyVariable[] = [
  { id: 'temp', name: 'Temperature', unit: '°C', apiParam: 'temperature_2m' },
  { id: 'humidity', name: 'Humidity', unit: '%', apiParam: 'relative_humidity_2m' },
  { id: 'precipitation', name: 'Precipitation', unit: 'mm', apiParam: 'precipitation' },
  { id: 'pressure', name: 'Pressure', unit: 'hPa', apiParam: 'surface_pressure' },
  { id: 'cloud_cover', name: 'Cloud Cover', unit: '%', apiParam: 'cloud_cover' },
  { id: 'cloud_cover_low', name: 'Low Cloud Cover', unit: '%', apiParam: 'cloud_cover_low' },
  { id: 'cloud_cover_mid', name: 'Mid Cloud Cover', unit: '%', apiParam: 'cloud_cover_mid' },
  { id: 'cloud_cover_high', name: 'High Cloud Cover', unit: '%', apiParam: 'cloud_cover_high' },
  { id: 'et0', name: 'Evapotranspiration', unit: 'mm', apiParam: 'et0_fao_evapotranspiration' },
  { id: 'wind_speed', name: 'Wind Speed', unit: 'm/s', apiParam: 'wind_speed_10m' },
  { id: 'wind_direction', name: 'Wind Direction', unit: '°', apiParam: 'wind_direction_10m' },
  { id: 'wind_gusts', name: 'Wind Gusts', unit: 'm/s', apiParam: 'wind_gusts_10m' },
  { id: 'shortwave_radiation', name: 'Shortwave Radiation (Instant)', unit: 'W/m²', apiParam: 'shortwave_radiation' },
  { id: 'diffuse_radiation', name: 'Diffuse Radiation', unit: 'W/m²', apiParam: 'diffuse_radiation' }
];

export const DAILY_VARIABLES: DailyVariable[] = [
  { id: 'temp_max', name: 'Max Temperature', unit: '°C', apiParam: 'temperature_2m_max' },
  { id: 'temp_min', name: 'Min Temperature', unit: '°C', apiParam: 'temperature_2m_min' },
  { id: 'temp_mean', name: 'Mean Temperature', unit: '°C', apiParam: 'temperature_2m_mean' },
  { id: 'daylight_duration', name: 'Daylight Duration', unit: 's', apiParam: 'daylight_duration' },
  { id: 'sunshine_duration', name: 'Sunshine Duration', unit: 's', apiParam: 'sunshine_duration' },
  { id: 'precipitation_hours', name: 'Precipitation Hours', unit: 'h', apiParam: 'precipitation_hours' },
  { id: 'shortwave_radiation_sum', name: 'Shortwave Radiation (Sum)', unit: 'MJ/m²', apiParam: 'shortwave_radiation_sum' }
]; 