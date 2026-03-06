import { createContext, useContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext(undefined);

export function useCurrency() {
    return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('currency') || 'MVR';
    });

    const exchangeRate = 15.42;

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'MVR' ? 'USD' : 'MVR');
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return currency === 'MVR' ? 'MVR 0' : '$0';

        const formattedPrice = typeof price === 'number'
            ? price.toLocaleString()
            : parseFloat(price).toLocaleString();

        return currency === 'MVR'
            ? `MVR ${formattedPrice}`
            : `$${formattedPrice}`;
    };

    const convertPrice = (price, from) => {
        if (from === currency) return price;

        if (from === 'MVR' && currency === 'USD') {
            return Math.round((price / exchangeRate) * 100) / 100;
        } else if (from === 'USD' && currency === 'MVR') {
            return Math.round(price * exchangeRate);
        }

        return price;
    };

    const value = {
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        convertPrice,
        exchangeRate
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}
