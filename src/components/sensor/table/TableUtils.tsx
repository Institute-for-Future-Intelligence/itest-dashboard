import type { SensorDataColumn } from '../../../types/sensor';

// Define table columns configuration
export const TABLE_COLUMNS: SensorDataColumn[] = [
  {
    key: 'timestamp',
    label: 'Date & Time',
    sortable: true,
    format: (value: Date) => value && value.toLocaleString ? value.toLocaleString() : 'N/A',
    width: '180px',
  },
  {
    key: 'humidity',
    label: 'Humidity (%)',
    sortable: true,
    format: (value: number | null) => value != null && !isNaN(value) ? `${value.toFixed(1)}%` : '-',
    width: '120px',
  },
  {
    key: 'co2',
    label: 'CO₂ (ppm)',
    sortable: true,
    format: (value: number | null) => value != null && !isNaN(value) ? value.toFixed(0) : '-',
    width: '120px',
  },
  {
    key: 'ph',
    label: 'pH',
    sortable: true,
    format: (value: number | null) => value != null && !isNaN(value) ? value.toFixed(3) : '-',
    width: '100px',
  },
  {
    key: 'salinity',
    label: 'Salinity (ppt)',
    sortable: true,
    format: (value: number | null) => value != null && !isNaN(value) ? value.toFixed(4) : '-',
    width: '140px',
  },
];

// Table pagination options
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Default rows per page
export const DEFAULT_ROWS_PER_PAGE = 25; 