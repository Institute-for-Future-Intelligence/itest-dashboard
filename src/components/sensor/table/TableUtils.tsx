import type { SensorDataColumn } from '../../../types/sensor';
import { Timestamp } from 'firebase/firestore';

// Define table columns configuration
export const TABLE_COLUMNS: SensorDataColumn[] = [
  {
    key: 'timestamp',
    label: 'Date & Time',
    sortable: true,
    format: (value) => {
      if (!value) return 'N/A';
      if (value instanceof Date) return value.toLocaleString();
      if (value instanceof Timestamp) return value.toDate().toLocaleString();
      if (typeof value === 'string') return new Date(value).toLocaleString();
      return 'N/A';
    },
    width: '180px',
  },
  {
    key: 'humidity',
    label: 'Humidity (%)',
    sortable: true,
    format: (value) => {
      const num = typeof value === 'number' ? value : Number(value);
      return !isNaN(num) ? `${num.toFixed(1)}%` : '-';
    },
    width: '120px',
  },
  {
    key: 'co2',
    label: 'CO₂ (ppm)',
    sortable: true,
    format: (value) => {
      const num = typeof value === 'number' ? value : Number(value);
      return !isNaN(num) ? num.toFixed(0) : '-';
    },
    width: '120px',
  },
  {
    key: 'ph',
    label: 'pH',
    sortable: true,
    format: (value) => {
      const num = typeof value === 'number' ? value : Number(value);
      return !isNaN(num) ? num.toFixed(3) : '-';
    },
    width: '100px',
  },
  {
    key: 'salinity',
    label: 'Salinity (ppt)',
    sortable: true,
    format: (value) => {
      const num = typeof value === 'number' ? value : Number(value);
      return !isNaN(num) ? num.toFixed(4) : '-';
    },
    width: '140px',
  },
];

// Table pagination options
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Default rows per page
export const DEFAULT_ROWS_PER_PAGE = 25; 