import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
// This component checks if the user is authenticated.
// If not, it redirects them to the login page.
// If the user is authenticated, it renders the children components.
// You can use this component to wrap any routes that require authentication.
// For example, in your App component, you can use it like this:
// <PrivateRoute>
//   <Route path="/home" element={<HomePage />} />
// </PrivateRoute>  