import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const StoreContext = createContext(null);

export const useStoreSettings = () => {
    return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteName: 'Abaya Store',
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
            const { data } = await axios.get('http://localhost:5000/api/settings');
            setSettings(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch store settings:', error);
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
