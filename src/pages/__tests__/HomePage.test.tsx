import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../HomePage';

// Mock all dashboard components
vi.mock('../../components/dashboard', () => ({
  DashboardHero: vi.fn(({ roleDisplayName }) => (
    <div data-testid="dashboard-hero">Hero: {roleDisplayName}</div>
  )),
  FeatureCard: vi.fn(({ feature, onInteraction }) => (
    <div data-testid={`feature-card-${feature.id}`}>
      <span>{feature.title}</span>
      <button onClick={() => onInteraction(feature)}>
        {feature.available ? 'Explore Data' : 'Access Restricted'}
      </button>
    </div>
  )),
  PlatformCapabilities: vi.fn(() => (
    <div data-testid="platform-capabilities">Platform Capabilities</div>
  )),
  AdminPanel: vi.fn(({ onNavigateToAdmin }) => (
    <div data-testid="admin-panel">
      <button onClick={onNavigateToAdmin}>Access Admin Panel</button>
    </div>
  )),
}));

// Mock the useDashboard hook
vi.mock('../../hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

const mockUseDashboard = vi.mocked(require('../../hooks/useDashboard').useDashboard);

describe('HomePage', () => {
  const mockHandleFeatureInteraction = vi.fn();
  const mockHandleNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock to default values
    mockUseDashboard.mockReturnValue({
      roleDisplayName: 'Student',
      availableFeatures: [
        {
          id: 'weather',
          title: 'Weather Data Analysis',
          iconComponent: vi.fn(),
          description: 'Weather analysis',
          features: ['Feature 1'],
          path: '/weather',
          permission: 'canAccessWeatherData',
          color: '#2196f3',
          stats: 'Real-time',
          available: true,
        },
        {
          id: 'sensors',
          title: 'Sensor Data Management',
          iconComponent: vi.fn(),
          description: 'Sensor management',
          features: ['Feature A'],
          path: '/sensors',
          permission: 'canViewSensorData',
          color: '#4caf50',
          stats: 'Multi-parameter',
          available: false,
        },
      ],
      handleFeatureInteraction: mockHandleFeatureInteraction,
      handleNavigate: mockHandleNavigate,
      isAdmin: false,
    });
  });

  describe('Component Rendering', () => {
    it('should render all main sections', () => {
      render(<HomePage />);
      
      expect(screen.getByTestId('dashboard-hero')).toBeInTheDocument();
      expect(screen.getByTestId('platform-capabilities')).toBeInTheDocument();
      expect(screen.getByTestId('feature-card-weather')).toBeInTheDocument();
      expect(screen.getByTestId('feature-card-sensors')).toBeInTheDocument();
    });

    it('should pass correct roleDisplayName to DashboardHero', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Hero: Student')).toBeInTheDocument();
    });

    it('should render all available features', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Weather Data Analysis')).toBeInTheDocument();
      expect(screen.getByText('Sensor Data Management')).toBeInTheDocument();
    });

    it('should not render admin panel for non-admin users', () => {
      render(<HomePage />);
      
      expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
    });
  });

  describe('Admin User Rendering', () => {
    beforeEach(() => {
      mockUseDashboard.mockReturnValue({
        roleDisplayName: 'Administrator',
        availableFeatures: [
          {
            id: 'weather',
            title: 'Weather Data Analysis',
            iconComponent: vi.fn(),
            description: 'Weather analysis',
            features: ['Feature 1'],
            path: '/weather',
            permission: 'canAccessWeatherData',
            color: '#2196f3',
            stats: 'Real-time',
            available: true,
          },
        ],
        handleFeatureInteraction: mockHandleFeatureInteraction,
        handleNavigate: mockHandleNavigate,
        isAdmin: true,
      });
    });

    it('should render admin panel for admin users', () => {
      render(<HomePage />);
      
      expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
    });

    it('should display admin role in hero', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Hero: Administrator')).toBeInTheDocument();
    });
  });

  describe('Feature Interactions', () => {
    it('should handle feature card interactions', () => {
      render(<HomePage />);
      
      const weatherExploreButton = screen.getByTestId('feature-card-weather').querySelector('button');
      expect(weatherExploreButton).toHaveTextContent('Explore Data');
      
      fireEvent.click(weatherExploreButton!);
      
      expect(mockHandleFeatureInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'weather',
          title: 'Weather Data Analysis',
          available: true,
        })
      );
    });

    it('should show restricted access for unavailable features', () => {
      render(<HomePage />);
      
      const sensorsButton = screen.getByTestId('feature-card-sensors').querySelector('button');
      expect(sensorsButton).toHaveTextContent('Access Restricted');
    });

    it('should handle admin panel navigation', () => {
      // Set up admin user
      mockUseDashboard.mockReturnValue({
        roleDisplayName: 'Administrator',
        availableFeatures: [],
        handleFeatureInteraction: mockHandleFeatureInteraction,
        handleNavigate: mockHandleNavigate,
        isAdmin: true,
      });

      render(<HomePage />);
      
      const adminButton = screen.getByText('Access Admin Panel');
      fireEvent.click(adminButton);
      
      expect(mockHandleNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  describe('Responsive Layout', () => {
    it('should render with container and proper layout', () => {
      const { container } = render(<HomePage />);
      
      // Check for main container
      const mainContainer = container.querySelector('[class*="MuiContainer"]');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render features in grid layout', () => {
      const { container } = render(<HomePage />);
      
      // Features should be rendered
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should pass correct props to FeatureCard components', () => {
      render(<HomePage />);
      
      // Both feature cards should be rendered
      expect(screen.getByTestId('feature-card-weather')).toBeInTheDocument();
      expect(screen.getByTestId('feature-card-sensors')).toBeInTheDocument();
    });

    it('should maintain component composition', () => {
      render(<HomePage />);
      
      // All major components should be present
      const hero = screen.getByTestId('dashboard-hero');
      const capabilities = screen.getByTestId('platform-capabilities');
      const weatherCard = screen.getByTestId('feature-card-weather');
      
      expect(hero).toBeInTheDocument();
      expect(capabilities).toBeInTheDocument();
      expect(weatherCard).toBeInTheDocument();
    });
  });

  describe('Role-based Rendering', () => {
    const roles = [
      { role: 'Administrator', isAdmin: true },
      { role: 'Educator', isAdmin: false },
      { role: 'Student', isAdmin: false },
    ];

    roles.forEach(({ role, isAdmin }) => {
      it(`should render correctly for ${role} role`, () => {
        mockUseDashboard.mockReturnValue({
          roleDisplayName: role,
          availableFeatures: [],
          handleFeatureInteraction: mockHandleFeatureInteraction,
          handleNavigate: mockHandleNavigate,
          isAdmin,
        });

        render(<HomePage />);
        
        expect(screen.getByText(`Hero: ${role}`)).toBeInTheDocument();
        
        if (isAdmin) {
          expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Boundaries', () => {
    it('should render without crashing with minimal props', () => {
      mockUseDashboard.mockReturnValue({
        roleDisplayName: 'User',
        availableFeatures: [],
        handleFeatureInteraction: vi.fn(),
        handleNavigate: vi.fn(),
        isAdmin: false,
      });

      const { container } = render(<HomePage />);
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty features array', () => {
      mockUseDashboard.mockReturnValue({
        roleDisplayName: 'Student',
        availableFeatures: [],
        handleFeatureInteraction: mockHandleFeatureInteraction,
        handleNavigate: mockHandleNavigate,
        isAdmin: false,
      });

      render(<HomePage />);
      
      // Should still render hero and capabilities
      expect(screen.getByTestId('dashboard-hero')).toBeInTheDocument();
      expect(screen.getByTestId('platform-capabilities')).toBeInTheDocument();
    });
  });
}); 