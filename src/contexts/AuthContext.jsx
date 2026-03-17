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
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    // Verify session is still valid with the server
                    const response = await authAPI.getMe();
                    if (response && response.data) {
                        setCurrentUser(response.data);
                    } else {
                        setCurrentUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Session expired or invalid — clear stored user
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        if (response && response.user) {
            setCurrentUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    };

    const signup = async (name, email, password, phone) => {
        const response = await authAPI.register({ name, email, password, phone });
        if (response && response.user) {
            setCurrentUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    };

    const logout = () => {
        authAPI.logout();
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userInfo'); // Cleanup old admin user tokens
    };

    const value = { currentUser, loading, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
