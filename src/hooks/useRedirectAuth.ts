import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { userService } from '../firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { getAuthErrorMessage } from '../utils/authErrorMessages';

interface UseRedirectAuthProps {
  onLoading: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  onIdle: () => void;
}

export const useRedirectAuth = ({ onLoading, onSuccess, onError, onIdle }: UseRedirectAuthProps) => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Don't set loading immediately - first check if there's a redirect result
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          // Only set loading if we actually have a redirect result
          onLoading();
          const userData = await userService.createOrUpdateUser(result.user.uid);
          onSuccess();
          setUser(userData);
          
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        }
        // If no redirect result, don't call onIdle() - let the main hook manage state
      } catch (err: any) {
        console.error('Redirect auth error:', err);
        onError(getAuthErrorMessage(err.code));
        
        setTimeout(() => {
          onIdle();
        }, 5000);
      }
    };

    handleRedirectResult();
  }, [setUser, navigate, onLoading, onSuccess, onError, onIdle]);
}; 