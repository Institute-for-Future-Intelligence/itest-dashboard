import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthState } from '../useAuthState';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { userService } from '../../firebase/firestore';
import { isMobileDevice } from '../../utils/deviceDetection';
import { getAuthErrorMessage } from '../../utils/authErrorMessages';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
}));

// Mock Firebase service
vi.mock('../../firebase/firestore', () => ({
  userService: {
    createOrUpdateUser: vi.fn(),
  },
}));

// Mock device detection
vi.mock('../../utils/deviceDetection', () => ({
  isMobileDevice: vi.fn(),
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

// Mock useRedirectAuth
vi.mock('../useRedirectAuth', () => ({
  useRedirectAuth: vi.fn(),
}));

// Mock Firebase config
vi.mock('../../firebase/firebase', () => ({
  auth: { currentUser: null },
  googleProvider: { setCustomParameters: vi.fn() },
}));

describe('useAuthState', () => {
  const mockSignInWithPopup = vi.mocked(signInWithPopup);
  const mockSignInWithRedirect = vi.mocked(signInWithRedirect);
  const mockCreateOrUpdateUser = vi.mocked(userService.createOrUpdateUser);
  const mockIsMobileDevice = vi.mocked(isMobileDevice);
  const mockGetAuthErrorMessage = vi.mocked(getAuthErrorMessage);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(() => useAuthState());

      expect(result.current.authState).toBe('idle');
      expect(result.current.error).toBe('');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(true);
    });

    it('should provide handleLogin function', () => {
      const { result } = renderHook(() => useAuthState());

      expect(typeof result.current.handleLogin).toBe('function');
    });
  });

  describe('Desktop Login Flow (Popup)', () => {
    beforeEach(() => {
      mockIsMobileDevice.mockReturnValue(false);
    });

    it('should handle successful popup login', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      // Create a promise that can be controlled
      let resolveSignIn: (value: any) => void;
      let resolveCreateUser: (value: any) => void;
      
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve;
      });
      
      const createUserPromise = new Promise((resolve) => {
        resolveCreateUser = resolve;
      });

      mockSignInWithPopup.mockReturnValue(signInPromise as any);
      mockCreateOrUpdateUser.mockReturnValue(createUserPromise as any);

      const { result } = renderHook(() => useAuthState());

      // Start login
      act(() => {
        result.current.handleLogin();
      });

      // Should be loading immediately
      expect(result.current.authState).toBe('loading');

      // Resolve sign in
      await act(async () => {
        resolveSignIn(mockResult);
        await vi.runOnlyPendingTimersAsync();
      });

      // Should still be loading waiting for user creation
      expect(result.current.authState).toBe('loading');

      // Resolve user creation
      await act(async () => {
        resolveCreateUser(mockUserData);
        await vi.runOnlyPendingTimersAsync();
      });

      // Should be success
      expect(result.current.authState).toBe('success');
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    });

    it('should navigate to home after successful login', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      mockSignInWithPopup.mockResolvedValue(mockResult as any);
      mockCreateOrUpdateUser.mockResolvedValue(mockUserData);

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      // Fast-forward the setTimeout
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    }, 10000);

    it('should handle popup login error', async () => {
      const mockError = { code: 'auth/popup-closed-by-user' };
      const mockErrorMessage = 'Login was cancelled';

      mockSignInWithPopup.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      // Should be in error state
      expect(result.current.authState).toBe('error');
      expect(result.current.error).toBe(mockErrorMessage);
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('auth/popup-closed-by-user');
    }, 10000);
  });

  describe('Mobile Login Flow (Redirect)', () => {
    beforeEach(() => {
      mockIsMobileDevice.mockReturnValue(true);
    });

    it('should handle redirect login on mobile', async () => {
      mockSignInWithRedirect.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      expect(mockSignInWithRedirect).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should handle redirect login error', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const mockErrorMessage = 'Network error occurred';

      mockSignInWithRedirect.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      expect(result.current.authState).toBe('error');
      expect(result.current.error).toBe(mockErrorMessage);
    }, 10000);
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockIsMobileDevice.mockReturnValue(false);
    });

    it('should auto-clear error state after 5 seconds', async () => {
      const mockError = { code: 'auth/network-request-failed' };
      const mockErrorMessage = 'Network error';

      mockSignInWithPopup.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      // Should be in error state
      expect(result.current.authState).toBe('error');
      expect(result.current.error).toBe(mockErrorMessage);

      // Fast-forward 5 seconds
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.authState).toBe('idle');
      expect(result.current.error).toBe('');
    }, 10000);

    it('should handle unknown error codes', async () => {
      const mockError = { code: 'unknown-error' };
      const mockErrorMessage = 'An unknown error occurred';

      mockSignInWithPopup.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue(mockErrorMessage);

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      expect(result.current.authState).toBe('error');
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('unknown-error');
    }, 10000);

    it('should handle errors without error codes', async () => {
      const mockError = new Error('Generic error');

      mockSignInWithPopup.mockRejectedValue(mockError);
      mockGetAuthErrorMessage.mockReturnValue('An error occurred');

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      expect(result.current.authState).toBe('error');
      expect(mockGetAuthErrorMessage).toHaveBeenCalledWith('unknown');
    }, 10000);
  });

  describe('State Transitions', () => {
    beforeEach(() => {
      mockIsMobileDevice.mockReturnValue(false);
    });

    it('should transition from idle -> loading -> success', async () => {
      const mockUser = { uid: 'test-uid' };
      const mockResult = { user: mockUser };
      const mockUserData = { uid: 'test-uid', role: 'student' as const };

      // Create controlled promises
      let resolveSignIn: (value: any) => void;
      let resolveCreateUser: (value: any) => void;
      
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve;
      });
      
      const createUserPromise = new Promise((resolve) => {
        resolveCreateUser = resolve;
      });

      mockSignInWithPopup.mockReturnValue(signInPromise as any);
      mockCreateOrUpdateUser.mockReturnValue(createUserPromise as any);

      const { result } = renderHook(() => useAuthState());

      expect(result.current.authState).toBe('idle');

      // Start login
      act(() => {
        result.current.handleLogin();
      });

      // Should be loading
      expect(result.current.authState).toBe('loading');

      // Complete operations
      await act(async () => {
        resolveSignIn(mockResult);
        resolveCreateUser(mockUserData);
        await vi.runOnlyPendingTimersAsync();
      });

      // Should be success
      expect(result.current.authState).toBe('success');
    });

    it('should transition from idle -> loading -> error -> idle', async () => {
      const mockError = { code: 'auth/network-request-failed' };

      // Create controlled promise
      let rejectSignIn: (value: any) => void;
      const signInPromise = new Promise((_, reject) => {
        rejectSignIn = reject;
      });

      mockSignInWithPopup.mockReturnValue(signInPromise as any);
      mockGetAuthErrorMessage.mockReturnValue('Network error');

      const { result } = renderHook(() => useAuthState());

      expect(result.current.authState).toBe('idle');

      // Start login
      act(() => {
        result.current.handleLogin();
      });

      // Should be loading
      expect(result.current.authState).toBe('loading');

      // Reject the promise
      await act(async () => {
        rejectSignIn(mockError);
        // Don't advance timers yet - just let the promise rejection be handled
      });

      // Should be error
      expect(result.current.authState).toBe('error');

      // Fast-forward timeout
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Should be idle
      expect(result.current.authState).toBe('idle');
    });
  });

  describe('Helper Properties', () => {
    it('should provide correct boolean helpers for idle state', () => {
      const { result } = renderHook(() => useAuthState());

      expect(result.current.isIdle).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should provide correct boolean helpers for loading state', async () => {
      mockIsMobileDevice.mockReturnValue(false);
      
      // Mock a promise that never resolves to keep it in loading state
      mockSignInWithPopup.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuthState());

      await act(async () => {
        result.current.handleLogin();
      });

      expect(result.current.isIdle).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid login attempts', async () => {
      mockIsMobileDevice.mockReturnValue(false);
      mockSignInWithPopup.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAuthState());

      // First login attempt
      await act(async () => {
        result.current.handleLogin();
      });

      expect(result.current.authState).toBe('loading');

      // Second login attempt while first is still loading
      await act(async () => {
        result.current.handleLogin();
      });

      // Should still be loading, not cause issues
      expect(result.current.authState).toBe('loading');
    });

    it('should handle cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => useAuthState());

      expect(result.current.authState).toBe('idle');

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });
  });
}); 