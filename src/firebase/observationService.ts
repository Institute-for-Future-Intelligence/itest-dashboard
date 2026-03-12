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
  SeaweedObservation,
  ObservationFormData,
  ObservationFilters,
  ObservationValidationResult,
} from '../types/observation';

const OBSERVATIONS_COLLECTION = 'seaweedObservations';

export const observationService = {
  /**
   * Add a single seaweed observation entry
   */
  async addObservation(
    formData: ObservationFormData,
    userId: string
  ): Promise<{ id: string; data: SeaweedObservation }> {
    try {
      const timestamp = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid date or time format');
      }

      const dataPoint: Omit<SeaweedObservation, 'id'> = {
        timestamp,
        date: formData.date,
        species: formData.species,
        location: formData.location,
        observer: formData.observer,
        enteredBy: userId,
        enteredAt: serverTimestamp() as Timestamp,

        // Biomass
        ...(formData.wetMassGrams !== '' && { wetMassGrams: Number(formData.wetMassGrams) }),

        // Water quality
        ...(formData.salinity !== ''        && { salinity: Number(formData.salinity) }),
        ...(formData.temperature !== ''     && {
          temperature: Number(formData.temperature),
          temperatureUnit: formData.temperatureUnit,
        }),
        ...(formData.ph !== ''              && { ph: Number(formData.ph) }),
        ...(formData.dissolvedOxygen !== '' && { dissolvedOxygen: Number(formData.dissolvedOxygen) }),

        // Container
        ...(formData.containerVolume !== '' && {
          containerVolume: Number(formData.containerVolume),
          containerVolumeUnit: formData.containerVolumeUnit,
        }),

        // Lighting (only persist if at least one light value is set)
        ...(formData.lightWhitePercent !== '' || formData.lightRedPercent !== '' || formData.lightBluePercent !== ''
          ? {
              ...(formData.lightScheduleStart && { lightScheduleStart: formData.lightScheduleStart }),
              ...(formData.lightScheduleEnd   && { lightScheduleEnd:   formData.lightScheduleEnd }),
              ...(formData.lightWhitePercent !== '' && { lightWhitePercent: Number(formData.lightWhitePercent) }),
              ...(formData.lightRedPercent   !== '' && { lightRedPercent:   Number(formData.lightRedPercent) }),
              ...(formData.lightBluePercent  !== '' && { lightBluePercent:  Number(formData.lightBluePercent) }),
            }
          : {}),

        // Interventions
        ...(formData.waterExchangePercent !== '' && { waterExchangePercent: Number(formData.waterExchangePercent) }),
        ...(formData.waterExchangeSource  && { waterExchangeSource: formData.waterExchangeSource }),
        ...(formData.nutrientsAdded       && { nutrientsAdded: formData.nutrientsAdded }),

        // Qualitative
        ...(formData.colorDescription && { colorDescription: formData.colorDescription }),
        ...(formData.healthNotes      && { healthNotes:      formData.healthNotes }),
        ...(formData.generalNotes     && { generalNotes:     formData.generalNotes }),

        // Data quality
        ...(formData.sensorIssuesNoted && { sensorIssuesNoted: true }),
        dataReliability: formData.dataReliability,
      };

      const docRef = await addDoc(collection(db, OBSERVATIONS_COLLECTION), dataPoint);
      return {
        id: docRef.id,
        data: { id: docRef.id, ...dataPoint },
      };
    } catch (error) {
      console.error('Error adding observation:', error);
      throw new Error('Failed to save observation');
    }
  },

  /**
   * Fetch observations with optional filters
   */
  async getObservations(filters: ObservationFilters = {}): Promise<SeaweedObservation[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters.species) {
        constraints.push(where('species', '==', filters.species));
      }
      if (filters.location) {
        constraints.push(where('location', '==', filters.location));
      }
      if (filters.enteredBy) {
        constraints.push(where('enteredBy', '==', filters.enteredBy));
      }
      if (filters.dataReliability) {
        constraints.push(where('dataReliability', '==', filters.dataReliability));
      }
      if (filters.dateRange) {
        constraints.push(where('date', '>=', filters.dateRange.start.toISOString().split('T')[0]));
        constraints.push(where('date', '<=', filters.dateRange.end.toISOString().split('T')[0]));
      }

      const sortField = filters.sortBy ?? 'date';
      const sortOrder = filters.sortOrder ?? 'desc';
      constraints.push(orderBy(sortField as string, sortOrder));

      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      const q = query(collection(db, OBSERVATIONS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() ?? new Date(),
      })) as SeaweedObservation[];
    } catch (error) {
      console.error('Error fetching observations:', error);
      throw error;
    }
  },

  /**
   * Fetch all observations ordered by date ascending (for growth charts)
   */
  async getAllObservationsChronological(): Promise<SeaweedObservation[]> {
    return this.getObservations({ sortBy: 'date', sortOrder: 'asc', limit: 500 });
  },

  /**
   * Validate observation form data
   */
  validateFormData(formData: ObservationFormData): ObservationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!formData.date) {
      errors.push('Date is required');
    } else {
      const d = new Date(formData.date);
      if (isNaN(d.getTime())) errors.push('Invalid date format');
      else if (d > new Date()) warnings.push('Date is in the future');
    }

    if (!formData.time) {
      errors.push('Time is required');
    } else if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(formData.time)) {
      errors.push('Invalid time format (use HH:MM)');
    }

    if (!formData.species) errors.push('Species is required');
    if (!formData.location) errors.push('Location is required');
    if (!formData.observer.trim()) errors.push('Observer name is required');

    const numericChecks: { label: string; value: number | ''; min: number; max: number; unit: string }[] = [
      { label: 'Wet mass', value: formData.wetMassGrams, min: 0, max: 100000, unit: 'g' },
      { label: 'Salinity', value: formData.salinity, min: 0, max: 60, unit: 'ppt' },
      { label: 'pH', value: formData.ph, min: 0, max: 14, unit: '' },
      { label: 'Dissolved oxygen', value: formData.dissolvedOxygen, min: 0, max: 20, unit: 'mg/L' },
      { label: 'Container volume', value: formData.containerVolume, min: 0, max: 10000, unit: '' },
      { label: 'Water exchange', value: formData.waterExchangePercent, min: 0, max: 100, unit: '%' },
      { label: 'White light', value: formData.lightWhitePercent, min: 0, max: 100, unit: '%' },
      { label: 'Red light', value: formData.lightRedPercent, min: 0, max: 100, unit: '%' },
      { label: 'Blue light', value: formData.lightBluePercent, min: 0, max: 100, unit: '%' },
    ];

    const tempValue = formData.temperature;
    if (tempValue !== '') {
      const [minT, maxT] = formData.temperatureUnit === 'F' ? [32, 120] : [0, 45];
      if (Number(tempValue) < minT || Number(tempValue) > maxT) {
        warnings.push(`Temperature ${tempValue}°${formData.temperatureUnit} is outside expected range`);
      }
    }

    numericChecks.forEach(({ label, value, min, max, unit }) => {
      if (value === '') return;
      const n = Number(value);
      if (isNaN(n)) {
        errors.push(`${label} must be a valid number`);
      } else if (n < min || n > max) {
        warnings.push(`${label} (${n}${unit}) is outside expected range ${min}–${max}${unit}`);
      }
    });

    // Warn if pH is suspiciously low (known sensor issue from emails)
    if (formData.ph !== '' && Number(formData.ph) < 6) {
      warnings.push('pH is very low — verify with a separate sensor. Growth Chamber sensors are known to give erroneous low readings.');
    }

    const hasSomeMeasurement =
      formData.wetMassGrams !== '' ||
      formData.salinity !== '' ||
      formData.temperature !== '' ||
      formData.ph !== '' ||
      formData.dissolvedOxygen !== '';

    if (!hasSomeMeasurement) {
      warnings.push('No measurements entered — at least one should be provided');
    }

    return { isValid: errors.length === 0, errors, warnings };
  },
};
