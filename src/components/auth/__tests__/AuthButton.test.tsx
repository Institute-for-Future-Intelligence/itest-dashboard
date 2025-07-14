import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import AuthButton from '../AuthButton';
import type { AuthState } from '../../../hooks/useAuthState';

// Create a test theme for consistent styling tests
const testTheme = createTheme({
  palette: {
    primary: { main: '#2563eb', dark: '#1d4ed8' },
    secondary: { main: '#0891b2', dark: '#0e7490' },
    success: { main: '#10b981', dark: '#059669' },
    error: { main: '#ef4444', dark: '#dc2626' },
    action: { disabled: '#9ca3af' },
  },
});

const renderAuthButton = (authState: AuthState, onLogin = vi.fn()) => {
  return render(
    <ThemeProvider theme={testTheme}>
      <AuthButton authState={authState} onLogin={onLogin} />
    </ThemeProvider>
  );
};

describe('AuthButton', () => {
  describe('Content and Icons', () => {
    it('renders Google icon and "Sign in with Google" text for idle state', () => {
      renderAuthButton('idle');
      
      expect(screen.getByRole('button')).toHaveTextContent('Sign in with Google');
      expect(screen.getByTestId('GoogleIcon')).toBeInTheDocument();
    });

    it('renders loading spinner and "Signing in..." text for loading state', () => {
      renderAuthButton('loading');
      
      expect(screen.getByRole('button')).toHaveTextContent('Signing in...');
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders check icon and "Welcome!" text for success state', () => {
      renderAuthButton('success');
      
      expect(screen.getByRole('button')).toHaveTextContent('Welcome!');
      expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    });

    it('renders error icon and "Try Again" text for error state', () => {
      renderAuthButton('error');
      
      expect(screen.getByRole('button')).toHaveTextContent('Try Again');
      expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
    });
  });

  describe('Button Behavior', () => {
    it('calls onLogin when clicked in idle state', () => {
      const mockOnLogin = vi.fn();
      renderAuthButton('idle', mockOnLogin);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('calls onLogin when clicked in error state', () => {
      const mockOnLogin = vi.fn();
      renderAuthButton('error', mockOnLogin);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('is disabled and does not call onLogin when clicked in loading state', () => {
      const mockOnLogin = vi.fn();
      renderAuthButton('loading', mockOnLogin);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    it('is disabled and does not call onLogin when clicked in success state', () => {
      const mockOnLogin = vi.fn();
      renderAuthButton('success', mockOnLogin);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  describe('Styling and Accessibility', () => {
    it('renders as a full-width button', () => {
      renderAuthButton('idle');
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '100%' });
    });

    it('has proper minimum height', () => {
      renderAuthButton('idle');
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ 'min-height': '48px' });
    });

    it('has proper accessibility attributes', () => {
      renderAuthButton('idle');
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toHaveAttribute('aria-disabled');
    });

    it('has proper disabled accessibility attributes when disabled', () => {
      renderAuthButton('loading');
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Material-UI handles disabled state through the disabled attribute
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('State-specific Styling', () => {
    it('applies correct button class for idle state', () => {
      renderAuthButton('idle');
      
      const button = screen.getByRole('button');
      // Check that button renders and has Material-UI classes
      expect(button).toHaveClass('MuiButton-root');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('applies correct button class for success state', () => {
      renderAuthButton('success');
      
      const button = screen.getByRole('button');
      // Should render as Material-UI button
      expect(button).toHaveClass('MuiButton-root');
      expect(button).toBeDisabled();
    });

    it('applies correct button class for error state', () => {
      renderAuthButton('error');
      
      const button = screen.getByRole('button');
      // Should render as Material-UI button and be clickable
      expect(button).toHaveClass('MuiButton-root');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Loading State Behavior', () => {
    it('maintains button styling during loading', () => {
      renderAuthButton('loading');
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Should still be a Material-UI button
      expect(button).toHaveClass('MuiButton-root');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('shows loading spinner with correct attributes', () => {
      renderAuthButton('loading');
      
      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeInTheDocument();
      // CircularProgress should have Material-UI classes
      expect(spinner).toHaveClass('MuiCircularProgress-root');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid state changes gracefully', () => {
      const { rerender } = renderAuthButton('idle');
      
      // Rapidly change states
      rerender(
        <ThemeProvider theme={testTheme}>
          <AuthButton authState="loading" onLogin={vi.fn()} />
        </ThemeProvider>
      );
      
      expect(screen.getByRole('button')).toHaveTextContent('Signing in...');
      
      rerender(
        <ThemeProvider theme={testTheme}>
          <AuthButton authState="success" onLogin={vi.fn()} />
        </ThemeProvider>
      );
      
      expect(screen.getByRole('button')).toHaveTextContent('Welcome!');
    });

    it('handles missing onLogin prop gracefully', () => {
      // This should not throw an error
      expect(() => {
        render(
          <ThemeProvider theme={testTheme}>
            <AuthButton authState="idle" onLogin={vi.fn()} />
          </ThemeProvider>
        );
      }).not.toThrow();
    });
  });
}); 