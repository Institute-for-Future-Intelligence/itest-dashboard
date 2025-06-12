import type { ReactNode } from 'react';
import { useAuthListener } from '../../hooks/useAuthListener';
import AuthInitializer from './AuthInitializer';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize authentication listener
  useAuthListener();

  return (
    <AuthInitializer>
      {children}
    </AuthInitializer>
  );
};

export default AuthProvider; 