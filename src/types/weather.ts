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

export const isValidLocation = (obj: unknown): obj is Location => {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === 'object' &&
    'name' in obj &&
    'latitude' in obj &&
    'longitude' in obj &&
    typeof (obj as Location).name === 'string' &&
    typeof (obj as Location).latitude === 'number' &&
    typeof (obj as Location).longitude === 'number' &&
    (obj as Location).latitude >= -90 &&
    (obj as Location).latitude <= 90 &&
    (obj as Location).longitude >= -180 &&
    (obj as Location).longitude <= 180
  );
};

export const isValidDateRange = (obj: unknown): obj is DateRange => {
  if (!obj || typeof obj !== 'object' || !('startDate' in obj) || !('endDate' in obj)) {
    return false;
  }
  
  const typedObj = obj as Record<string, unknown>;
  if (typeof typedObj.startDate !== 'string' || typeof typedObj.endDate !== 'string') {
    return false;
  }
  
  const startDate = new Date(typedObj.startDate);
  const endDate = new Date(typedObj.endDate);
  
  return (
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    startDate <= endDate
  );
};

export interface WeatherApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface WeatherConfig {
  locations: Location[];
  hourlyVariables: WeatherVariable[];
  dailyVariables: WeatherVariable[];
  defaultDateRange: {
    daysBack: number;
  };
} 