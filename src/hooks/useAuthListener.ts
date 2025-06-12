import { useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../firebase/firestore';

export const useAuthListener = () => {
  const { setUser, clearUser } = useUserStore();
  const { setInitialized, setInitializationError } = useAuthStore();

  const handleAuthStateChange = useCallback(async (firebaseUser: FirebaseUser | null) => {
    try {
      if (firebaseUser) {
        // User is signed in
        const userData = await userService.createOrUpdateUser(firebaseUser.uid);
        setUser(userData);
      } else {
        // User is signed out
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