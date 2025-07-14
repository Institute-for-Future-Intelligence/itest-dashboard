import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRedirectAuth } from '../useRedirectAuth';
import { getRedirectResult } from 'firebase/auth';
import { userService } from '../../firebase/firestore';
import { getAuthErrorMessage } from '../../utils/authErrorMessages';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getRedirectResult: vi.fn(),
}));

// Mock Firebase service
vi.mock('../../firebase/firestore', () => ({
  userService: {
    createOrUpdateUser: vi.fn(),
  },
}));

// Mock auth error messages
vi.mock('../../utils/authErrorMessages', () => ({
  getAuthErrorMessage: vi.fn(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock user store
const mockSetUser = vi.fn();
vi.mock('../../store/useUserStore', () => ({
  useUserStore: (selector: any) => selector({ setUser: mockSetUser }),
}));

// Mock Firebase config
vi.mock('../../firebase/firebase', () => ({
  auth: { currentUser: null },
}));

describe('useRedirectAuth', () => {
  const mockGetRedirectResult = vi.mocked(getRedirectResult);
  const mockCreateOrUpdateUser = vi.mocked(userService.createOrUpdateUser);
  const mockGetAuthErrorMessage = vi.mocked(getAuthErrorMessage);
  
  // Mock callback functions
  const mockOnLoading = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const mockOnIdle = vi.fn();

  const defaultProps = {
    onLoading: mockOnLoading,
    onSuccess: mockOnSuccess,
    onError: mockOnError,
    onIdle: mockOnIdle,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Successful Redirect Result', () => {
    it('should handle successful redirect result with user', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(mockUserData);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onLoading when redirect result is found
      expect(mockOnLoading).toHaveBeenCalledTimes(1);
      
      // Should create/update user
      expect(mockCreateOrUpdateUser).toHaveBeenCalledWith('test-uid');
      
      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      
      // Should set user in store
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
      
      // Should not call onError or onIdle
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnIdle).not.toHaveBeenCalled();
    });

    it('should navigate to home after 1 second on successful redirect', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(mockUserData);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should not navigate immediately
      expect(mockNavigate).not.toHaveBeenCalled();

      // Fast-forward 1 second
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should navigate to home
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('should handle successful redirect with proper callback sequence', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      // Create controlled promises to test callback sequence
      let resolveUserCreation: (value: any) => void;
      const userCreationPromise = new Promise((resolve) => {
        resolveUserCreation = resolve;
      });

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockReturnValue(userCreationPromise as any);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for getRedirectResult to resolve
      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });

      // Should call onLoading first
      expect(mockOnLoading).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).not.toHaveBeenCalled();

      // Resolve user creation
      await act(async () => {
        resolveUserCreation(mockUserData);
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onSuccess after user creation
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('No Redirect Result', () => {
    it('should not call any callbacks when no redirect result', async () => {
      mockGetRedirectResult.mockResolvedValue(null);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should not call any callbacks
      expect(mockOnLoading).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnIdle).not.toHaveBeenCalled();
      
      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
      
      // Should not set user
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should not call any callbacks when redirect result has no user', async () => {
      mockGetRedirectResult.mockResolvedValue({ user: null } as any);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should not call any callbacks
      expect(mockOnLoading).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnIdle).not.toHaveBeenCalled();
    });

    it('should not call any callbacks when redirect result is undefined', async () => {
      mockGetRedirectResult.mockResolvedValue(undefined as any);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should not call any callbacks
      expect(mockOnLoading).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnIdle).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle getRedirectResult error', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const mockErrorMessage = 'Network error occurred';

      mockGetRedirectResult.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onError with formatted message
      expect(mockOnError).toHaveBeenCalledWith(mockErrorMessage);
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('auth/network-request-failed');
      
      // Should not call other callbacks
      expect(mockOnLoading).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle user creation error', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockError = new Error('User creation failed');
      const mockErrorMessage = 'User creation error';

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onLoading first
      expect(mockOnLoading).toHaveBeenCalledTimes(1);
      
      // Should call onError with formatted message
      expect(mockOnError).toHaveBeenCalledWith(mockErrorMessage);
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('unknown');
      
      // Should not call onSuccess
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle error without error code', async () => {
      const mockError = new Error('Generic error');
      const mockErrorMessage = 'An error occurred';

      mockGetRedirectResult.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onError with formatted message
      expect(mockOnError).toHaveBeenCalledWith(mockErrorMessage);
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('unknown');
    });

    it('should auto-clear error state after 5 seconds', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const mockErrorMessage = 'Network error occurred';

      mockGetRedirectResult.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onError
      expect(mockOnError).toHaveBeenCalledWith(mockErrorMessage);
      
      // Should not call onIdle yet
      expect(mockOnIdle).not.toHaveBeenCalled();

      // Fast-forward 5 seconds
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Should call onIdle after timeout
      expect(mockOnIdle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback Behavior', () => {
    it('should call callbacks in correct order for successful flow', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(mockUserData);

      const callOrder: string[] = [];
      const trackingOnLoading = vi.fn(() => callOrder.push('onLoading'));
      const trackingOnSuccess = vi.fn(() => callOrder.push('onSuccess'));

      renderHook(() => useRedirectAuth({
        ...defaultProps,
        onLoading: trackingOnLoading,
        onSuccess: trackingOnSuccess,
      }));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call callbacks in correct order
      expect(callOrder).toEqual(['onLoading', 'onSuccess']);
    });

    it('should call callbacks in correct order for error flow', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const mockErrorMessage = 'Network error occurred';

      mockGetRedirectResult.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      const callOrder: string[] = [];
      const trackingOnError = vi.fn(() => callOrder.push('onError'));
      const trackingOnIdle = vi.fn(() => callOrder.push('onIdle'));

      renderHook(() => useRedirectAuth({
        ...defaultProps,
        onError: trackingOnError,
        onIdle: trackingOnIdle,
      }));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call onError first
      expect(callOrder).toEqual(['onError']);

      // Fast-forward 5 seconds
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Should call onIdle after timeout
      expect(callOrder).toEqual(['onError', 'onIdle']);
    });
  });

  describe('Hook Lifecycle', () => {
    it('should handle hook unmount gracefully', () => {
      mockGetRedirectResult.mockResolvedValue(null);

      const { unmount } = renderHook(() => useRedirectAuth(defaultProps));

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle hook re-render with different props', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(mockUserData);

      const { rerender } = renderHook((props) => useRedirectAuth(props), {
        initialProps: defaultProps
      });

      // Wait for initial render
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Clear mocks to test re-render behavior
      mockGetRedirectResult.mockClear();
      mockCreateOrUpdateUser.mockClear();

      // Re-render with different callback props to trigger useEffect
      const newProps = {
        ...defaultProps,
        onLoading: vi.fn(),
        onSuccess: vi.fn(),
        onError: vi.fn(),
        onIdle: vi.fn(),
      };

      rerender(newProps);

      // Wait for potential async operations
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should call getRedirectResult again due to useEffect with different dependencies
      expect(mockGetRedirectResult).toHaveBeenCalledTimes(1);
    });
  });

  describe('Console Logging', () => {
    it('should log errors to console', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGetRedirectResult.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue('Network error');

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should log error to console
      expect(consoleSpy).toHaveBeenCalledWith('Redirect auth error:', mockError);

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid hook instances', async () => {
      mockGetRedirectResult.mockResolvedValue(null);

      // Create multiple instances
      const { unmount: unmount1 } = renderHook(() => useRedirectAuth(defaultProps));
      const { unmount: unmount2 } = renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should handle multiple instances without issues
      expect(mockGetRedirectResult).toHaveBeenCalledTimes(2);

      // Clean up
      unmount1();
      unmount2();
    });

    it('should handle user creation returning null', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };

      mockGetRedirectResult.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(null as any);

      renderHook(() => useRedirectAuth(defaultProps));

      // Wait for async operations but not timers
      await act(async () => {
        await Promise.resolve(); // Let promises resolve
      });

      // Should still call onSuccess and setUser with null
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });
}); 