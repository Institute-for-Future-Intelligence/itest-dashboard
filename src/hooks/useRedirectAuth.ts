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
        onLoading();
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          const userData = await userService.createOrUpdateUser(result.user.uid);
          onSuccess();
          setUser(userData);
          
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          onIdle();
        }
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