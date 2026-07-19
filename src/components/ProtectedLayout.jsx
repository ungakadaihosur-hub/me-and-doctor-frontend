import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';

export default function ProtectedLayout() {
  const { claims } = useAuth();

  if (!claims) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
