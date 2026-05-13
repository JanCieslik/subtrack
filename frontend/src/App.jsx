import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddSubscriptionPage from './pages/AddSubscriptionPage';
import EditSubscriptionPage from './pages/EditSubscriptionPage';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/add-subscription"
        element={<ProtectedRoute><AddSubscriptionPage /></ProtectedRoute>}
      />
      <Route
        path="/edit/:id"
        element={<ProtectedRoute><EditSubscriptionPage /></ProtectedRoute>}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
