export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface DateRange {
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
}

export interface HourlyVariable {
  id: string;
  name: string;
  unit: string;
  apiParam: string;
}

export interface DailyVariable {
  id: string;
  name: string;
  unit: string;
  apiParam: string;
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
    [key: string]: number[] | string[];
  };
  daily?: {
    time: string[];
    [key: string]: number[] | string[];
  };
}

export interface WeatherState {
  loading: boolean;
  data: WeatherApiResponse | null;
  error: string | null;
} 