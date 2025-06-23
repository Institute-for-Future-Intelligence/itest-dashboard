import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  addDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  WaterQualityDataPoint,
  WaterQualityFormData,
  WaterQualityFilters,
  WaterQualityStats,
  WaterQualityValidationResult,
} from '../types/waterQuality';

const WATER_QUALITY_COLLECTION = 'waterQualityData';

export const waterQualityService = {
  /**
   * Add a single water quality data entry
   */
  async addWaterQualityEntry(
    formData: WaterQualityFormData,
    userId: string
  ): Promise<{ id: string; data: WaterQualityDataPoint }> {
    try {
      // Combine date and time into a single timestamp
      const timestamp = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid date or time format');
      }

      // Prepare the data point
      const dataPoint: Omit<WaterQualityDataPoint, 'id'> = {
        timestamp,
        date: formData.date,
        location: formData.location,
        
        // Physical parameters - convert empty strings to 0 or handle appropriately
        temperature: typeof formData.temperature === 'number' ? formData.temperature : 0,
        ph: typeof formData.ph === 'number' ? formData.ph : 0,
        salinity: typeof formData.salinity === 'number' ? formData.salinity : 0,
        conductivity: typeof formData.conductivity === 'number' ? formData.conductivity : 0,
        
        // Nutrients
        nitrate: typeof formData.nitrate === 'number' ? formData.nitrate : 0,
        nitrite: typeof formData.nitrite === 'number' ? formData.nitrite : 0,
        ammonia: typeof formData.ammonia === 'number' ? formData.ammonia : 0,
        phosphate: typeof formData.phosphate === 'number' ? formData.phosphate : 0,
        
        // Optional fields
        ...(formData.potassium && typeof formData.potassium === 'number' && { potassium: formData.potassium }),
        ...(formData.notes && { notes: formData.notes }),
        
        // Metadata
        enteredBy: userId,
        enteredAt: serverTimestamp() as Timestamp,
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, WATER_QUALITY_COLLECTION), dataPoint);

      return {
        id: docRef.id,
        data: {
          id: docRef.id,
          ...dataPoint,
          enteredAt: serverTimestamp() as Timestamp,
        }
      };
    } catch (error) {
      console.error('Error adding water quality entry:', error);
      throw new Error('Failed to save water quality data');
    }
  },

  /**
   * Get water quality data with optional filtering
   */
  async getWaterQualityData(filters: WaterQualityFilters = {}): Promise<WaterQualityDataPoint[]> {
    try {
      const constraints: QueryConstraint[] = [];

      // Location filter
      if (filters.location) {
        constraints.push(where('location', '==', filters.location));
      }

      // Date range filter (using string date field for efficient querying)
      if (filters.dateRange) {
        const startDateStr = filters.dateRange.start.toISOString().split('T')[0];
        const endDateStr = filters.dateRange.end.toISOString().split('T')[0];
        constraints.push(where('date', '>=', startDateStr));
        constraints.push(where('date', '<=', endDateStr));
      }

      // User filter
      if (filters.enteredBy) {
        constraints.push(where('enteredBy', '==', filters.enteredBy));
      }

      // Sorting
      const sortField = filters.sortBy || 'timestamp';
      const sortOrder = filters.sortOrder || 'desc';
      constraints.push(orderBy(sortField, sortOrder));

      // Limit
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      const q = query(collection(db, WATER_QUALITY_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);

      let data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as WaterQualityDataPoint[];

      // Apply client-side range filters (for more complex filtering)
      if (filters.temperatureRange) {
        data = data.filter(
          d => d.temperature >= filters.temperatureRange!.min && d.temperature <= filters.temperatureRange!.max
        );
      }

      if (filters.phRange) {
        data = data.filter(
          d => d.ph >= filters.phRange!.min && d.ph <= filters.phRange!.max
        );
      }

      if (filters.salinityRange) {
        data = data.filter(
          d => d.salinity >= filters.salinityRange!.min && d.salinity <= filters.salinityRange!.max
        );
      }

      if (filters.conductivityRange) {
        data = data.filter(
          d => d.conductivity >= filters.conductivityRange!.min && d.conductivity <= filters.conductivityRange!.max
        );
      }

      if (filters.nitrateRange) {
        data = data.filter(
          d => d.nitrate >= filters.nitrateRange!.min && d.nitrate <= filters.nitrateRange!.max
        );
      }

      if (filters.nitriteRange) {
        data = data.filter(
          d => d.nitrite >= filters.nitriteRange!.min && d.nitrite <= filters.nitriteRange!.max
        );
      }

      if (filters.ammoniaRange) {
        data = data.filter(
          d => d.ammonia >= filters.ammoniaRange!.min && d.ammonia <= filters.ammoniaRange!.max
        );
      }

      if (filters.phosphateRange) {
        data = data.filter(
          d => d.phosphate >= filters.phosphateRange!.min && d.phosphate <= filters.phosphateRange!.max
        );
      }

      return data;
    } catch (error) {
      console.error('Error fetching water quality data:', error);
      throw error;
    }
  },

  /**
   * Get recent water quality data (last 100 entries)
   */
  async getRecentWaterQualityData(): Promise<WaterQualityDataPoint[]> {
    return this.getWaterQualityData({ limit: 100, sortBy: 'timestamp', sortOrder: 'desc' });
  },

  /**
   * Get water quality data statistics
   */
  async getWaterQualityStats(filters: WaterQualityFilters = {}): Promise<WaterQualityStats> {
    try {
      const data = await this.getWaterQualityData({ ...filters, limit: undefined });
      
      if (data.length === 0) {
        throw new Error('No data available for statistics');
      }

      const timestamps = data.map(d => d.timestamp);
      const temperatureValues = data.map(d => d.temperature);
      const phValues = data.map(d => d.ph);
      const salinityValues = data.map(d => d.salinity);
      const conductivityValues = data.map(d => d.conductivity);
      const nitrateValues = data.map(d => d.nitrate);
      const nitriteValues = data.map(d => d.nitrite);
      const ammoniaValues = data.map(d => d.ammonia);
      const phosphateValues = data.map(d => d.phosphate);

      return {
        totalRecords: data.length,
        dateRange: {
          earliest: new Date(Math.min(...timestamps.map(d => d.getTime()))),
          latest: new Date(Math.max(...timestamps.map(d => d.getTime()))),
        },
        averages: {
          temperature: temperatureValues.reduce((a, b) => a + b, 0) / temperatureValues.length,
          ph: phValues.reduce((a, b) => a + b, 0) / phValues.length,
          salinity: salinityValues.reduce((a, b) => a + b, 0) / salinityValues.length,
          conductivity: conductivityValues.reduce((a, b) => a + b, 0) / conductivityValues.length,
          nitrate: nitrateValues.reduce((a, b) => a + b, 0) / nitrateValues.length,
          nitrite: nitriteValues.reduce((a, b) => a + b, 0) / nitriteValues.length,
          ammonia: ammoniaValues.reduce((a, b) => a + b, 0) / ammoniaValues.length,
          phosphate: phosphateValues.reduce((a, b) => a + b, 0) / phosphateValues.length,
        },
        ranges: {
          temperature: { min: Math.min(...temperatureValues), max: Math.max(...temperatureValues) },
          ph: { min: Math.min(...phValues), max: Math.max(...phValues) },
          salinity: { min: Math.min(...salinityValues), max: Math.max(...salinityValues) },
          conductivity: { min: Math.min(...conductivityValues), max: Math.max(...conductivityValues) },
          nitrate: { min: Math.min(...nitrateValues), max: Math.max(...nitrateValues) },
          nitrite: { min: Math.min(...nitriteValues), max: Math.max(...nitriteValues) },
          ammonia: { min: Math.min(...ammoniaValues), max: Math.max(...ammoniaValues) },
          phosphate: { min: Math.min(...phosphateValues), max: Math.max(...phosphateValues) },
        },
      };
    } catch (error) {
      console.error('Error calculating water quality statistics:', error);
      throw error;
    }
  },

  /**
   * Validate water quality form data
   */
  validateFormData(formData: WaterQualityFormData): WaterQualityValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Date validation
    if (!formData.date) {
      errors.push('Date is required');
    } else {
      const date = new Date(formData.date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      } else if (date > new Date()) {
        warnings.push('Date is in the future');
      }
    }

    // Time validation
    if (!formData.time) {
      errors.push('Time is required');
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)) {
      errors.push('Invalid time format (use HH:MM)');
    }

    // Location validation
    if (!formData.location) {
      errors.push('Location is required');
    }

    // Parameter validations with reasonable ranges
    const parameterChecks = [
      { field: 'temperature', value: formData.temperature, min: 0, max: 50, unit: '°C' },
      { field: 'ph', value: formData.ph, min: 0, max: 14, unit: '' },
      { field: 'salinity', value: formData.salinity, min: 0, max: 50, unit: 'ppt' },
      { field: 'conductivity', value: formData.conductivity, min: 0, max: 100000, unit: 'µS/cm' },
      { field: 'nitrate', value: formData.nitrate, min: 0, max: 1000, unit: 'mg/L' },
      { field: 'nitrite', value: formData.nitrite, min: 0, max: 100, unit: 'mg/L' },
      { field: 'ammonia', value: formData.ammonia, min: 0, max: 100, unit: 'mg/L' },
      { field: 'phosphate', value: formData.phosphate, min: 0, max: 100, unit: 'mg/L' },
    ];

    let hasValidData = false;

    parameterChecks.forEach(({ field, value, min, max, unit }) => {
      if (value === '' || value === null || value === undefined) {
        // Empty values are allowed
        return;
      }

      const numValue = typeof value === 'number' ? value : Number(value);
      
      if (isNaN(numValue)) {
        errors.push(`${field} must be a valid number`);
      } else {
        hasValidData = true;
        if (numValue < min || numValue > max) {
          warnings.push(`${field} value ${numValue}${unit} is outside typical range (${min}-${max}${unit})`);
        }
      }
    });

    // Warn if no measurements were entered
    if (!hasValidData) {
      warnings.push('No measurements entered - at least one parameter should be provided');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
}; 