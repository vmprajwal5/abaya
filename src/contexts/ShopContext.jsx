import { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ShopContext = createContext(null);

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) throw new Error('useShop must be used within ShopProvider');
    return context;
};

// Mock products for development/fallback
const getMockProducts = () => [
    {
        _id: '1',
        name: 'Classic Black Abaya',
        slug: 'classic-black-abaya',
        price: 2500,
        priceMVR: 2500,
        title: 'Classic Black Abaya',
        prices: { mvr: 2500, originalMvr: 3000, usd: 162, originalUsd: 195, discount: 17 },
        category: 'Abayas',
        subCategory: 'Daily Wear',
        fabric: 'Nida',
        description: 'Elegant black abaya perfect for daily wear',
        mainImage: '/images/img1.png',
        images: ['/images/img1.png'],
        colors: [{ name: 'Black', hexCode: '#000000' }],
        sizes: ['S', 'M', 'L', 'XL'],
        size: ['S', 'M', 'L', 'XL'],
        reviews: { average: 4.5, count: 120 },
        newArrival: true,
        isNew: true,
    },
    {
        _id: '2',
        name: 'Embroidered Navy Abaya',
        slug: 'embroidered-navy-abaya',
        price: 3500,
        priceMVR: 3500,
        title: 'Embroidered Navy Abaya',
        prices: { mvr: 3500, usd: 227 },
        category: 'Abayas',
        subCategory: 'Party Wear',
        fabric: 'Chiffon',
        description: 'Beautiful navy abaya with gold embroidery',
        mainImage: '/images/img2.png',
        images: ['/images/img2.png'],
        colors: [{ name: 'Navy', hexCode: '#000080' }],
        sizes: ['S', 'M', 'L', 'XL'],
        size: ['S', 'M', 'L', 'XL'],
        reviews: { average: 4.8, count: 85 },
        newArrival: true,
        isNew: true,
    },
    {
        _id: '3',
        name: 'Premium Silk Burgundy Abaya',
        slug: 'premium-silk-burgundy-abaya',
        price: 4500,
        priceMVR: 4500,
        title: 'Premium Silk Burgundy Abaya',
        prices: { mvr: 4500, usd: 292 },
        category: 'Abayas',
        subCategory: 'Premium',
        fabric: 'Silk',
        description: 'Luxurious silk abaya in rich burgundy',
        mainImage: '/images/img3.png',
        images: ['/images/img3.png'],
        colors: [{ name: 'Burgundy', hexCode: '#800020' }],
        sizes: ['M', 'L', 'XL'],
        size: ['M', 'L', 'XL'],
        reviews: { average: 5.0, count: 45 },
        newArrival: false,
        isNew: false,
    },
    {
        _id: '4',
        name: 'Open Style Grey Abaya',
        slug: 'open-style-grey-abaya',
        price: 2800,
        priceMVR: 2800,
        title: 'Open Style Grey Abaya',
        prices: { mvr: 2800, usd: 182 },
        category: 'Abayas',
        subCategory: 'Open Abayas',
        fabric: 'Crepe',
        description: 'Modern open-front abaya in elegant grey',
        mainImage: '/images/img4.png',
        images: ['/images/img4.png'],
        colors: [{ name: 'Grey', hexCode: '#808080' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        size: ['S', 'M', 'L', 'XL', 'XXL'],
        reviews: { average: 4.3, count: 92 },
        newArrival: false,
        isNew: false,
    },
    {
        _id: '5',
        name: 'Beige Cotton Casual Abaya',
        slug: 'beige-cotton-casual-abaya',
        price: 2200,
        priceMVR: 2200,
        title: 'Beige Cotton Casual Abaya',
        prices: { mvr: 2200, originalMvr: 2500, usd: 143, originalUsd: 162, discount: 12 },
        category: 'Abayas',
        subCategory: 'Daily Wear',
        fabric: 'Cotton',
        description: 'Comfortable cotton abaya for everyday use',
        mainImage: '/images/img5.png',
        images: ['/images/img5.png'],
        colors: [{ name: 'Beige', hexCode: '#F5F5DC' }],
        sizes: ['S', 'M', 'L', 'XL'],
        size: ['S', 'M', 'L', 'XL'],
        reviews: { average: 4.2, count: 156 },
        newArrival: true,
        isNew: true,
    },
    {
        _id: '6',
        name: 'Brown Embroidered Formal Abaya',
        slug: 'brown-embroidered-formal-abaya',
        price: 3800,
        priceMVR: 3800,
        title: 'Brown Embroidered Formal Abaya',
        prices: { mvr: 3800, usd: 246 },
        category: 'Abayas',
        subCategory: 'Embroidered',
        fabric: 'Nida',
        description: 'Formal abaya with elegant embroidery',
        mainImage: '/images/img6.png',
        images: ['/images/img6.png'],
        colors: [{ name: 'Brown', hexCode: '#964B00' }],
        sizes: ['M', 'L', 'XL'],
        size: ['M', 'L', 'XL'],
        reviews: { average: 4.6, count: 73 },
        newArrival: false,
        isNew: false,
    },
];

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            const parsedCart = savedCart ? JSON.parse(savedCart) : [];
            // Sanitize: migrated cart must have _id. If not, discard.
            return Array.isArray(parsedCart) ? parsedCart.filter(item => item && (item._id || item.id)) : [];
        } catch (e) {
            console.error("Failed to parse cart", e);
            return [];
        }
    });
    const [currency, setCurrency] = useState('MVR');

    const formatPrice = (priceMVR, priceUSD) => {
        if (currency === 'MVR') {
            const p = priceMVR !== undefined ? priceMVR : 0;
            return `MVR ${p.toLocaleString()}`;
        }
        const p = priceUSD !== undefined ? priceUSD : ((priceMVR || 0) / 15.42);
        return `$${p ? p.toFixed(2) : '0.00'}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productAPI.getAll();


                // If API returns products, use them
                if (data && data.length > 0) {
                    // Normalize data to match frontend expectations
                    const normalizedData = (data || []).map(item => ({
                        ...item,
                        priceMVR: item.price, // Map backend 'price' to frontend 'priceMVR'
                        title: item.name,     // Map backend 'name' to frontend 'title'
                        image: item.images?.[0] || item.image // Ensure 'image' property exists
                    }));

                    setProducts(normalizedData);
                } else {
                    // Fallback: Use mock products if API returns empty or fails
                    console.warn("No products from API, using mock data");
                    setProducts(getMockProducts());
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Use mock products on error
                console.warn("API error, using mock data");
                setProducts(getMockProducts());
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, size, color) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item._id === product._id && item.size === size && item.color === color
            );
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id && item.size === size && item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity, size, color }];
        });
    };

    const removeFromCart = (productId, size, color) => {
        setCart(prevCart =>
            prevCart.filter(item => !(item._id === productId && item.size === size && item.color === color))
        );
    };

    const updateQuantity = (productId, size, color, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        products,
        loading,
        cart,
        currency,
        setCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
