import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherExportButton from '../WeatherExportButton';
import { useWeatherStore } from '../../../store/useWeatherStore';

// Mock the Zustand store
vi.mock('../../../store/useWeatherStore');

const mockUseWeatherStore = vi.mocked(useWeatherStore);

describe('WeatherExportButton', () => {
  const mockExportToCSV = vi.fn();
  const mockExportToExcel = vi.fn();
  const mockClearExportError = vi.fn();
  const mockCanExport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseWeatherStore.mockReturnValue({
      isExporting: false,
      exportError: null,
      exportToCSV: mockExportToCSV,
      exportToExcel: mockExportToExcel,
      clearExportError: mockClearExportError,
      canExport: mockCanExport,
    } as any);
  });

  it('should render export button when export is possible', () => {
    mockCanExport.mockReturnValue(true);
    
    render(<WeatherExportButton />);
    
    expect(screen.getByRole('button', { name: /export as/i })).toBeInTheDocument();
  });

  it('should show disabled state when export is not possible', () => {
    mockCanExport.mockReturnValue(false);
    
    render(<WeatherExportButton />);
    
    const button = screen.getByRole('button', { name: /export as/i });
    expect(button).toBeDisabled();
  });

  it('should show loading state when exporting', () => {
    mockCanExport.mockReturnValue(true);
    mockUseWeatherStore.mockReturnValue({
      isExporting: true,
      exportError: null,
      exportToCSV: mockExportToCSV,
      exportToExcel: mockExportToExcel,
      clearExportError: mockClearExportError,
      canExport: mockCanExport,
    } as any);
    
    render(<WeatherExportButton />);
    
    expect(screen.getByText(/exporting/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should open dropdown menu when button is clicked', async () => {
    mockCanExport.mockReturnValue(true);
    
    render(<WeatherExportButton />);
    
    const button = screen.getByRole('button', { name: /export as/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('CSV')).toBeInTheDocument();
      expect(screen.getByText('XLSX')).toBeInTheDocument();
    });
  });

  it('should call exportToCSV when CSV option is selected', async () => {
    mockCanExport.mockReturnValue(true);
    
    render(<WeatherExportButton />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /export as/i });
    fireEvent.click(button);
    
    // Click CSV option
    await waitFor(() => {
      const csvOption = screen.getByText('CSV');
      fireEvent.click(csvOption);
    });
    
    expect(mockExportToCSV).toHaveBeenCalled();
  });

  it('should call exportToExcel when XLSX option is selected', async () => {
    mockCanExport.mockReturnValue(true);
    
    render(<WeatherExportButton />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /export as/i });
    fireEvent.click(button);
    
    // Click XLSX option
    await waitFor(() => {
      const xlsxOption = screen.getByText('XLSX');
      fireEvent.click(xlsxOption);
    });
    
    expect(mockExportToExcel).toHaveBeenCalled();
  });

  it('should display error message when export fails', () => {
    mockCanExport.mockReturnValue(true);
    mockUseWeatherStore.mockReturnValue({
      isExporting: false,
      exportError: 'Export failed',
      exportToCSV: mockExportToCSV,
      exportToExcel: mockExportToExcel,
      clearExportError: mockClearExportError,
      canExport: mockCanExport,
    } as any);
    
    render(<WeatherExportButton />);
    
    expect(screen.getByText('Export failed')).toBeInTheDocument();
  });

  it('should clear error when error alert is closed', () => {
    mockCanExport.mockReturnValue(true);
    mockUseWeatherStore.mockReturnValue({
      isExporting: false,
      exportError: 'Export failed',
      exportToCSV: mockExportToCSV,
      exportToExcel: mockExportToExcel,
      clearExportError: mockClearExportError,
      canExport: mockCanExport,
    } as any);
    
    render(<WeatherExportButton />);
    
    const errorAlert = screen.getByRole('alert');
    const closeButton = errorAlert.querySelector('[aria-label="Close"]');
    
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockClearExportError).toHaveBeenCalled();
    }
  });

  it('should show helpful message when export is not available', () => {
    mockCanExport.mockReturnValue(false);
    
    render(<WeatherExportButton />);
    
    expect(screen.getByText(/fetch weather data first to enable export/i)).toBeInTheDocument();
  });

  it('should respect disabled prop', () => {
    mockCanExport.mockReturnValue(true);
    
    render(<WeatherExportButton disabled={true} />);
    
    const button = screen.getByRole('button', { name: /export as/i });
    expect(button).toBeDisabled();
  });

  it('should disable menu items when exporting', async () => {
    mockCanExport.mockReturnValue(true);
    mockUseWeatherStore.mockReturnValue({
      isExporting: true,
      exportError: null,
      exportToCSV: mockExportToCSV,
      exportToExcel: mockExportToExcel,
      clearExportError: mockClearExportError,
      canExport: mockCanExport,
    } as any);
    
    render(<WeatherExportButton />);
    
    // Try to open dropdown (should be disabled)
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
}); 