import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WaterQualityForm from '../WaterQualityForm';

// Mock the hook to provide controlled test data
vi.mock('../../../hooks/useWaterQualityForm', () => ({
  useWaterQualityForm: () => ({
    formData: {
      date: '',
      time: '',
      location: '',
      coordinates: '',
      temperature: '',
      ph: '',
      salinity: '',
      conductivity: '',
      nitrate: '',
      nitrite: '',
      ammonia: '',
      phosphate: '',
      potassium: '',
      notes: '',
    },
    isSubmitting: false,
    validation: null,
    submitError: null,
    submitSuccess: false,
    showDraftSaved: false,
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    handleReset: vi.fn(),
    clearFormMessages: vi.fn(),
  }),
}));

// Mock location config
vi.mock('../../../utils/locationConfig', () => ({
  WATER_QUALITY_LOCATIONS: [
    {
      id: 'afrc',
      name: 'AFRC',
      fullName: 'Anuenue Fisheries Research Center',
      coordinates: { latitude: 21.3099, longitude: -157.8581 },
      mapUrl: 'https://maps.google.com/?q=21.3099,-157.8581'
    },
  ]
}));

describe('WaterQualityForm Integration Tests', () => {
  describe('Basic Rendering', () => {
    it('should render the water quality form', () => {
      render(<WaterQualityForm />);
      
      // Check that the form header is present
      expect(screen.getByText('Add Water Quality Data')).toBeInTheDocument();
    });

    it('should render form section titles', () => {
      render(<WaterQualityForm />);
      
      // Check section headers with correct names
      expect(screen.getByText('Date & Time')).toBeInTheDocument();
      expect(screen.getByText('Monitoring Location')).toBeInTheDocument();
      expect(screen.getByText('Physical Parameters')).toBeInTheDocument();
      expect(screen.getByText('Nutrients (mg/L)')).toBeInTheDocument();
      expect(screen.getByText('Optional Fields')).toBeInTheDocument();
    });

    it('should render main form fields', () => {
      render(<WaterQualityForm />);
      
      // Check key form fields exist with correct labels
      expect(screen.getByLabelText(/Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Time/)).toBeInTheDocument();
      // Location is a Select component, check by role instead
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByLabelText(/Temperature/)).toBeInTheDocument();
      expect(screen.getByLabelText(/pH/)).toBeInTheDocument();
    });

    it('should render form action buttons', () => {
      render(<WaterQualityForm />);
      
      // Check buttons exist with correct names
      expect(screen.getByRole('button', { name: /Save Data/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Form/i })).toBeInTheDocument();
    });
  });

  describe('Form Structure', () => {
    it('should have proper form structure', () => {
      render(<WaterQualityForm />);
      
      // Check form element exists (using querySelector since it's a Box component="form")
      const formElement = document.querySelector('form');
      expect(formElement).toBeInTheDocument();
      
      // Check submit button
      const submitButton = screen.getByRole('button', { name: /Save Data/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should organize fields in logical sections', () => {
      render(<WaterQualityForm />);
      
      // Verify sections are present and organized
      const dateSection = screen.getByText('Date & Time');
      const locationSection = screen.getByText('Monitoring Location');
      const parametersSection = screen.getByText('Physical Parameters');
      
      expect(dateSection).toBeInTheDocument();
      expect(locationSection).toBeInTheDocument();
      expect(parametersSection).toBeInTheDocument();
    });
  });

  describe('Field Types', () => {
    it('should render appropriate input types', () => {
      render(<WaterQualityForm />);
      
      // Check that numeric fields have number type
      const temperatureField = screen.getByLabelText(/Temperature/);
      const phField = screen.getByLabelText(/pH/);
      
      expect(temperatureField).toHaveAttribute('type', 'number');
      expect(phField).toHaveAttribute('type', 'number');
    });

    it('should render text areas for notes', () => {
      render(<WaterQualityForm />);
      
      // Check that notes field is a textarea
      const notesField = screen.getByLabelText(/Notes & Observations/);
      expect(notesField.tagName).toBe('TEXTAREA');
    });

    it('should render date and time inputs', () => {
      render(<WaterQualityForm />);
      
      // Check date and time field types
      const dateField = screen.getByLabelText(/Date/);
      const timeField = screen.getByLabelText(/Time/);
      
      expect(dateField).toHaveAttribute('type', 'date');
      expect(timeField).toHaveAttribute('type', 'time');
    });
  });
});

describe('Form State Tests', () => {
  it('should render without crashing when no data', () => {
    expect(() => render(<WaterQualityForm />)).not.toThrow();
  });

  it('should handle form rendering with empty initial state', () => {
    render(<WaterQualityForm />);
    
    // Verify form renders with empty values
    const dateField = screen.getByLabelText(/Date/);
    const temperatureField = screen.getByLabelText(/Temperature/);
    
    expect(dateField).toHaveValue('');
    expect(temperatureField).toHaveValue(null);
  });

  it('should display form header and description', () => {
    render(<WaterQualityForm />);
    
    // Check main title and description
    expect(screen.getByText('Add Water Quality Data')).toBeInTheDocument();
    expect(screen.getByText(/Record water quality measurements/)).toBeInTheDocument();
  });
});

describe('Basic Functionality', () => {
  it('should render all required form sections', () => {
    render(<WaterQualityForm />);
    
    // Test that all major sections are rendered with correct names
    const sections = [
      'Date & Time',
      'Monitoring Location', 
      'Physical Parameters',
      'Nutrients (mg/L)',
      'Optional Fields'
    ];
    
    sections.forEach(section => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });

  it('should handle form component mounting', () => {
    // This test ensures the component mounts without errors
    const { unmount } = render(<WaterQualityForm />);
    
    // Form should be mounted (check by header presence)
    expect(screen.getByText('Add Water Quality Data')).toBeInTheDocument();
    
    // Should unmount cleanly
    expect(() => unmount()).not.toThrow();
  });

  it('should render all parameter fields', () => {
    render(<WaterQualityForm />);
    
    // Check that all major parameter fields are present
    expect(screen.getByLabelText(/Temperature/)).toBeInTheDocument();
    expect(screen.getByLabelText(/pH/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salinity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Conductivity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nitrate/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nitrite/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ammonia/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phosphate/)).toBeInTheDocument();
  });

  it('should render submit button in disabled state initially', () => {
    render(<WaterQualityForm />);
    
    // Submit button should be disabled when form is not valid
    const submitButton = screen.getByRole('button', { name: /Save Data/i });
    expect(submitButton).toBeDisabled();
  });
}); 