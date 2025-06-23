import { Timestamp } from 'firebase/firestore';

// Core water quality data point interface
export interface WaterQualityDataPoint {
  id: string;
  timestamp: Date;
  date: string; // ISO date string for easy querying
  location: string; // Site location identifier
  
  // Physical parameters
  temperature: number; // °C
  ph: number; // pH units (0-14)
  salinity: number; // ppt (parts per thousand)
  conductivity: number; // µS/cm (microsiemens per centimeter)
  
  // Nutrients (concentrations in mg/L or ppm)
  nitrate: number; // NO3- (mg/L)
  nitrite: number; // NO2- (mg/L)
  ammonia: number; // NH3/NH4+ (mg/L)
  phosphate: number; // PO4³- (mg/L)
  
  // Optional - for future expansion
  potassium?: number; // K+ (mg/L)
  
  // Metadata
  enteredBy: string; // user UID who entered the data
  enteredAt: Timestamp;
  notes?: string; // Optional notes/observations
}

// Manual entry form data interface
export interface WaterQualityFormData {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  location: string;
  
  // Physical parameters
  temperature: number | '';
  ph: number | '';
  salinity: number | '';
  conductivity: number | '';
  
  // Nutrients
  nitrate: number | '';
  nitrite: number | '';
  ammonia: number | '';
  phosphate: number | '';
  
  // Optional
  potassium?: number | '';
  notes?: string;
}

// Validation ranges for water quality parameters
export interface WaterQualityValidation {
  parameter: keyof WaterQualityFormData;
  min: number;
  max: number;
  unit: string;
  typical: { min: number; max: number }; // Typical range for alerts
}

// Predefined validation rules
export const WATER_QUALITY_VALIDATION: WaterQualityValidation[] = [
  { parameter: 'temperature', min: 0, max: 50, unit: '°C', typical: { min: 15, max: 35 } },
  { parameter: 'ph', min: 0, max: 14, unit: '', typical: { min: 6.5, max: 8.5 } },
  { parameter: 'salinity', min: 0, max: 50, unit: 'ppt', typical: { min: 0, max: 40 } },
  { parameter: 'conductivity', min: 0, max: 100000, unit: 'µS/cm', typical: { min: 50, max: 50000 } },
  { parameter: 'nitrate', min: 0, max: 1000, unit: 'mg/L', typical: { min: 0, max: 50 } },
  { parameter: 'nitrite', min: 0, max: 100, unit: 'mg/L', typical: { min: 0, max: 5 } },
  { parameter: 'ammonia', min: 0, max: 100, unit: 'mg/L', typical: { min: 0, max: 10 } },
  { parameter: 'phosphate', min: 0, max: 100, unit: 'mg/L', typical: { min: 0, max: 10 } },
];

// Unit conversion constants (for future use)
export const CONVERSION_FACTORS = {
  // mg/L to molar concentrations (multiply by these factors)
  NITRATE_TO_MOLAR: 0.01613, // mg/L NO3- to mM
  NITRITE_TO_MOLAR: 0.02174, // mg/L NO2- to mM  
  AMMONIA_TO_MOLAR: 0.05544, // mg/L NH3 to mM
  PHOSPHATE_TO_MOLAR: 0.01053, // mg/L PO4³- to mM
} as const;

// Filtering and querying options
export interface WaterQualityFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  temperatureRange?: { min: number; max: number };
  phRange?: { min: number; max: number };
  salinityRange?: { min: number; max: number };
  conductivityRange?: { min: number; max: number };
  nitrateRange?: { min: number; max: number };
  nitriteRange?: { min: number; max: number };
  ammoniaRange?: { min: number; max: number };
  phosphateRange?: { min: number; max: number };
  enteredBy?: string;
  limit?: number;
  sortBy?: keyof WaterQualityDataPoint;
  sortOrder?: 'asc' | 'desc';
}

// Statistics for water quality data
export interface WaterQualityStats {
  totalRecords: number;
  dateRange: {
    earliest: Date;
    latest: Date;
  };
  averages: {
    temperature: number;
    ph: number;
    salinity: number;
    conductivity: number;
    nitrate: number;
    nitrite: number;
    ammonia: number;
    phosphate: number;
  };
  ranges: {
    temperature: { min: number; max: number };
    ph: { min: number; max: number };
    salinity: { min: number; max: number };
    conductivity: { min: number; max: number };
    nitrate: { min: number; max: number };
    nitrite: { min: number; max: number };
    ammonia: { min: number; max: number };
    phosphate: { min: number; max: number };
  };
}

// Form validation result
export interface WaterQualityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Table column configuration for data display
export interface WaterQualityColumn {
  key: keyof WaterQualityDataPoint;
  label: string;
  sortable: boolean;
  format?: (value: string | number | Date | Timestamp | null | undefined) => string;
  width?: string;
} 