import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        console.log('📦 Loading user from storage:', storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('✅ User loaded:', userData);
        } else {
          console.log('❌ No user in storage');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    console.log('🔐 Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('👋 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    const admin = user && user.role === 'admin';
    console.log('🔍 Is admin?', admin, 'User:', user);
    return admin;
  };

  const isAuthenticated = () => {
    const auth = !!user;
    console.log('🔍 Is authenticated?', auth, 'User:', user);
    return auth;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
