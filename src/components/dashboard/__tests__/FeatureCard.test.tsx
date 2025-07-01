import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FeatureCard from '../FeatureCard';
import { Cloud } from '@mui/icons-material';

// Mock MUI theme
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
    },
    shadows: ['none', '0px 2px 4px rgba(0,0,0,0.1)', '0px 4px 8px rgba(0,0,0,0.15)'],
  }),
}));

describe('FeatureCard', () => {
  const mockOnInteraction = vi.fn();
  
  const mockFeatureAvailable = {
    id: 'weather',
    title: 'Weather Data Analysis',
    iconComponent: Cloud,
    description: 'Analyze historical weather data for Hawaii locations using Open Meteo API.',
    features: ['Historical Data Access', 'Multiple Locations', 'Hourly & Daily Variables'],
    path: '/weather',
    permission: 'canAccessWeatherData',
    color: '#2196f3',
    stats: 'Real-time API Data',
    available: true,
  };

  const mockFeatureUnavailable = {
    ...mockFeatureAvailable,
    id: 'sensors',
    title: 'Sensor Data Management',
    available: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Available Feature', () => {
    it('should render feature title and description', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('Weather Data Analysis')).toBeInTheDocument();
      expect(screen.getByText(/Analyze historical weather data/)).toBeInTheDocument();
    });

    it('should render feature stats chip', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('Real-time API Data')).toBeInTheDocument();
    });

    it('should render all feature items', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('• Historical Data Access')).toBeInTheDocument();
      expect(screen.getByText('• Multiple Locations')).toBeInTheDocument();
      expect(screen.getByText('• Hourly & Daily Variables')).toBeInTheDocument();
    });

    it('should render "Explore Data" button when available', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Explore Data/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should have full opacity when available', () => {
      const { container } = render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ opacity: '1' });
    });
  });

  describe('Rendering - Unavailable Feature', () => {
    it('should render "Access Restricted" button when unavailable', () => {
      render(<FeatureCard feature={mockFeatureUnavailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Access Restricted/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should have reduced opacity when unavailable', () => {
      const { container } = render(<FeatureCard feature={mockFeatureUnavailable} onInteraction={mockOnInteraction} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ opacity: '0.6' });
    });
  });

  describe('User Interactions', () => {
    it('should call onInteraction when available feature button is clicked', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Explore Data/i });
      fireEvent.click(button);
      
      expect(mockOnInteraction).toHaveBeenCalledWith(mockFeatureAvailable);
    });

    it('should not call onInteraction when unavailable feature button is clicked', () => {
      render(<FeatureCard feature={mockFeatureUnavailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Access Restricted/i });
      fireEvent.click(button);
      
      // Button is disabled, so click event shouldn't fire
      expect(mockOnInteraction).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should apply correct colors for available features', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Explore Data/i });
      expect(button).toHaveStyle({ backgroundColor: mockFeatureAvailable.color });
    });

    it('should show key features section', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('Key Features:')).toBeInTheDocument();
    });

    it('should render icon component', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      // Cloud icon should be rendered (we can't test the exact icon, but we can test structure)
      const cardContent = screen.getByText('Weather Data Analysis').closest('[class*="MuiCardContent"]');
      expect(cardContent).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button accessibility', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Explore Data/i });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have disabled state for restricted features', () => {
      render(<FeatureCard feature={mockFeatureUnavailable} onInteraction={mockOnInteraction} />);
      
      const button = screen.getByRole('button', { name: /Access Restricted/i });
      expect(button).toBeDisabled();
    });

    it('should have proper heading structure', () => {
      render(<FeatureCard feature={mockFeatureAvailable} onInteraction={mockOnInteraction} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Weather Data Analysis');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty features array', () => {
      const featureWithEmptyFeatures = {
        ...mockFeatureAvailable,
        features: [],
      };
      
      render(<FeatureCard feature={featureWithEmptyFeatures} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('Key Features:')).toBeInTheDocument();
      // Should not crash when features array is empty
    });

    it('should handle long descriptions gracefully', () => {
      const featureWithLongDescription = {
        ...mockFeatureAvailable,
        description: 'This is a very long description that should wrap properly and not break the card layout. '.repeat(10),
      };
      
      render(<FeatureCard feature={featureWithLongDescription} onInteraction={mockOnInteraction} />);
      
      expect(screen.getByText('Weather Data Analysis')).toBeInTheDocument();
      // Should render without layout issues
    });
  });
}); 