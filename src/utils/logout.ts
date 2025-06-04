import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser);

  const logout = async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return logout;
};