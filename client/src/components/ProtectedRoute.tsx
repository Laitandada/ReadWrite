import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
