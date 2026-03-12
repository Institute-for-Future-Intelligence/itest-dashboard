import { Timestamp } from 'firebase/firestore';

export type DataReliability = 'reliable' | 'uncertain' | 'flagged';
export type TemperatureUnit = 'F' | 'C';
export type VolumeUnit = 'gallons' | 'liters';

// Core observation data point stored in Firestore
export interface SeaweedObservation {
  id: string;
  timestamp: Date;
  date: string; // "YYYY-MM-DD" — indexed for range queries

  // Identity
  species: string;       // e.g. "ogo_manuea", "lepe_lepe"
  location: string;      // e.g. "fh_107_growth_chamber"
  observer: string;      // free-text name (educator/student who took the reading)
  enteredBy: string;     // Firebase UID of the user who entered this record
  enteredAt: Timestamp;

  // Biomass
  wetMassGrams?: number;

  // Water quality (manual readings taken at the same session)
  salinity?: number;          // ppt
  temperature?: number;       // numeric value in the unit below
  temperatureUnit?: TemperatureUnit;
  ph?: number;
  dissolvedOxygen?: number;   // mg/L

  // Container / system setup
  containerVolume?: number;
  containerVolumeUnit?: VolumeUnit;

  // Lighting config (record only when changed or newly set up)
  lightScheduleStart?: string;  // "HH:MM" 24-h
  lightScheduleEnd?: string;    // "HH:MM" 24-h
  lightWhitePercent?: number;   // 0–100
  lightRedPercent?: number;
  lightBluePercent?: number;

  // Interventions performed at this session
  waterExchangePercent?: number; // 0–100
  waterExchangeSource?: string;
  nutrientsAdded?: string;

  // Qualitative health assessment
  colorDescription?: string;
  healthNotes?: string;
  generalNotes?: string;

  // Data quality
  sensorIssuesNoted?: boolean;
  dataReliability?: DataReliability;
}

// Form data mirrors the observation but uses '' for empty numerics
export interface ObservationFormData {
  date: string;
  time: string;
  species: string;
  location: string;
  observer: string;

  wetMassGrams: number | '';

  salinity: number | '';
  temperature: number | '';
  temperatureUnit: TemperatureUnit;
  ph: number | '';
  dissolvedOxygen: number | '';

  containerVolume: number | '';
  containerVolumeUnit: VolumeUnit;

  lightScheduleStart: string;
  lightScheduleEnd: string;
  lightWhitePercent: number | '';
  lightRedPercent: number | '';
  lightBluePercent: number | '';

  waterExchangePercent: number | '';
  waterExchangeSource: string;
  nutrientsAdded: string;

  colorDescription: string;
  healthNotes: string;
  generalNotes: string;

  sensorIssuesNoted: boolean;
  dataReliability: DataReliability;
}

export interface ObservationFilters {
  dateRange?: { start: Date; end: Date };
  species?: string;
  location?: string;
  enteredBy?: string;
  dataReliability?: DataReliability;
  limit?: number;
  sortBy?: keyof SeaweedObservation;
  sortOrder?: 'asc' | 'desc';
}

export interface ObservationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Display-friendly species names
export const SEAWEED_SPECIES: { value: string; label: string; labelHawaiian?: string }[] = [
  { value: 'ogo_manuea',  label: 'Ogo (Manuea)',  labelHawaiian: 'Manuea' },
  { value: 'lepe_lepe',   label: 'Lepe Lepe' },
  { value: 'limu_kohu',   label: 'Limu Kohu' },
  { value: 'sea_asparagus', label: 'Sea Asparagus' },
  { value: 'other',       label: 'Other' },
];

export const OBSERVATION_LOCATIONS: { value: string; label: string }[] = [
  { value: 'fh_107_growth_chamber', label: 'FH-107 Growth Chamber' },
  { value: '2gal_bucket',           label: '2-Gallon Bucket' },
  { value: '40gal_tub',             label: '40-Gallon Tub' },
  { value: 'main_500gal_tank',      label: 'Main 500-Gallon Tank' },
  { value: 'flatbed_1',             label: '8-Ft Flatbed #1 (Limu Kohu)' },
  { value: 'flatbed_2',             label: '8-Ft Flatbed #2 (Sea Asparagus)' },
  { value: 'other',                 label: 'Other' },
];

export const SPECIES_COLORS: Record<string, string> = {
  ogo_manuea:    '#22c55e',
  lepe_lepe:     '#f59e0b',
  limu_kohu:     '#3b82f6',
  sea_asparagus: '#8b5cf6',
  other:         '#6b7280',
};
