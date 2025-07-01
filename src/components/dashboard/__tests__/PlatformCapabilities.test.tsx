import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlatformCapabilities from '../PlatformCapabilities';

// Mock the platform capabilities config
vi.mock('../../../utils/dashboardConfig', () => ({
  PLATFORM_CAPABILITIES: [
    {
      id: 'weather-api',
      title: 'Weather API',
      description: 'Historical data from Open Meteo',
      iconComponent: vi.fn(() => null),
      color: '#2196f3'
    },
    {
      id: 'data-upload',
      title: 'Data Upload',
      description: 'Excel/CSV sensor data import',
      iconComponent: vi.fn(() => null),
      color: '#4caf50'
    },
    {
      id: 'visualization',
      title: 'Visualization',
      description: 'Interactive charts and graphs',
      iconComponent: vi.fn(() => null),
      color: '#ff9800'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Statistical insights and trends',
      iconComponent: vi.fn(() => null),
      color: '#9c27b0'
    }
  ],
}));

describe('PlatformCapabilities', () => {
  describe('Rendering', () => {
    it('should render the section title', () => {
      render(<PlatformCapabilities />);
      
      expect(screen.getByText('Platform Capabilities')).toBeInTheDocument();
    });

    it('should render all platform capabilities', () => {
      render(<PlatformCapabilities />);
      
      expect(screen.getByText('Weather API')).toBeInTheDocument();
      expect(screen.getByText('Data Upload')).toBeInTheDocument();
      expect(screen.getByText('Visualization')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('should render capability descriptions', () => {
      render(<PlatformCapabilities />);
      
      expect(screen.getByText('Historical data from Open Meteo')).toBeInTheDocument();
      expect(screen.getByText('Excel/CSV sensor data import')).toBeInTheDocument();
      expect(screen.getByText('Interactive charts and graphs')).toBeInTheDocument();
      expect(screen.getByText('Statistical insights and trends')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have proper heading structure', () => {
      render(<PlatformCapabilities />);
      
      const heading = screen.getByText('Platform Capabilities');
      expect(heading).toBeInTheDocument();
    });

    it('should render capabilities in a grid layout', () => {
      const { container } = render(<PlatformCapabilities />);
      
      // Check that the component renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper section structure', () => {
      render(<PlatformCapabilities />);
      
      // Component should render as a paper/section
      const section = screen.getByText('Platform Capabilities').closest('[class*="MuiPaper"]');
      expect(section).toBeInTheDocument();
    });

    it('should have readable text hierarchy', () => {
      render(<PlatformCapabilities />);
      
      // Check that all text content is present and accessible
      const titles = ['Weather API', 'Data Upload', 'Visualization', 'Analytics'];
      titles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should render without errors', () => {
      // This test ensures the component doesn't break with responsive grid props
      const { container } = render(<PlatformCapabilities />);
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle varying content lengths', () => {
      render(<PlatformCapabilities />);
      
      // All capabilities should render regardless of description length
      expect(screen.getByText('Historical data from Open Meteo')).toBeInTheDocument();
      expect(screen.getByText('Excel/CSV sensor data import')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should render icon for section title', () => {
      render(<PlatformCapabilities />);
      
      // The Assessment icon should be rendered alongside the title
      const titleSection = screen.getByText('Platform Capabilities').closest('h6');
      expect(titleSection).toBeInTheDocument();
    });

    it('should render each capability with consistent structure', () => {
      render(<PlatformCapabilities />);
      
      // Each capability should have a title and description
      const capabilities = ['Weather API', 'Data Upload', 'Visualization', 'Analytics'];
      
      capabilities.forEach(capability => {
        const title = screen.getByText(capability);
        expect(title).toBeInTheDocument();
        
        // Title should be in an h6 element
        expect(title.tagName).toBe('H6');
      });
    });
  });
}); 