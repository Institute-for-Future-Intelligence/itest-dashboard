import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/firebase';
import { userService } from '../firebase/firestore';
import { useUserStore } from '../store/useUserStore';

export type AuthState = 'idle' | 'loading' | 'success' | 'error';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [error, setError] = useState<string>('');
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An error occurred during sign-in. Please try again.';
    }
  };

  const handleLogin = async () => {
    try {
      setAuthState('loading');
      setError('');
      
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await userService.createOrUpdateUser(result.user.uid);
      
      setAuthState('success');
      setUser(userData);
      
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthState('error');
      setError(getErrorMessage(err.code));
      
      setTimeout(() => {
        setAuthState('idle');
        setError('');
      }, 5000);
    }
  };

  return {
    authState,
    error,
    handleLogin,
    isLoading: authState === 'loading',
    isSuccess: authState === 'success',
    isError: authState === 'error',
    isIdle: authState === 'idle',
  };
}; 