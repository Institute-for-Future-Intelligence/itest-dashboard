import { Timestamp } from 'firebase/firestore';

// Core sensor data point interface
export interface SensorDataPoint {
  id: string;
  timestamp: Date;
  date: string; // ISO date string for easy querying
  location: string; // Site location identifier
  humidity: number;
  co2: number;
  ph: number;
  salinity: number;
  uploadedBy: string; // user UID
  uploadedAt: Timestamp;
}

// Raw data from Excel file (before processing)
export interface RawSensorData {
  Date: string;
  Humidity: number;
  CO2: number;
  pH: number;
  Salinity: number;
}

// Sensor data upload batch information
export interface SensorDataUpload {
  id: string;
  uploadedBy: string; // user UID
  uploadedAt: Timestamp;
  fileName: string;
  location: string; // Site location for this upload
  recordCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  status: 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}

// Filtering and querying options
export interface SensorDataFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  humidityRange?: {
    min: number;
    max: number;
  };
  co2Range?: {
    min: number;
    max: number;
  };
  phRange?: {
    min: number;
    max: number;
  };
  salinityRange?: {
    min: number;
    max: number;
  };
  uploadedBy?: string;
  limit?: number;
  sortBy?: 'timestamp' | 'humidity' | 'co2' | 'ph' | 'salinity';
  sortOrder?: 'asc' | 'desc';
}

// Statistics for sensor data
export interface SensorDataStats {
  totalRecords: number;
  dateRange: {
    earliest: Date;
    latest: Date;
  };
  averages: {
    humidity: number;
    co2: number;
    ph: number;
    salinity: number;
  };
  ranges: {
    humidity: { min: number; max: number };
    co2: { min: number; max: number };
    ph: { min: number; max: number };
    salinity: { min: number; max: number };
  };
}

// Excel file validation result
export interface ExcelValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  validRowCount: number;
  duplicateInfo?: {
    hasDuplicates: boolean;
    duplicateCount: number;
    newDataCount: number;
    duplicateEntries: Array<{
      timestamp: Date;
      existingId: string;
      rowIndex: number;
    }>;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
}

// Table column configuration for data display
export interface SensorDataColumn {
  key: keyof SensorDataPoint;
  label: string;
  sortable: boolean;
  format?: (value: string | number | Date | Timestamp | null | undefined) => string;
  width?: string;
} 