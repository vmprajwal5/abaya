import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const user = await authAPI.getCurrentUser();
                    setCurrentUser(user);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('authToken');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const user = await authAPI.login({ email, password });
        setCurrentUser(user);
        return user;
    };

    const signup = async (name, email, password) => {
        const user = await authAPI.register({ name, email, password });
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        authAPI.logout();
        setCurrentUser(null);
    };

    const value = { currentUser, loading, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
