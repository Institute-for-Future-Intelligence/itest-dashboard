// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default PrivateRoute;