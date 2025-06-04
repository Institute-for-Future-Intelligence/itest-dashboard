import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LogoutPage from './pages/LogoutPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter basename="/itest-dashboard">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;