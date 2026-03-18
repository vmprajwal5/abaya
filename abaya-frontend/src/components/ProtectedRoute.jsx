import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();

  console.log('🔒 ProtectedRoute check:', {
    user,
    loading,
    adminOnly,
    isAdmin: isAdmin(),
    isAuthenticated: isAuthenticated()
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    console.log('❌ Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted');
  return children;
}
