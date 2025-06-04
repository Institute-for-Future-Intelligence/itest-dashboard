import { useUserStore } from '../store/useUserStore';
import { useLogout } from '../utils/logout';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const user = useUserStore((state) => state.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome, {user?.uid || 'Guest'}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;