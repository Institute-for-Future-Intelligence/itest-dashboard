export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface DateRange {
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
}

export interface WeatherVariable {
  apiParam: string;
  name: string;
  unit: string;
  description?: string;
  category?: 'temperature' | 'humidity' | 'pressure' | 'wind' | 'precipitation' | 'radiation' | 'other';
}

export interface WeatherApiParams {
  location: Location;
  dateRange: DateRange;
  hourlyVariables: string[];
  dailyVariables: string[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly?: {
    time: string[];
    [key: string]: (number | null)[] | string[];
  };
  daily?: {
    time: string[];
    [key: string]: (number | null)[] | string[];
  };
}

export interface WeatherState {
  loading: boolean;
  data: WeatherApiResponse | null;
  error: string | null;
}

export type WeatherDataType = 'hourly' | 'daily';
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export const isValidLocation = (obj: any): obj is Location => {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.latitude === 'number' &&
    typeof obj.longitude === 'number' &&
    obj.latitude >= -90 &&
    obj.latitude <= 90 &&
    obj.longitude >= -180 &&
    obj.longitude <= 180
  );
};

export const isValidDateRange = (obj: any): obj is DateRange => {
  if (!obj || typeof obj.startDate !== 'string' || typeof obj.endDate !== 'string') {
    return false;
  }
  
  const startDate = new Date(obj.startDate);
  const endDate = new Date(obj.endDate);
  
  return (
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    startDate <= endDate
  );
};

export interface WeatherApiError {
  code: string;
  message: string;
  details?: any;
}

export interface WeatherConfig {
  locations: Location[];
  hourlyVariables: WeatherVariable[];
  dailyVariables: WeatherVariable[];
  defaultDateRange: {
    daysBack: number;
  };
} 