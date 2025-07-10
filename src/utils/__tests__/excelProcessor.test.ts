import { describe, it, expect } from 'vitest';
import { processExcelFile, validateExcelFile } from '../excelProcessor';
import * as XLSX from 'xlsx';

// Mock Excel file creation helper
const createMockExcelFile = (data: string[][], filename = 'test.xlsx') => {
  // Create a proper Excel workbook using xlsx
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // Generate Excel file buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  // Create a mock File object that implements arrayBuffer correctly
  const mockFile = {
    name: filename,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: buffer.length,
    lastModified: Date.now(),
    arrayBuffer: () => Promise.resolve(buffer),
  } as File;
  
  return mockFile;
};

describe('excelProcessor - Extended Sensor Variables', () => {
  describe('processExcelFile', () => {
    it('should process Excel file with all 7 sensor variables correctly', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '25.5', '26.8', '82.5', '69.1', '444', '8.04', '33.30'],
        ['2024-01-16', '24.8', '25.9', '78.2', '71.2', '442', '8.05', '33.25'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(2);
      
      // Test first row
      expect(result.data[0]).toEqual({
        Date: expect.any(String),
        Temperature: 25.5,
        'Water Temperature ': 26.8,
        Humidity: 82.5,
        'Ext.Humidity': 69.1,
        CO2: 444,
        pH: 8.04,
        Salinity: 33.30,
      });
      
      // Test second row
      expect(result.data[1]).toEqual({
        Date: expect.any(String),
        Temperature: 24.8,
        'Water Temperature ': 25.9,
        Humidity: 78.2,
        'Ext.Humidity': 71.2,
        CO2: 442,
        pH: 8.05,
        Salinity: 33.25,
      });
    });

    it('should handle alternative header variations', async () => {
      const testData = [
        ['date', 'temp', 'water temp', 'humid', 'ext humidity', 'co2', 'acidity', 'salt'],
        ['2024-01-15', '25.5', '26.8', '82.5', '69.1', '444', '8.04', '33.30'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].Temperature).toBe(25.5);
      expect(result.data[0]['Ext.Humidity']).toBe(69.1);
    });

    it('should validate temperature ranges correctly', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '65.0', '55.0', '82.5', '69.1', '444', '8.04', '33.30'], // Out of range temps
        ['2024-01-16', '-55.0', '-15.0', '78.2', '71.2', '442', '8.05', '33.25'], // Out of range temps
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true); // Still valid but should have warnings
      expect(result.validation.warnings.length).toBeGreaterThan(0);
      expect(result.validation.warnings.some(w => w.includes('Temperature'))).toBe(true);
      expect(result.validation.warnings.some(w => w.includes('Water Temperature'))).toBe(true);
    });

    it('should handle missing values in new variables', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '', '26.8', '82.5', '', '444', '8.04', '33.30'], // Missing temp and ext humidity
        ['2024-01-16', '24.8', '', '78.2', '71.2', '442', '8.05', '33.25'], // Missing water temp
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(2);
      
      // Check that missing values are NaN
      expect(isNaN(result.data[0].Temperature)).toBe(true);
      expect(isNaN(result.data[0]['Ext.Humidity'])).toBe(true);
      expect(result.data[0]['Water Temperature ']).toBe(26.8);
      
      expect(isNaN(result.data[1]['Water Temperature '])).toBe(true);
      expect(result.data[1].Temperature).toBe(24.8);
    });

    it('should validate external humidity range correctly', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '25.5', '26.8', '82.5', '120.0', '444', '8.04', '33.30'], // Ext humidity > 100%
        ['2024-01-16', '24.8', '25.9', '78.2', '-5.0', '442', '8.05', '33.25'], // Ext humidity < 0%
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.validation.warnings.length).toBeGreaterThan(0);
      expect(result.validation.warnings.some(w => w.includes('Ext.Humidity'))).toBe(true);
    });

    it('should handle exact Excel column headers from user data', async () => {
      // Test with the exact headers from the user's Excel file
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['6/29/2025', '25.9', '26.8', '82.8', '69.1', '444', '8.04584', '33.2996'],
        ['6/29/2025', '25.9', '26.8', '82.8', '71.2', '442', '8.0463', '33.2811'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]['Ext.Humidity']).toBe(69.1);
      expect(result.data[1]['Ext.Humidity']).toBe(71.2);
      expect(result.data[0]['Water Temperature ']).toBe(26.8);
    });

    it('should fail validation when required columns are missing', async () => {
      const testData = [
        ['Date', 'Temperature', 'Humidity', 'CO2'], // Missing water temp, ext humidity, pH, salinity
        ['2024-01-15', '25.5', '82.5', '444'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(false);
      expect(result.validation.errors.length).toBeGreaterThan(0);
      expect(result.validation.errors.some(e => e.includes('waterTemperature'))).toBe(true);
      expect(result.validation.errors.some(e => e.includes('externalHumidity'))).toBe(true);
    });

    it('should handle rows with no valid sensor readings but valid date', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '', '', '', '', '', '', ''], // Only date
        ['2024-01-16', '24.8', '25.9', '78.2', '71.2', '442', '8.05', '33.25'], // Full data
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.validation.warnings.some(w => w.includes('No sensor readings found'))).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('validateExcelFile', () => {
    it('should validate file type and size correctly', () => {
      const validFile = new File(['test'], 'test.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const result = validateExcelFile(validFile);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-Excel files', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateExcelFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Excel file');
    });

    it('should reject files that are too large', () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const largeFile = new File([largeContent], 'large.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const result = validateExcelFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10MB');
    });
  });

  describe('Header Mapping Edge Cases', () => {
    it('should handle case-insensitive header matching', async () => {
      const testData = [
        ['DATE', 'TEMPERATURE', 'WATER TEMPERATURE ', 'HUMIDITY', 'EXT.HUMIDITY', 'CO2', 'PH', 'SALINITY'],
        ['2024-01-15', '25.5', '26.8', '82.5', '69.1', '444', '8.04', '33.30'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].Temperature).toBe(25.5);
    });

    it('should handle headers with extra spaces', async () => {
      const testData = [
        [' Date ', ' Temperature ', ' Water Temperature  ', ' Humidity ', ' Ext.Humidity ', ' CO2 ', ' pH ', ' Salinity '],
        ['2024-01-15', '25.5', '26.8', '82.5', '69.1', '444', '8.04', '33.30'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('Data Type Conversion', () => {
    it('should handle numeric strings correctly', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', '25.50', '26.80', '82.50', '69.10', '444.0', '8.040', '33.300'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.data[0].Temperature).toBe(25.5);
      expect(result.data[0]['Water Temperature ']).toBe(26.8);
      expect(result.data[0]['Ext.Humidity']).toBe(69.1);
    });

    it('should handle invalid numeric values gracefully', async () => {
      const testData = [
        ['Date', 'Temperature', 'Water Temperature ', 'Humidity', 'Ext.Humidity', 'CO2', 'pH', 'Salinity'],
        ['2024-01-15', 'invalid', 'N/A', 'null', '-', '444', '8.04', '33.30'],
      ];
      
      const file = createMockExcelFile(testData);
      const result = await processExcelFile(file);
      
      expect(result.validation.isValid).toBe(true);
      expect(isNaN(result.data[0].Temperature)).toBe(true);
      expect(isNaN(result.data[0]['Water Temperature '])).toBe(true);
      expect(isNaN(result.data[0].Humidity)).toBe(true);
      expect(isNaN(result.data[0]['Ext.Humidity'])).toBe(true);
    });
  });
}); 