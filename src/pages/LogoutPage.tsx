import { useEffect } from 'react';
import { useLogout } from '../utils/logout';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => navigate('/'));
  }, []);

  return <h1>Logging out...</h1>;
}

export default LogoutPage;