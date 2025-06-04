import { useUserStore } from '../store/useUserStore';

function HomePage() {
  const user = useUserStore((state) => state.user);

  return (
    <div>
      <h1>Welcome, {user?.uid || 'Guest'}!</h1>
    </div>
  );
}

export default HomePage;