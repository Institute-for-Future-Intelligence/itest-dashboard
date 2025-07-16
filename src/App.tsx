import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import SensorPage from './pages/SensorPage';
import WaterQualityPage from './pages/WaterQualityPage';
import AdminPage from './pages/AdminPage';
import LogoutPage from './pages/LogoutPage';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './components/auth/AuthProvider';

function App() {
  return (
    <BrowserRouter basename="/itest-dashboard">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
          <Route path="/sensors" element={<PrivateRoute><SensorPage /></PrivateRoute>} />
          <Route path="/water-quality" element={<PrivateRoute><WaterQualityPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;