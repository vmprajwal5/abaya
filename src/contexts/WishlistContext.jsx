import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]); // array of product objects or IDs

    // Fetch wishlist from backend on mount if logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        authAPI.getWishlist()
            .then((data) => {
                // data is an array of populated product objects
                const list = Array.isArray(data) ? data : [];
                const ids = list.map((p) => (typeof p === 'object' ? p._id : p));
                setWishlist(ids);
            })
            .catch(() => {
                // not logged in or other error — silently ignore
            });
    }, []);

    const isWishlisted = (productId) => wishlist.includes(productId);

    const toggleWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to save favourites ❤️');
            return;
        }

        if (isWishlisted(productId)) {
            try {
                await authAPI.removeFromWishlist(productId);
                setWishlist((prev) => prev.filter((id) => id !== productId));
                toast.success('Removed from favourites');
            } catch {
                toast.error('Failed to remove from favourites');
            }
        } else {
            try {
                await authAPI.addToWishlist(productId);
                setWishlist((prev) => [...prev, productId]);
                toast.success('Added to favourites ❤️');
            } catch {
                toast.error('Failed to add to favourites');
            }
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
