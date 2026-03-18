import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const StoreContext = createContext(null);

export const useStoreSettings = () => {
    return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
    const [settings] = useState({
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
            // Settings API does not exist yet. Use defaults.
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch store settings:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSettings();
    }, []);

    return (
        <StoreContext.Provider value={{ settings, loading, fetchSettings }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContext;
