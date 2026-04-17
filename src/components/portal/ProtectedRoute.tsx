import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/portal/login" replace />;

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-4 border border-border rounded-lg p-8 bg-card">
          <h1 className="text-2xl font-heading font-bold">Access pending</h1>
          <p className="text-muted-foreground">
            Your email is not whitelisted yet. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && role !== 'admin') return <Navigate to="/portal" replace />;

  return <>{children}</>;
}
