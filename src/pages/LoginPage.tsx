import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({
        uid: user.uid,
      });
      
      // Redirect to home page
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;