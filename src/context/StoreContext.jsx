import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const StoreContext = createContext(null);

export const useStoreSettings = () => {
    return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteName: 'Abaya Store',
        storeDescription: 'Welcome to our premium modest clothing store.',
        storeAddress: 'Male, Maldives',
        currency: 'MVR',
        taxRate: 6,
        orderPrefix: 'ABY-',
        supportEmail: '',
        supportPhone: '',
        shippingPrice: 50,
        freeShippingThreshold: 1000,
        socialLinks: { instagram: '', facebook: '', whatsapp: '' },
        announcementBar: { show: false, text: '' },
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await API.get('/settings');
            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch store settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <StoreContext.Provider value={{ settings, loading, fetchSettings }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContext;
