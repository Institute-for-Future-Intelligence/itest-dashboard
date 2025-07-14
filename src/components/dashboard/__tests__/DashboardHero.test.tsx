import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardHero from '../DashboardHero';

// Mock MUI theme
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      info: { main: '#0288d1' },
      text: { 
        primary: '#000000',
        secondary: '#666666'
      },
      background: {
        paper: '#ffffff'
      },
      divider: '#e0e0e0'
    },
    shadows: ['none', '0px 1px 3px rgba(0,0,0,0.2)', '0px 2px 4px rgba(0,0,0,0.2)', '0px 3px 5px rgba(0,0,0,0.2)']
  }),
}));

describe('DashboardHero', () => {
  describe('Rendering', () => {
    it('should render the main title', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      const mainTitle = screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' });
      expect(mainTitle).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<DashboardHero roleDisplayName="Student" />);
      
      expect(screen.getByText('Data Science Platform')).toBeInTheDocument();
    });

    it('should render the description', () => {
      render(<DashboardHero roleDisplayName="Student" />);
      
      expect(screen.getByText(/Comprehensive environmental data analysis platform/)).toBeInTheDocument();
      expect(screen.getByText(/the springs of knowledge/)).toBeInTheDocument();
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
      
      // Check for main heading (h2)
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' });
      expect(mainHeading).toBeInTheDocument();
      
      // Check for subtitle heading (h6)
      const subtitle = screen.getByRole('heading', { level: 6, name: 'Data Science Platform' });
      expect(subtitle).toBeInTheDocument();
      
      // Check for welcome heading (h6)
      const welcomeHeading = screen.getByRole('heading', { level: 6, name: 'Welcome back!' });
      expect(welcomeHeading).toBeInTheDocument();
    });

    it('should render all capability chips with proper structure', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Check for chips with specific text
      const analyticsChip = screen.getByText('Real-time Analytics');
      const visualizationChip = screen.getByText('Data Visualization');
      const statisticsChip = screen.getByText('Statistical Analysis');
      
      expect(analyticsChip).toBeInTheDocument();
      expect(visualizationChip).toBeInTheDocument();
      expect(statisticsChip).toBeInTheDocument();
    });

    it('should render icons correctly', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Check for WaterDropOutlined icon in logo
      expect(screen.getByTestId('WaterDropOutlinedIcon')).toBeInTheDocument();
      
      // Check for DataUsage icon in welcome card
      expect(screen.getByTestId('DataUsageIcon')).toBeInTheDocument();
      
      // Check for feature chip icons
      expect(screen.getByTestId('AnalyticsIcon')).toBeInTheDocument();
      expect(screen.getByTestId('TrendingUpIcon')).toBeInTheDocument();
      expect(screen.getByTestId('AssessmentIcon')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render without errors on different screen sizes', () => {
      // This test ensures the component doesn't break with responsive props
      const { container } = render(<DashboardHero roleDisplayName="Student" />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Re-rendering Behavior (No Memo)', () => {
    it('should re-render when roleDisplayName prop changes', () => {
      const { rerender } = render(<DashboardHero roleDisplayName="Student" />);
      
      // Initial render
      expect(screen.getByText('Student')).toBeInTheDocument();
      
      // Re-render with different prop
      rerender(<DashboardHero roleDisplayName="Administrator" />);
      
      // Should show new role
      expect(screen.getByText('Administrator')).toBeInTheDocument();
      expect(screen.queryByText('Student')).not.toBeInTheDocument();
    });

    it('should handle rapid prop changes without issues', () => {
      const { rerender } = render(<DashboardHero roleDisplayName="Student" />);
      
      // Rapid prop changes (similar to what would happen without memo)
      rerender(<DashboardHero roleDisplayName="Educator" />);
      rerender(<DashboardHero roleDisplayName="Administrator" />);
      rerender(<DashboardHero roleDisplayName="Student" />);
      
      // Should display the final state
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.queryByText('Educator')).not.toBeInTheDocument();
      expect(screen.queryByText('Administrator')).not.toBeInTheDocument();
    });

    it('should render consistently across multiple renders', () => {
      const { rerender } = render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Check initial render
      const mainTitle = screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' });
      expect(mainTitle).toBeInTheDocument();
      expect(screen.getByText('Real-time Analytics')).toBeInTheDocument();
      expect(screen.getByText('Data Visualization')).toBeInTheDocument();
      expect(screen.getByText('Statistical Analysis')).toBeInTheDocument();
      
      // Re-render with same props
      rerender(<DashboardHero roleDisplayName="Administrator" />);
      
      // Should still render all elements
      const mainTitleAfterRerender = screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' });
      expect(mainTitleAfterRerender).toBeInTheDocument();
      expect(screen.getByText('Real-time Analytics')).toBeInTheDocument();
      expect(screen.getByText('Data Visualization')).toBeInTheDocument();
      expect(screen.getByText('Statistical Analysis')).toBeInTheDocument();
    });
  });

  describe('Performance Without Memo', () => {
    it('should not cause performance issues with frequent re-renders', () => {
      const { rerender } = render(<DashboardHero roleDisplayName="Student" />);
      
      // Simulate frequent re-renders that would happen without memo
      for (let i = 0; i < 10; i++) {
        rerender(<DashboardHero roleDisplayName={`Role${i}`} />);
      }
      
      // Should still work correctly
      expect(screen.getByText('Role9')).toBeInTheDocument();
      const mainTitle = screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' });
      expect(mainTitle).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display only the expected feature chips', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      // Should have exactly these 3 chips
      expect(screen.getByText('Real-time Analytics')).toBeInTheDocument();
      expect(screen.getByText('Data Visualization')).toBeInTheDocument();
      expect(screen.getByText('Statistical Analysis')).toBeInTheDocument();
      
      // Verify no other capability chips are present
      expect(screen.queryByText('Smart Insights')).not.toBeInTheDocument();
      expect(screen.queryByText('Machine Learning')).not.toBeInTheDocument();
    });

    it('should display correct welcome card content', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
      expect(screen.getByText(/Access your environmental data dashboard/)).toBeInTheDocument();
    });

    it('should display correct main content', () => {
      render(<DashboardHero roleDisplayName="Administrator" />);
      
      expect(screen.getByRole('heading', { level: 2, name: 'Nā Puna ʻIke' })).toBeInTheDocument();
      expect(screen.getByText('Data Science Platform')).toBeInTheDocument();
      expect(screen.getByText(/Query, visualize, and analyze weather, sensor, and water quality data/)).toBeInTheDocument();
    });
  });
}); 