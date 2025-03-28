
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  redirectTo?: string;
}

export const PrivateRoute = ({ redirectTo = '/auth' }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dashboard-accent1"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};
