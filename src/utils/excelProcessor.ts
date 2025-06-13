import * as XLSX from 'xlsx';
import type { RawSensorData, ExcelValidationResult } from '../types/sensor';

// Excel column header mappings
const EXPECTED_HEADERS = {
  DATE: ['date', 'datetime', 'timestamp', 'time'],
  HUMIDITY: ['humidity', 'humid', 'rh', 'relative humidity'],
  CO2: ['co2', 'carbon dioxide', 'co₂'],
  PH: ['ph', 'acidity', 'p h'],
  SALINITY: ['salinity', 'salt', 'sal'],
};

/**
 * Process Excel file and extract sensor data
 */
export const processExcelFile = async (file: File): Promise<{
  data: RawSensorData[];
  validation: ExcelValidationResult;
}> => {
  try {
    // Read the Excel file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array',
      cellDates: true, // This tells xlsx to automatically convert Excel dates to JavaScript Date objects
      dateNF: 'yyyy-mm-dd' // Preferred date format
    });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to array of arrays with proper date handling
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '', // Default value for empty cells
      blankrows: false, // Skip blank rows
      dateNF: 'yyyy-mm-dd', // Date format preference
      raw: false // Don't return raw values, use formatted values
    }) as string[][];
    
    if (!rawData || rawData.length === 0) {
      throw new Error('No data found in Excel file');
    }

    // Initialize validation result
    const validation: ExcelValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      rowCount: rawData.length - 1, // Exclude header row
      validRowCount: 0,
    };

    // Extract headers and validate
    const headers = rawData[0];
    if (!headers || headers.length === 0) {
      throw new Error('No headers found in Excel file');
    }

    // Validate and map headers
    const headerMapping = validateAndMapHeaders(headers);
    
    // Process data rows
    const dataRows = rawData.slice(1); // Skip header row
    const processedData: RawSensorData[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // Account for header row and 1-based indexing
      
      // Skip empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) {
        continue;
      }
      
      try {
        const sensorData = extractDataFromRow(row, headerMapping, rowNumber, worksheet, i + 1);
        
        // Validate the extracted data
        const rowValidation = validateSensorDataRow(sensorData, rowNumber);
        validation.errors.push(...rowValidation.errors);
        validation.warnings.push(...rowValidation.warnings);
        
        if (rowValidation.isValid) {
          processedData.push(sensorData);
          validation.validRowCount++;
        }
      } catch (error) {
        validation.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Final validation
    if (processedData.length === 0) {
      validation.isValid = false;
      validation.errors.push('No valid data rows found');
    } else if (validation.errors.length > dataRows.length * 0.5) {
      validation.warnings.push('More than 50% of rows have errors - please check data quality');
    }
    
    return {
      data: processedData,
      validation,
    };
    
  } catch (error) {
    return {
      data: [],
      validation: {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Failed to process Excel file'],
        warnings: [],
        rowCount: 0,
        validRowCount: 0,
      },
    };
  }
};

/**
 * Validate and map Excel headers to expected sensor data fields
 */
const validateAndMapHeaders = (headers: string[]): Record<string, number> => {
  const mapping: Record<string, number> = {};
  const errors: string[] = [];
  
  // Find column indices for each expected field
  const findHeaderIndex = (expectedHeaders: string[], _fieldName: string): number => {
    for (const expectedHeader of expectedHeaders) {
      const index = headers.findIndex(h => 
        h && h.toString().toLowerCase().trim() === expectedHeader.toLowerCase()
      );
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  };
  
  // Map each field
  mapping.date = findHeaderIndex(EXPECTED_HEADERS.DATE, 'Date');
  mapping.humidity = findHeaderIndex(EXPECTED_HEADERS.HUMIDITY, 'Humidity');
  mapping.co2 = findHeaderIndex(EXPECTED_HEADERS.CO2, 'CO2');
  mapping.ph = findHeaderIndex(EXPECTED_HEADERS.PH, 'pH');
  mapping.salinity = findHeaderIndex(EXPECTED_HEADERS.SALINITY, 'Salinity');
  
  // Check for missing required columns
  Object.entries(mapping).forEach(([field, index]) => {
    if (index === -1) {
      errors.push(`Required column '${field}' not found. Available headers: ${headers.join(', ')}`);
    }
  });
  
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
  
  return mapping;
};

/**
 * Parse numeric values from Excel (handles various formats and edge cases)
 */
const parseExcelNumber = (value: any): number => {
  if (value === null || value === undefined) return NaN;
  
  // If already a number
  if (typeof value === 'number') {
    return isFinite(value) ? value : NaN;
  }
  
  // Convert to string and clean up
  const str = String(value).trim();
  if (!str || str === '') return NaN;
  
  // Handle common non-numeric values
  const lowerStr = str.toLowerCase();
  if (['n/a', 'na', 'null', 'undefined', '-', '--', 'none', 'nil', 'empty', ''].includes(lowerStr)) {
    return NaN;
  }
  
  // Remove common formatting characters
  const cleanStr = str
    .replace(/[$€£¥,\s]/g, '') // Remove currency symbols, commas, spaces
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/^[+]/, '') // Remove leading plus sign
    .replace(/[%]/g, ''); // Remove percentage signs
  
  // Try direct parsing
  let parsed = parseFloat(cleanStr);
  
  // Handle special cases
  if (isNaN(parsed)) {
    // Try parsing as scientific notation manually if needed
    const scientificMatch = cleanStr.match(/^(-?\d*\.?\d+)[eE]([+-]?\d+)$/);
    if (scientificMatch) {
      const base = parseFloat(scientificMatch[1]);
      const exponent = parseInt(scientificMatch[2]);
      parsed = base * Math.pow(10, exponent);
    }
  }
  
  // Validate the result
  return isFinite(parsed) ? parsed : NaN;
};

