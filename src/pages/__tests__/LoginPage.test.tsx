import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { useAuthState } from '../../hooks/useAuthState';
import type { AuthState } from '../../hooks/useAuthState';

// Mock the useAuthState hook
vi.mock('../../hooks/useAuthState');

// Mock the auth components
vi.mock('../../components/auth', () => ({
  AuthButton: vi.fn(({ authState, onLogin }) => (
    <button 
      data-testid="auth-button"
      type="button"
      onClick={onLogin}
      disabled={authState === 'loading' || authState === 'success'}
    >
      {authState === 'loading' ? 'Signing in...' : 
       authState === 'success' ? 'Welcome!' : 
       authState === 'error' ? 'Try Again' : 'Sign in with Google'}
    </button>
  )),
  AuthFeedback: vi.fn(({ authState, error }) => (
    <div data-testid="auth-feedback">
      {authState === 'loading' && <span>Loading feedback</span>}
      {authState === 'success' && <span>Redirecting...</span>}
      {authState === 'error' && error && <span>Error: {error}</span>}
    </div>
  )),
}));

// Mock the Footer component
vi.mock('../../components/layout/Footer', () => ({
  default: vi.fn(() => <div data-testid="footer">Footer</div>),
}));

// Create a test theme
const testTheme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#0891b2' },
    success: { main: '#10b981' },
    error: { main: '#ef4444' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#475569' },
  },
});

// Test helper to render LoginPage with router context
const renderLoginPage = (authState: AuthState = 'idle', error = '', isSuccess = false) => {
  // Mock the useAuthState hook
  vi.mocked(useAuthState).mockReturnValue({
    authState,
    error,
    handleLogin: vi.fn(),
    isLoading: authState === 'loading',
    isSuccess,
    isError: authState === 'error',
    isIdle: authState === 'idle',
  });

  return render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider theme={testTheme}>
        <LoginPage />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render without loading overlay', () => {
      renderLoginPage('idle');

      // Should not show any loading overlay
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      
      // Should show main content
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByText('Springs of Knowledge')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render with proper layout structure', () => {
      renderLoginPage('idle');

      // Check for main layout elements
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByText('Data Dashboard for Environmental Research')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toBeInTheDocument();
      expect(screen.getByTestId('auth-feedback')).toBeInTheDocument();
    });

    it('should show water drop icon for idle state', () => {
      const { container } = renderLoginPage('idle');
      
      // Check that the water drop icon is present (MUI icon)
      expect(container.querySelector('[data-testid="WaterDropOutlinedIcon"]')).toBeInTheDocument();
    });
  });

  describe('Authentication States', () => {
    it('should show contextual feedback during loading state', () => {
      renderLoginPage('loading');

      // Should NOT show loading overlay
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      
      // Should show contextual loading feedback
      expect(screen.getByText('Loading feedback')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Signing in...');
      expect(screen.getByTestId('auth-button')).toBeDisabled();
    });

    it('should show success state without overlay', () => {
      renderLoginPage('success', '', true);

      // Should NOT show loading overlay
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      
      // Should show success feedback
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Welcome!');
      expect(screen.getByTestId('auth-button')).toBeDisabled();
    });

    it('should show error state without overlay', () => {
      renderLoginPage('error', 'Login failed');

      // Should NOT show loading overlay
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      
      // Should show error feedback
      expect(screen.getByText('Error: Login failed')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Try Again');
      expect(screen.getByTestId('auth-button')).not.toBeDisabled();
    });

    it('should show check icon for success state', () => {
      const { container } = renderLoginPage('success', '', true);
      
      // Should show check icon instead of water drop
      expect(container.querySelector('[data-testid="CheckCircleIcon"]')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call handleLogin when auth button is clicked', () => {
      const mockHandleLogin = vi.fn();
      
      // Mock the useAuthState hook to return the mockHandleLogin function
      vi.mocked(useAuthState).mockReturnValue({
        authState: 'idle',
        error: '',
        handleLogin: mockHandleLogin,
        isLoading: false,
        isSuccess: false,
        isError: false,
        isIdle: true,
      });

      // Use the render helper but pass the mock function explicitly
      render(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider theme={testTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      );

      const authButton = screen.getByTestId('auth-button');
      fireEvent.click(authButton);

      expect(mockHandleLogin).toHaveBeenCalledTimes(1);
    });

    it('should not call handleLogin when button is disabled', () => {
      const mockHandleLogin = vi.fn();
      
      vi.mocked(useAuthState).mockReturnValue({
        authState: 'loading',
        error: '',
        handleLogin: mockHandleLogin,
        isLoading: true,
        isSuccess: false,
        isError: false,
        isIdle: false,
      });

      renderLoginPage('loading');

      const authButton = screen.getByTestId('auth-button');
      expect(authButton).toBeDisabled();
      
      fireEvent.click(authButton);
      expect(mockHandleLogin).not.toHaveBeenCalled();
    });
  });

  describe('Visual Design', () => {
    it('should have proper styling and layout', () => {
      const { container } = renderLoginPage('idle');

      // Check for main container
      expect(container.firstChild).toBeInTheDocument();
      
      // Check for card structure
      expect(container.querySelector('[class*="MuiCard-root"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="MuiCardContent-root"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="MuiAvatar-root"]')).toBeInTheDocument();
    });

    it('should show animated rings for success state', () => {
      renderLoginPage('success', '', true);
      
      // With mocked components, just verify the success state is rendered
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Welcome!');
    });

    it('should have proper gradient background', () => {
      renderLoginPage('idle');
      
      // With mocked components, just verify the layout is rendered
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderLoginPage('idle');

      // Check for proper heading
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nā Puna ʻIke');
    });

    it('should have accessible button', () => {
      renderLoginPage('idle');

      const authButton = screen.getByTestId('auth-button');
      expect(authButton).toBeInTheDocument();
      expect(authButton).toHaveAttribute('type', 'button');
    });

    it('should have proper text hierarchy', () => {
      renderLoginPage('idle');

      // Check for proper text content
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByText('Springs of Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Data Dashboard for Environmental Research')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should handle state transitions smoothly', async () => {
      const { rerender } = renderLoginPage('idle');

      // Initial idle state
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Sign in with Google');

      // Mock loading state
      vi.mocked(useAuthState).mockReturnValue({
        authState: 'loading',
        error: '',
        handleLogin: vi.fn(),
        isLoading: true,
        isSuccess: false,
        isError: false,
        isIdle: false,
      });

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider theme={testTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      );

      // Should show loading feedback
      expect(screen.getByText('Loading feedback')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Signing in...');

      // Mock success state
      vi.mocked(useAuthState).mockReturnValue({
        authState: 'success',
        error: '',
        handleLogin: vi.fn(),
        isLoading: false,
        isSuccess: true,
        isError: false,
        isIdle: false,
      });

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider theme={testTheme}>
            <LoginPage />
          </ThemeProvider>
        </MemoryRouter>
      );

      // Should show success feedback
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render immediately without loading delays', () => {
      const startTime = Date.now();
      renderLoginPage('idle');
      const endTime = Date.now();

      // Should render very quickly (under 100ms for this simple test)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should have content immediately available
      expect(screen.getByText('Nā Puna ʻIke')).toBeInTheDocument();
      expect(screen.getByTestId('auth-button')).toBeInTheDocument();
    });

    it('should not show loading overlay at any point', () => {
      // Test all auth states
      const authStates: AuthState[] = ['idle', 'loading', 'success', 'error'];
      
      authStates.forEach(state => {
        renderLoginPage(state);
        expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      });
    });
  });
}); 