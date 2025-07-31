import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Truck } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'carrier' | 'shipper' | 'individual' | 'company';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}