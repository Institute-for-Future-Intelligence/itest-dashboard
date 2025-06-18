import { useState } from 'react';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/firebase';
import { userService } from '../firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { isMobileDevice } from '../utils/deviceDetection';
import { getAuthErrorMessage } from '../utils/authErrorMessages';
import { useRedirectAuth } from './useRedirectAuth';

export type AuthState = 'idle' | 'loading' | 'success' | 'error';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [error, setError] = useState<string>('');
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  // Handle redirect authentication (for mobile)
  useRedirectAuth({
    onLoading: () => setAuthState('loading'),
    onSuccess: () => setAuthState('success'),
    onError: (errorMessage) => {
      setAuthState('error');
      setError(errorMessage);
    },
    onIdle: () => setAuthState('idle'),
  });

  const handlePopupAuth = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userData = await userService.createOrUpdateUser(result.user.uid);
    
    setAuthState('success');
    setUser(userData);
    
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  const handleRedirectAuth = async () => {
    await signInWithRedirect(auth, googleProvider);
    // User will be redirected, useRedirectAuth will handle the response
  };

  const handleLogin = async () => {
    try {
      setAuthState('loading');
      setError('');
      
      if (isMobileDevice()) {
        await handleRedirectAuth();
      } else {
        await handlePopupAuth();
      }
      
    } catch (err: unknown) {
      console.error('Login error:', err);
      setAuthState('error');
      setError(getAuthErrorMessage((err as { code?: string })?.code || 'unknown'));
      
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