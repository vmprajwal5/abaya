import { createContext, useContext, useState, useEffect } from 'react';
import useStoreSettings from '../hooks/useStoreSettings';
import toast from 'react-hot-toast';

export const CartContext = createContext(undefined);

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const { settings } = useStoreSettings();
    // Load cart from localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addToCart = (product, qty = 1) => {
        if (!product || !product._id) return;
        setCart(prevCart => {
            // Check if item already exists
            const existingItemIndex = prevCart.findIndex(
                item => item.productId === (product._id || product.id)
            );

            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += qty;
                showToast('Item quantity updated');
                return updatedCart;
            } else {
                // New item
                const newItem = {
                    productId: product._id || product.id,
                    name: product.name || product.title, // Handle title usage too
                    image: product.image,
                    price: product.price || product.priceMVR, // Handle priceMVR usage
                    quantity: qty,
                    size: product.size,
                    color: product.color,
                    addedAt: new Date().toISOString(),
                };
                showToast('Item added to cart');
                return [...prevCart, newItem];
            }
        });

        setTimeout(() => setIsCartOpen(true), 0);
    };

    // Update cart item quantity
    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
        showToast('Item removed from cart');
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        showToast('Cart cleared');
    };

    // Get cart totals
    const getCartTotals = () => {
        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const shippingCost = settings ? settings.shippingPrice : 50;
        const freeThreshold = settings ? settings.freeShippingThreshold : 1000;

        const shipping = subtotal > freeThreshold ? 0 : shippingCost;
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            total: Math.round(total * 100) / 100,
            itemCount: cart.reduce((count, item) => count + item.quantity, 0)
        };
    };

    // Toast notification helper
    const showToast = (message) => {
        toast.success(message);
    };

    // Validate cart before checkout
    const validateCart = () => {
        const errors = [];

        if (cart.length === 0) {
            errors.push('Cart is empty');
            return { valid: false, errors };
        }

        cart.forEach((item, index) => {
            // Check required fields
            if (!item.productName && !item.title) {
                errors.push(`Item ${index + 1}: Missing product name`);
            }
            if (!item.productImage && !item.image) {
                errors.push(`Item ${index + 1}: Missing product image`);
            }
            if (!item.price && !item.priceMVR) {
                errors.push(`Item ${index + 1}: Missing price information`);
            }

            // Validate quantity
            if (!item.quantity || item.quantity < 1) {
                errors.push(`Item ${index + 1}: Invalid quantity`);
            }
            if (item.quantity > 99) {
                errors.push(`Item ${index + 1}: Quantity too large (max 99)`);
            }

            // Check if item has size and color
            if (!item.size) {
                errors.push(`Item ${index + 1}: Missing size selection`);
            }
            if (!item.color) {
                errors.push(`Item ${index + 1}: Missing color selection`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    };

    const value = {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotals,
        isCartOpen,
        setIsCartOpen,
        itemCount: cart.reduce((count, item) => count + item.quantity, 0),
        validateCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
