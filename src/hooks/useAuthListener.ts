import { useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../firebase/firestore';
import { clearIfiChatbotLocalStorage } from '../utils/clearIfiChatbotStorage';

const IFI_CHATBOT_ID = import.meta.env.VITE_CHATBOT_ID?.trim();

export const useAuthListener = () => {
  const { setUser, clearUser } = useUserStore();
  const { setInitialized, setInitializationError } = useAuthStore();
  const lastFirebaseUidRef = useRef<string | null>(null);

  const handleAuthStateChange = useCallback(async (firebaseUser: FirebaseUser | null) => {
    try {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        if (lastFirebaseUidRef.current !== null && lastFirebaseUidRef.current !== uid) {
          clearIfiChatbotLocalStorage(IFI_CHATBOT_ID);
        }
        lastFirebaseUidRef.current = uid;
        const userData = await userService.createOrUpdateUser(uid);
        setUser(userData);
      } else {
        lastFirebaseUidRef.current = null;
        clearIfiChatbotLocalStorage(IFI_CHATBOT_ID);
        clearUser();
      }
      // Mark auth as initialized successfully
      setInitialized(true);
    } catch (error) {
      console.error('Auth state change error:', error);
      clearUser();
      setInitializationError(error instanceof Error ? error.message : 'Authentication failed');
    }
  }, [setUser, clearUser, setInitialized, setInitializationError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [handleAuthStateChange]);
}; 