import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import AuthInitializer from '../AuthInitializer';
import { useAuthStore } from '../../../store/useAuthStore';

// Mock the auth store
vi.mock('../../../store/useAuthStore');

// Mock LoadingOverlay
vi.mock('../LoadingOverlay', () => ({
  default: vi.fn(({ show }) => (
    <div data-testid="loading-overlay" style={{ display: show ? 'block' : 'none' }}>
      Loading...
    </div>
  )),
}));

// Create a test theme
const testTheme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#0891b2' },
    error: { main: '#ef4444' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#475569' },
  },
});

// Test helper to render AuthInitializer with router context
const renderAuthInitializer = (
  initialEntries = ['/'],
  authState: {
    isInitialized: boolean;
    initializationError: string | null;
    resetAuthState: () => void;
  } = {
    isInitialized: true,
    initializationError: null,
    resetAuthState: vi.fn(),
  }
) => {
  // Mock the useAuthStore hook
  vi.mocked(useAuthStore).mockReturnValue(authState);

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={testTheme}>
        <AuthInitializer>
          <div data-testid="test-children">Test Children</div>
        </AuthInitializer>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('AuthInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Public Routes (Bypass Auth Check)', () => {
    const publicRoutes = ['/', '/logout'];

    publicRoutes.forEach((route) => {
      it(`should render children immediately for public route: ${route}`, () => {
        renderAuthInitializer([route], {
          isInitialized: false, // Not initialized
          initializationError: null,
          resetAuthState: vi.fn(),
        });

        // Children should render immediately without loading overlay
        expect(screen.getByTestId('test-children')).toBeInTheDocument();
        expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      });

      it(`should not show loading overlay for public route: ${route} even when auth is not initialized`, () => {
        renderAuthInitializer([route], {
          isInitialized: false,
          initializationError: null,
          resetAuthState: vi.fn(),
        });

        expect(screen.getByTestId('test-children')).toBeInTheDocument();
        expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      });
    });
  });

  describe('Protected Routes (Auth Check Required)', () => {
    const protectedRoutes = ['/home', '/weather', '/sensors', '/water-quality', '/admin'];

    protectedRoutes.forEach((route) => {
      it(`should show loading overlay for protected route: ${route} when not initialized`, () => {
        renderAuthInitializer([route], {
          isInitialized: false,
          initializationError: null,
          resetAuthState: vi.fn(),
        });

        // Should show loading overlay, not children
        expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
        expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
      });

      it(`should render children for protected route: ${route} when initialized`, () => {
        renderAuthInitializer([route], {
          isInitialized: true,
          initializationError: null,
          resetAuthState: vi.fn(),
        });

        // Should render children without loading overlay
        expect(screen.getByTestId('test-children')).toBeInTheDocument();
        expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error state when initialization fails', () => {
      const mockResetAuthState = vi.fn();
      renderAuthInitializer(['/home'], {
        isInitialized: true,
        initializationError: 'Firebase connection failed',
        resetAuthState: mockResetAuthState,
      });

      expect(screen.getByText('Authentication Error')).toBeInTheDocument();
      expect(screen.getByText('Firebase connection failed')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });

    it('should call resetAuthState and reload when retry button is clicked', () => {
      const mockResetAuthState = vi.fn();
      const mockReload = vi.fn();
      
      // Mock window.location.reload
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload } as unknown as Location,
        writable: true,
      });

      renderAuthInitializer(['/home'], {
        isInitialized: true,
        initializationError: 'Network error',
        resetAuthState: mockResetAuthState,
      });

      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      expect(mockResetAuthState).toHaveBeenCalledTimes(1);
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('should render children for public routes even when initialization fails', () => {
      renderAuthInitializer(['/'], {
        isInitialized: true,
        initializationError: 'Authentication service unavailable',
        resetAuthState: vi.fn(),
      });

      // Public routes should still render children even if auth initialization failed
      // This allows users to still access the login page when auth service is down
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByText('Authentication Error')).not.toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should handle transition from loading to initialized', () => {
      const { rerender } = renderAuthInitializer(['/home'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      // Initially should show loading
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();

      // Mock auth store to return initialized state
      vi.mocked(useAuthStore).mockReturnValue({
        isInitialized: true,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      // Rerender with initialized state
      rerender(
        <MemoryRouter initialEntries={['/home']}>
          <ThemeProvider theme={testTheme}>
            <AuthInitializer>
              <div data-testid="test-children">Test Children</div>
            </AuthInitializer>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Should now show children
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    });

    it('should handle transition from loading to error', () => {
      const { rerender } = renderAuthInitializer(['/home'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      // Initially should show loading
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

      // Mock auth store to return error state
      vi.mocked(useAuthStore).mockReturnValue({
        isInitialized: true,
        initializationError: 'Connection timeout',
        resetAuthState: vi.fn(),
      });

      // Rerender with error state
      rerender(
        <MemoryRouter initialEntries={['/home']}>
          <ThemeProvider theme={testTheme}>
            <AuthInitializer>
              <div data-testid="test-children">Test Children</div>
            </AuthInitializer>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Should now show error
      expect(screen.getByText('Authentication Error')).toBeInTheDocument();
      expect(screen.getByText('Connection timeout')).toBeInTheDocument();
    });
  });

  describe('Route Detection Logic', () => {
    it('should correctly identify public routes', () => {
      // Test exact matches
      renderAuthInitializer(['/'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should correctly identify protected routes', () => {
      // Test routes that are not in the public list
      renderAuthInitializer(['/unknown-route'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });

    it('should handle route changes properly', () => {
      // Start with public route
      const { container } = renderAuthInitializer(['/'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      // Public route should render children immediately
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();

      // Clean up first render
      container.remove();

      // Now test protected route with same auth state
      renderAuthInitializer(['/home'], {
        isInitialized: false,
        initializationError: null,
        resetAuthState: vi.fn(),
      });

      // Should now show loading overlay for protected route
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });
  });
}); 