/**
 * Extract sensor data from a row using header mapping
 */
const extractDataFromRow = (
  row: any[], 
  headerMapping: Record<string, number>,
  rowNumber: number,
  worksheet: XLSX.WorkSheet,
  excelRowIndex: number
): RawSensorData => {
  const getValue = (field: keyof typeof headerMapping): any => {
    const index = headerMapping[field];
    if (index === -1 || index >= row.length) {
      throw new Error(`Missing value for ${field}`);
    }
    return row[index];
  };
  
  // Get the raw cell for date to use XLSX's built-in date handling
  const getDateFromCell = (field: keyof typeof headerMapping): string => {
    const index = headerMapping[field];
    if (index === -1) {
      throw new Error(`Missing value for ${field}`);
    }
    
    // Get the cell address (e.g., "A2", "B3")
    const cellAddress = XLSX.utils.encode_cell({ c: index, r: excelRowIndex });
    const cell = worksheet[cellAddress];
    
    if (!cell) {
      throw new Error(`No cell data for ${field}`);
    }
    
    // If XLSX detected this as a date, use the value directly
    if (cell.t === 'd' && cell.v instanceof Date) {
      return cell.v.toISOString();
    }
    
    // If it's a number that might be an Excel serial date
    if (cell.t === 'n' && typeof cell.v === 'number') {
      // Use XLSX's built-in date conversion
      try {
        const excelDate = XLSX.SSF.parse_date_code(cell.v);
        if (excelDate) {
          const jsDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d, excelDate.H || 0, excelDate.M || 0, excelDate.S || 0);
          return jsDate.toISOString();
        }
      } catch (e) {
        // Fall back to treating as text
      }
    }
    
    // Fall back to the formatted value
    return String(cell.w || cell.v || '').trim();
  };
  
  try {
    return {
      Date: getDateFromCell('date'),
      Humidity: parseExcelNumber(getValue('humidity')),
      CO2: parseExcelNumber(getValue('co2')),
      pH: parseExcelNumber(getValue('ph')),
      Salinity: parseExcelNumber(getValue('salinity')),
    };
  } catch (error) {
    throw new Error(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Data extraction failed'}`);
  }
};

/**
 * Validate a single row of sensor data
 */
const validateSensorDataRow = (data: RawSensorData, rowNumber: number): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate date
  if (data.Date === null || data.Date === undefined || data.Date === '') {
    errors.push(`Row ${rowNumber}: Date is required`);
  } else {
    // Try to parse the date (should be ISO string from extraction)
    let date: Date | null;
    try {
      date = new Date(data.Date);
      if (isNaN(date.getTime())) {
        date = null;
      }
    } catch {
      date = null;
    }
    
    if (!date) {
      errors.push(`Row ${rowNumber}: Invalid date format '${data.Date}'. Expected formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, or Excel serial number`);
    } else if (date > new Date()) {
      warnings.push(`Row ${rowNumber}: Date is in the future (${date.toISOString().split('T')[0]})`);
    } else if (date.getFullYear() < 2020) {
      warnings.push(`Row ${rowNumber}: Date is quite old (${date.toISOString().split('T')[0]})`);
    }
  }
  
  // Validate numeric values (missing values are allowed for sensor readings)
  const numericValidations = [
    { field: 'Humidity', value: data.Humidity, min: 0, max: 100, unit: '%' },
    { field: 'CO2', value: data.CO2, min: 0, max: 5000, unit: 'ppm' },
    { field: 'pH', value: data.pH, min: 0, max: 14, unit: '' },
    { field: 'Salinity', value: data.Salinity, min: 0, max: 50, unit: 'ppt' },
  ];
  
  // Count how many fields have valid values
  let validFieldCount = 0;
  
  numericValidations.forEach(({ field, value, min, max, unit }) => {
    if (isNaN(value)) {
      // Missing values are allowed for sensor readings - just skip validation
      // Don't count as error, but note in warnings if all fields are missing
    } else if (!isFinite(value)) {
      errors.push(`Row ${rowNumber}: ${field} must be a finite number (found: ${value})`);
    } else {
      validFieldCount++;
      if (value < min || value > max) {
        warnings.push(`Row ${rowNumber}: ${field} value ${value}${unit} is outside typical range (${min}-${max}${unit})`);
      }
    }
  });
  
  // Warn if no sensor readings are present (only date)
  if (validFieldCount === 0) {
    warnings.push(`Row ${rowNumber}: No sensor readings found - only date is available`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};



/**
 * Validate file before processing
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream'
  ];
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    return { isValid: false, error: 'File must be an Excel file (.xlsx or .xls)' };
  }
  
  return { isValid: true };
}; 