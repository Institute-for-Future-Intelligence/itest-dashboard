import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  QueryConstraint,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  SensorDataPoint,
  SensorDataUpload,
  SensorDataFilters,
  SensorDataStats,
  RawSensorData,
} from '../types/sensor';

const SENSOR_DATA_COLLECTION = 'sensorData';
const SENSOR_UPLOADS_COLLECTION = 'sensorUploads';

// Performance optimization constants
const DEFAULT_LIMIT = 1000; // Reasonable default to prevent loading all 17k records
const RECENT_DAYS_DEFAULT = 30; // Default to last 30 days for better performance

// New interface for duplicate detection results
export interface DuplicateDetectionResult {
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
}

// New interface for upload options
export interface UploadOptions {
  skipDuplicates?: boolean;
  overwriteDuplicates?: boolean;
  location: string;
  fileName: string;
  uploadedBy: string;
}

export const sensorService = {
  /**
   * Check for duplicate data before upload - optimized to check upload history first
   */
  async checkForDuplicates(
    rawData: RawSensorData[],
    location: string
  ): Promise<DuplicateDetectionResult> {
    try {
      // Process the raw data to get timestamps
      const processedData = rawData
        .map((row, index) => {
          const timestamp = new Date(row.Date);
          if (isNaN(timestamp.getTime())) return null;
          return { timestamp, rowIndex: index };
        })
        .filter(Boolean) as Array<{ timestamp: Date; rowIndex: number }>;

      if (processedData.length === 0) {
        return {
          hasDuplicates: false,
          duplicateCount: 0,
          newDataCount: 0,
          duplicateEntries: [],
          dateRange: { start: new Date(), end: new Date() }
        };
      }

      // Get date range for the upload
      const timestamps = processedData.map(d => d.timestamp);
      const startDate = new Date(Math.min(...timestamps.map(d => d.getTime())));
      const endDate = new Date(Math.max(...timestamps.map(d => d.getTime())));

      // STEP 1: Check upload history first for overlapping date ranges
      // This is much more efficient than checking individual sensor data documents
      const uploadHistoryQuery = query(
        collection(db, SENSOR_UPLOADS_COLLECTION),
        where('location', '==', location),
        where('status', '==', 'completed'), // Only check successful uploads
        orderBy('uploadedAt', 'desc'),
        limit(50) // Check recent uploads
      );

      const uploadHistorySnapshot = await getDocs(uploadHistoryQuery);
      const overlappingUploads = uploadHistorySnapshot.docs.filter(doc => {
        const uploadData = doc.data();
        const uploadStart = new Date(uploadData.dateRange.start);
        const uploadEnd = new Date(uploadData.dateRange.end);
        
        // Check if date ranges overlap
        return (startDate <= uploadEnd && endDate >= uploadStart);
      });

      // If no overlapping uploads found, no duplicates possible
      if (overlappingUploads.length === 0) {
        return {
          hasDuplicates: false,
          duplicateCount: 0,
          newDataCount: processedData.length,
          duplicateEntries: [],
          dateRange: { start: startDate, end: endDate }
        };
      }

      // STEP 2: Only if overlapping uploads exist, check actual sensor data
      console.log(`Found ${overlappingUploads.length} overlapping uploads, checking for exact duplicates...`);
      
      // Query existing data in the same date range and location
      const existingDataQuery = query(
        collection(db, SENSOR_DATA_COLLECTION),
        where('location', '==', location),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0])
      );

      const existingSnapshot = await getDocs(existingDataQuery);
      const existingData = existingSnapshot.docs.map(doc => ({
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));

      // Check for duplicates (same timestamp within 1 minute tolerance)
      const duplicateEntries: DuplicateDetectionResult['duplicateEntries'] = [];
      const TOLERANCE_MS = 60000; // 1 minute tolerance

      processedData.forEach(({ timestamp, rowIndex }) => {
        const duplicate = existingData.find(existing => 
          Math.abs(existing.timestamp.getTime() - timestamp.getTime()) < TOLERANCE_MS
        );
        
        if (duplicate) {
          duplicateEntries.push({
            timestamp,
            existingId: duplicate.id,
            rowIndex
          });
        }
      });

      return {
        hasDuplicates: duplicateEntries.length > 0,
        duplicateCount: duplicateEntries.length,
        newDataCount: processedData.length - duplicateEntries.length,
        duplicateEntries,
        dateRange: { start: startDate, end: endDate }
      };

    } catch (error) {
      console.error('Error checking for duplicates:', error);
      throw new Error('Failed to check for duplicate data');
    }
  },

  /**
   * Upload sensor data in batches with duplicate handling
   */
  async uploadSensorData(
    rawData: RawSensorData[],
    fileName: string,
    uploadedBy: string,
    location: string,
    options: { skipDuplicates?: boolean; overwriteDuplicates?: boolean } = {}
  ): Promise<{ uploadId: string; processedCount: number; skippedCount?: number; overwrittenCount?: number }> {
    const batch = writeBatch(db);
    const uploadId = doc(collection(db, SENSOR_UPLOADS_COLLECTION)).id;
    
    try {
      // Check for duplicates first if options are provided
      let duplicateInfo: DuplicateDetectionResult | null = null;
      if (options.skipDuplicates || options.overwriteDuplicates) {
        duplicateInfo = await this.checkForDuplicates(rawData, location);
      }

      // Process and validate the raw data
      const processedData: Array<Omit<SensorDataPoint, 'id'> & { rowIndex: number; isDuplicate?: boolean; existingId?: string }> = [];
      const errors: string[] = [];
      
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        try {
          // Parse date (should already be ISO string from Excel processor)
          const timestamp = new Date(row.Date);
          if (isNaN(timestamp.getTime())) {
            errors.push(`Row ${i + 1}: Invalid date format '${row.Date}'`);
            continue;
          }

          // Check if at least one numeric value is valid
          const hasValidData = !isNaN(row.Humidity) || !isNaN(row.CO2) || !isNaN(row.pH) || !isNaN(row.Salinity) || 
                               !isNaN(row.Temperature) || !isNaN(row['Water Temperature ']) || !isNaN(row['Ext.Humidity']);
          if (!hasValidData) {
            errors.push(`Row ${i + 1}: No valid sensor readings found`);
            continue;
          }

          // Check if this row is a duplicate
          const duplicateEntry = duplicateInfo?.duplicateEntries.find(d => d.rowIndex === i);
          const isDuplicate = !!duplicateEntry;

          // Create data point with only valid numeric values (NaN values are omitted)
          const dataPoint = {
            timestamp,
            date: timestamp.toISOString().split('T')[0], // YYYY-MM-DD format for querying
            location,
            uploadedBy,
            uploadedAt: serverTimestamp() as Timestamp,
            rowIndex: i,
            isDuplicate,
            existingId: duplicateEntry?.existingId,
            humidity: NaN, // Will be overwritten if valid
            co2: NaN, // Will be overwritten if valid
            ph: NaN, // Will be overwritten if valid
            salinity: NaN, // Will be overwritten if valid
            temperature: NaN, // Will be overwritten if valid
            waterTemperature: NaN, // Will be overwritten if valid
            externalHumidity: NaN, // Will be overwritten if valid
          };

          // Only include numeric fields that have valid values
          if (!isNaN(row.Humidity)) dataPoint.humidity = Number(row.Humidity);
          if (!isNaN(row.CO2)) dataPoint.co2 = Number(row.CO2);
          if (!isNaN(row.pH)) dataPoint.ph = Number(row.pH);
          if (!isNaN(row.Salinity)) dataPoint.salinity = Number(row.Salinity);
          if (!isNaN(row.Temperature)) dataPoint.temperature = Number(row.Temperature);
          if (!isNaN(row['Water Temperature '])) dataPoint.waterTemperature = Number(row['Water Temperature ']);
          if (!isNaN(row['Ext.Humidity'])) dataPoint.externalHumidity = Number(row['Ext.Humidity']);

          processedData.push(dataPoint);
        } catch (error) {
          errors.push(`Row ${i + 1}: Processing error - ${error}`);
        }
      }

      if (processedData.length === 0) {
        throw new Error('No valid data rows found');
      }

      // Filter data based on duplicate handling options
      let dataToUpload = processedData;
      let skippedCount = 0;
      let overwrittenCount = 0;

      if (options.skipDuplicates) {
        const nonDuplicates = processedData.filter(d => !d.isDuplicate);
        skippedCount = processedData.length - nonDuplicates.length;
        dataToUpload = nonDuplicates;
      } else if (options.overwriteDuplicates) {
        overwrittenCount = processedData.filter(d => d.isDuplicate).length;
        // Keep all data, but we'll handle overwrites in the batch operations
      }

      // Create upload record
      const dateRange = {
        start: Math.min(...processedData.map(d => d.timestamp.getTime())),
        end: Math.max(...processedData.map(d => d.timestamp.getTime())),
      };

      const uploadRecord: Omit<SensorDataUpload, 'id'> = {
        uploadedBy,
        uploadedAt: serverTimestamp() as Timestamp,
        fileName,
        location,
        recordCount: dataToUpload.length,
        dateRange: {
          start: new Date(dateRange.start).toISOString(),
          end: new Date(dateRange.end).toISOString(),
        },
        status: 'processing',
      };

      const uploadRef = doc(db, SENSOR_UPLOADS_COLLECTION, uploadId);
      batch.set(uploadRef, uploadRecord);

      // Add sensor data points in batches (Firestore has a 500 operation limit per batch)
      const BATCH_SIZE = 450; // Leave some room for the upload record
      const batches = [];
      
      for (let i = 0; i < dataToUpload.length; i += BATCH_SIZE) {
        const batchData = dataToUpload.slice(i, i + BATCH_SIZE);
        const currentBatch = writeBatch(db);
        
        batchData.forEach((dataPoint) => {
          // Remove helper fields before saving
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { isDuplicate, existingId, rowIndex, ...cleanDataPoint } = dataPoint;
          
          if (options.overwriteDuplicates && isDuplicate && existingId) {
            // Update existing document
            const existingRef = doc(db, SENSOR_DATA_COLLECTION, existingId);
            currentBatch.update(existingRef, cleanDataPoint);
          } else if (!isDuplicate || !options.skipDuplicates) {
            // Create new document
            const docRef = doc(collection(db, SENSOR_DATA_COLLECTION));
            currentBatch.set(docRef, cleanDataPoint);
          }
        });
        
        batches.push(currentBatch);
      }

      // Execute all batches
      await batch.commit(); // Upload record first
      
      for (const batch of batches) {
        await batch.commit();
      }

      // Update upload status to completed
      const completeBatch = writeBatch(db);
      completeBatch.update(uploadRef, { status: 'completed' });
      await completeBatch.commit();

      return {
        uploadId,
        processedCount: dataToUpload.length,
        skippedCount: options.skipDuplicates ? skippedCount : undefined,
        overwrittenCount: options.overwriteDuplicates ? overwrittenCount : undefined,
      };

    } catch (error) {
      // Update upload status to failed
      const failBatch = writeBatch(db);
      const uploadRef = doc(db, SENSOR_UPLOADS_COLLECTION, uploadId);
      failBatch.update(uploadRef, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      await failBatch.commit();
      
      throw error;
    }
  },

  /**
   * Get sensor data with filtering and pagination - OPTIMIZED FOR PERFORMANCE
   */
  async getSensorData(filters: SensorDataFilters = {}): Promise<SensorDataPoint[]> {
    try {
      const constraints: QueryConstraint[] = [];
      
      // PERFORMANCE: Apply smart defaults to reduce query size
      const effectiveFilters = {
        ...filters,
        // Default to recent data if no date range specified
        dateRange: filters.dateRange || {
          start: new Date(Date.now() - (RECENT_DAYS_DEFAULT * 24 * 60 * 60 * 1000)),
          end: new Date()
        },
        // Apply reasonable default limit to prevent loading all 17k records
        limit: filters.limit || DEFAULT_LIMIT
      };
      
      // Add date range filter (now always present due to smart defaults)
      if (effectiveFilters.dateRange) {
        constraints.push(
          where('date', '>=', effectiveFilters.dateRange.start.toISOString().split('T')[0]),
          where('date', '<=', effectiveFilters.dateRange.end.toISOString().split('T')[0])
        );
      }
      
      if (effectiveFilters.location) {
        constraints.push(where('location', '==', effectiveFilters.location));
      }
      
      if (effectiveFilters.uploadedBy) {
        constraints.push(where('uploadedBy', '==', effectiveFilters.uploadedBy));
      }

      // Add sorting
      const sortField = effectiveFilters.sortBy || 'timestamp';
      const sortDirection = effectiveFilters.sortOrder || 'desc';
      constraints.push(orderBy(sortField, sortDirection));

      // PERFORMANCE: Always apply limit to prevent excessive reads
      constraints.push(limit(effectiveFilters.limit));

      const q = query(collection(db, SENSOR_DATA_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const data: SensorDataPoint[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as SensorDataPoint[];

      // Apply client-side filters for numeric ranges (since Firestore doesn't support multiple range queries)
      let filteredData = data;
      
      if (filters.humidityRange) {
        filteredData = filteredData.filter(
          d => d.humidity >= filters.humidityRange!.min && d.humidity <= filters.humidityRange!.max
        );
      }
      
      if (filters.co2Range) {
        filteredData = filteredData.filter(
          d => d.co2 >= filters.co2Range!.min && d.co2 <= filters.co2Range!.max
        );
      }
      
      if (filters.phRange) {
        filteredData = filteredData.filter(
          d => d.ph >= filters.phRange!.min && d.ph <= filters.phRange!.max
        );
      }
      
      if (filters.salinityRange) {
        filteredData = filteredData.filter(
          d => d.salinity >= filters.salinityRange!.min && d.salinity <= filters.salinityRange!.max
        );
      }

      if (filters.temperatureRange) {
        filteredData = filteredData.filter(
          d => d.temperature >= filters.temperatureRange!.min && d.temperature <= filters.temperatureRange!.max
        );
      }

      if (filters.waterTemperatureRange) {
        filteredData = filteredData.filter(
          d => d.waterTemperature >= filters.waterTemperatureRange!.min && d.waterTemperature <= filters.waterTemperatureRange!.max
        );
      }

      if (filters.externalHumidityRange) {
        filteredData = filteredData.filter(
          d => d.externalHumidity >= filters.externalHumidityRange!.min && d.externalHumidity <= filters.externalHumidityRange!.max
        );
      }

      return filteredData;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },

  /**
   * Get sensor data with cursor-based pagination for better performance
   */
  async getSensorDataPaginated(
    filters: SensorDataFilters = {},
    lastDoc?: DocumentSnapshot,
    pageSize: number = 50
  ): Promise<{ data: SensorDataPoint[]; hasMore: boolean; lastDoc?: DocumentSnapshot }> {
    try {
      const constraints: QueryConstraint[] = [];
      
      // Apply smart defaults for better performance
      const effectiveFilters = {
        ...filters,
        dateRange: filters.dateRange || {
          start: new Date(Date.now() - (RECENT_DAYS_DEFAULT * 24 * 60 * 60 * 1000)),
          end: new Date()
        }
      };
      
      // Add date range filter
      if (effectiveFilters.dateRange) {
        constraints.push(
          where('date', '>=', effectiveFilters.dateRange.start.toISOString().split('T')[0]),
          where('date', '<=', effectiveFilters.dateRange.end.toISOString().split('T')[0])
        );
      }
      
      if (effectiveFilters.location) {
        constraints.push(where('location', '==', effectiveFilters.location));
      }
      
      if (effectiveFilters.uploadedBy) {
        constraints.push(where('uploadedBy', '==', effectiveFilters.uploadedBy));
      }

      // Add sorting
      const sortField = effectiveFilters.sortBy || 'timestamp';
      const sortDirection = effectiveFilters.sortOrder || 'desc';
      constraints.push(orderBy(sortField, sortDirection));

      // Add cursor for pagination
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      // Add limit for pagination
      constraints.push(limit(pageSize + 1)); // +1 to check if there are more results

      const q = query(collection(db, SENSOR_DATA_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const docs = querySnapshot.docs;
      const hasMore = docs.length > pageSize;
      const dataSlice = hasMore ? docs.slice(0, pageSize) : docs;
      
      const data: SensorDataPoint[] = dataSlice.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as SensorDataPoint[];

      // Apply client-side filters for numeric ranges
      let filteredData = data;
      
      if (filters.humidityRange) {
        filteredData = filteredData.filter(
          d => d.humidity >= filters.humidityRange!.min && d.humidity <= filters.humidityRange!.max
        );
      }
      
      if (filters.co2Range) {
        filteredData = filteredData.filter(
          d => d.co2 >= filters.co2Range!.min && d.co2 <= filters.co2Range!.max
        );
      }
      
      if (filters.phRange) {
        filteredData = filteredData.filter(
          d => d.ph >= filters.phRange!.min && d.ph <= filters.phRange!.max
        );
      }
      
      if (filters.salinityRange) {
        filteredData = filteredData.filter(
          d => d.salinity >= filters.salinityRange!.min && d.salinity <= filters.salinityRange!.max
        );
      }

      if (filters.temperatureRange) {
        filteredData = filteredData.filter(
          d => d.temperature >= filters.temperatureRange!.min && d.temperature <= filters.temperatureRange!.max
        );
      }

      if (filters.waterTemperatureRange) {
        filteredData = filteredData.filter(
          d => d.waterTemperature >= filters.waterTemperatureRange!.min && d.waterTemperature <= filters.waterTemperatureRange!.max
        );
      }

      if (filters.externalHumidityRange) {
        filteredData = filteredData.filter(
          d => d.externalHumidity >= filters.externalHumidityRange!.min && d.externalHumidity <= filters.externalHumidityRange!.max
        );
      }

      return {
        data: filteredData,
        hasMore: hasMore && filteredData.length === pageSize,
        lastDoc: hasMore ? dataSlice[dataSlice.length - 1] : undefined
      };
    } catch (error) {
      console.error('Error fetching paginated sensor data:', error);
      throw error;
    }
  },

  /**
   * Get recent sensor data (last 100 records)
   */
  async getRecentSensorData(): Promise<SensorDataPoint[]> {
    return this.getSensorData({
      limit: 100,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });
  },

  /**
   * Get sensor data statistics
   */
  async getSensorDataStats(filters: SensorDataFilters = {}): Promise<SensorDataStats> {
    try {
      const data = await this.getSensorData({ ...filters, limit: undefined });
      
      if (data.length === 0) {
        throw new Error('No data available for statistics');
      }

      const timestamps = data.map(d => d.timestamp);
      const humidityValues = data.map(d => d.humidity).filter(v => v != null && !isNaN(v));
      const co2Values = data.map(d => d.co2).filter(v => v != null && !isNaN(v));
      const phValues = data.map(d => d.ph).filter(v => v != null && !isNaN(v));
      const salinityValues = data.map(d => d.salinity).filter(v => v != null && !isNaN(v));
      const temperatureValues = data.map(d => d.temperature).filter(v => v != null && !isNaN(v));
      const waterTemperatureValues = data.map(d => d.waterTemperature).filter(v => v != null && !isNaN(v));
      const externalHumidityValues = data.map(d => d.externalHumidity).filter(v => v != null && !isNaN(v));

      return {
        totalRecords: data.length,
        dateRange: {
          earliest: new Date(Math.min(...timestamps.map(d => d.getTime()))),
          latest: new Date(Math.max(...timestamps.map(d => d.getTime()))),
        },
        averages: {
          humidity: humidityValues.length > 0 ? humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length : 0,
          co2: co2Values.length > 0 ? co2Values.reduce((a, b) => a + b, 0) / co2Values.length : 0,
          ph: phValues.length > 0 ? phValues.reduce((a, b) => a + b, 0) / phValues.length : 0,
          salinity: salinityValues.length > 0 ? salinityValues.reduce((a, b) => a + b, 0) / salinityValues.length : 0,
          temperature: temperatureValues.length > 0 ? temperatureValues.reduce((a, b) => a + b, 0) / temperatureValues.length : 0,
          waterTemperature: waterTemperatureValues.length > 0 ? waterTemperatureValues.reduce((a, b) => a + b, 0) / waterTemperatureValues.length : 0,
          externalHumidity: externalHumidityValues.length > 0 ? externalHumidityValues.reduce((a, b) => a + b, 0) / externalHumidityValues.length : 0,
        },
        ranges: {
          humidity: { min: humidityValues.length > 0 ? Math.min(...humidityValues) : 0, max: humidityValues.length > 0 ? Math.max(...humidityValues) : 0 },
          co2: { min: co2Values.length > 0 ? Math.min(...co2Values) : 0, max: co2Values.length > 0 ? Math.max(...co2Values) : 0 },
          ph: { min: phValues.length > 0 ? Math.min(...phValues) : 0, max: phValues.length > 0 ? Math.max(...phValues) : 0 },
          salinity: { min: salinityValues.length > 0 ? Math.min(...salinityValues) : 0, max: salinityValues.length > 0 ? Math.max(...salinityValues) : 0 },
          temperature: { min: temperatureValues.length > 0 ? Math.min(...temperatureValues) : 0, max: temperatureValues.length > 0 ? Math.max(...temperatureValues) : 0 },
          waterTemperature: { min: waterTemperatureValues.length > 0 ? Math.min(...waterTemperatureValues) : 0, max: waterTemperatureValues.length > 0 ? Math.max(...waterTemperatureValues) : 0 },
          externalHumidity: { min: externalHumidityValues.length > 0 ? Math.min(...externalHumidityValues) : 0, max: externalHumidityValues.length > 0 ? Math.max(...externalHumidityValues) : 0 },
        },
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      throw error;
    }
  },

  /**
   * Get upload history
   */
  async getUploadHistory(): Promise<SensorDataUpload[]> {
    try {
      const q = query(
        collection(db, SENSOR_UPLOADS_COLLECTION),
        orderBy('uploadedAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SensorDataUpload[];
    } catch (error) {
      console.error('Error fetching upload history:', error);
      throw error;
    }
  },

  /**
   * Delete sensor data by upload ID (Admin only)
   */
  async deleteSensorDataByUpload(uploadId: string): Promise<void> {
    try {
      // This would require cloud functions for efficient bulk deletion
      // For now, we'll mark the upload as deleted
      const uploadRef = doc(db, SENSOR_UPLOADS_COLLECTION, uploadId);
      const batch = writeBatch(db);
      batch.update(uploadRef, { status: 'deleted' });
      await batch.commit();
    } catch (error) {
      console.error('Error deleting sensor data:', error);
      throw error;
    }
  },
}; 