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
                // Optimistically set user from storage first so UI doesn't flash
                const parsed = JSON.parse(storedUser);
                setCurrentUser(parsed);
                try {
                    // Verify session is still valid with the server
                    // Note: Axios interceptor already unwraps response.data, so
                    // the returned value IS the data object (e.g. { _id, role, ... })
                    /** @type {any} */
                    const userData = await authAPI.getMe();
                    if (userData && userData._id) {
                        setCurrentUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error('Auth check failed — using stored user:', error);
                    // Only clear if it's a definitive 401 (not a network error)
                    if (error?.response?.status === 401) {
                        localStorage.removeItem('user');
                        setCurrentUser(null);
                    }
                    // Otherwise keep the stored user (server may be temporarily down)
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        /** @type {any} */
        const response = await authAPI.login({ email, password });
        if (response && response.user) {
            setCurrentUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    };

    const signup = async (name, email, password, phone) => {
        /** @type {any} */
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
