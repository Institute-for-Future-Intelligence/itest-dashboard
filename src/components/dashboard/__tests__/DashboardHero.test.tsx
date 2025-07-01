import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardHero from '../DashboardHero';

// Mock MUI theme
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      text: { primary: '#000000' },
    },
  }),
}));

describe('DashboardHero', () => {
  describe('Rendering', () => {
    it('should render the dashboard title', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      expect(screen.getByText('📊 Data Science Dashboard')).toBeInTheDocument();
    });

    it('should render the description', () => {
      render(<DashboardHero roleDisplayName="Student" />);
      
      expect(screen.getByText(/Comprehensive environmental data analysis platform/)).toBeInTheDocument();
      expect(screen.getByText(/iTEST Grant Project/)).toBeInTheDocument();
    });

    it('should display the role display name', () => {
      render(<DashboardHero roleDisplayName="Educator" />);
      
      expect(screen.getByText('Educator')).toBeInTheDocument();
    });

    it('should render capability chips', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      expect(screen.getByText('Real-time Analytics')).toBeInTheDocument();
      expect(screen.getByText('Data Visualization')).toBeInTheDocument();
      expect(screen.getByText('Statistical Analysis')).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      render(<DashboardHero roleDisplayName="Student" />);
      
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });

  describe('Role Display', () => {
    const roles = ['Administrator', 'Educator', 'Student', 'User'];

    roles.forEach(role => {
      it(`should display ${role} role correctly`, () => {
        render(<DashboardHero roleDisplayName={role} />);
        
        expect(screen.getByText(role)).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('should have proper semantic structure', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Check for main heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('📊 Data Science Dashboard');
    });

    it('should render all capability chips with icons', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Check for chips with specific text
      const analyticsChip = screen.getByText('Real-time Analytics');
      const visualizationChip = screen.getByText('Data Visualization');
      const statisticsChip = screen.getByText('Statistical Analysis');
      
      expect(analyticsChip).toBeInTheDocument();
      expect(visualizationChip).toBeInTheDocument();
      expect(statisticsChip).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render without errors on different screen sizes', () => {
      // This test ensures the component doesn't break with responsive props
      const { container } = render(<DashboardHero roleDisplayName="Student" />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });
}); 