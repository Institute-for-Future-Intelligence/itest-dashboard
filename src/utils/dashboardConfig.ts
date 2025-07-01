import { Cloud, Sensors, Water, Upload, Visibility, Analytics } from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

export interface FeatureCardConfig {
  id: string;
  title: string;
  iconComponent: SvgIconComponent;
  description: string;
  features: string[];
  path: string;
  permission: string;
  color: string;
  stats: string;
}

export const FEATURE_CARDS: FeatureCardConfig[] = [
  {
    id: 'weather',
    title: 'Weather Data Analysis',
    iconComponent: Cloud,
    description: 'Analyze historical weather data for Hawaii locations using Open Meteo API. Query temperature, humidity, precipitation, and more with customizable date ranges.',
    features: ['Historical Data Access', 'Multiple Locations', 'Hourly & Daily Variables', 'Advanced Filtering'],
    path: '/weather',
    permission: 'canAccessWeatherData',
    color: '#2196f3',
    stats: 'Real-time API Data'
  },
  {
    id: 'sensors',
    title: 'Sensor Data Management',
    iconComponent: Sensors,
    description: 'Upload, view, and analyze environmental sensor data including humidity, CO₂, pH, and salinity measurements from monitoring sites.',
    features: ['Excel Upload', 'Data Visualization', 'Location Tracking', 'Export Functions'],
    path: '/sensors',
    permission: 'canViewSensorData',
    color: '#4caf50',
    stats: 'Multi-parameter Tracking'
  },
  {
    id: 'water-quality',
    title: 'Water Quality Monitoring',
    iconComponent: Water,
    description: 'Record and analyze water quality parameters including temperature, pH, salinity, conductivity, and nutrient levels from various sites.',
    features: ['Data Entry Forms', 'Parameter Tracking', 'Trend Analysis', 'Site Management'],
    path: '/water-quality',
    permission: 'canEnterWaterQuality',
    color: '#00bcd4',
    stats: 'Comprehensive Testing'
  }
];

export interface PlatformCapabilityConfig {
  id: string;
  title: string;
  description: string;
  iconComponent: SvgIconComponent;
  color: string;
}

export const PLATFORM_CAPABILITIES: PlatformCapabilityConfig[] = [
  {
    id: 'weather-api',
    title: 'Weather API',
    description: 'Historical data from Open Meteo',
    iconComponent: Cloud,
    color: '#2196f3'
  },
  {
    id: 'data-upload',
    title: 'Data Upload',
    description: 'Excel/CSV sensor data import',
    iconComponent: Upload,
    color: '#4caf50'
  },
  {
    id: 'visualization',
    title: 'Visualization',
    description: 'Interactive charts and graphs',
    iconComponent: Visibility,
    color: '#ff9800'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Statistical insights and trends',
    iconComponent: Analytics,
    color: '#9c27b0'
  }
]; 