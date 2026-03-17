import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
    const { cart, removeFromCart: contextRemove, updateQuantity: contextUpdate, getCartTotals, clearCart } = useCart();
    const { currentUser, loading } = useAuth();
    const { formatPrice, convertPrice } = useCurrency();
    const navigate = useNavigate();
    const totals = getCartTotals();

    // Update quantity
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('Quantity must be at least 1');
            return;
        }
        try {
            const response = await cartAPI.updateItem(itemId, { quantity: newQuantity });
            if (response?.success || response?.cart) {
                contextUpdate(itemId, newQuantity);
                toast.success('Cart updated');
            }
        } catch (error) {
            console.error('Update cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to update cart');
            if (error.response?.status === 404) contextUpdate(itemId, newQuantity);
        }
    };

    // Remove item
    const removeFromCart = async (itemId) => {
        try {
            const response = await cartAPI.removeItem(itemId);
            if (response?.success || response?.cart) {
                contextRemove(itemId);
                toast.success('Item removed from cart');
            }
        } catch (error) {
            console.error('Remove item error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item');
            if (error.response?.status === 404) contextRemove(itemId);
        }
    };

    // Apply coupon
    const applyCoupon = async (code) => {
        if (!code || code.trim() === '') {
            toast.error('Please enter a coupon code');
            return;
        }
        try {
            const response = await cartAPI.applyCoupon(code.trim());
            if (response?.success) {
                toast.success(`Coupon applied! You saved MVR ${response.data.discount}`);
            }
        } catch (error) {
            console.error('Apply coupon error:', error);
            const errorMsg = error.response?.data?.message || 'Invalid or expired coupon';
            toast.error(errorMsg);
        }
    };

    // Convert totals from MVR to current currency
    const convertedTotals = {
        subtotal: convertPrice(totals.subtotal, 'MVR'),
        shipping: convertPrice(totals.shipping, 'MVR'),
        tax: convertPrice(totals.tax, 'MVR'),
        total: convertPrice(totals.total, 'MVR')
    };

    if (loading) return <LoadingSpinner message="Loading cart..." />;

    if (cart.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold uppercase tracking-widest">Your Cart is Empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => {
                        const itemPrice = convertPrice(item.price, 'MVR');
                        return (
                            <div key={item.productId} className="flex gap-4 border-b border-gray-100 pb-6">
                                {/* Product Image */}
                                <div className="w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-lg uppercase tracking-wide">{item.name}</h3>
                                            <p className="font-semibold">{formatPrice(itemPrice)}</p>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">ID: {item.productId}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-50"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-red-500 text-xs uppercase tracking-wider hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={clearCart}
                        className="text-gray-500 text-sm hover:text-black underline"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-6 h-fit sticky top-4">
                    <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">Order Summary</h2>

                    <div className="space-y-4 mb-6 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatPrice(convertedTotals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">{totals.shipping === 0 ? 'Free' : formatPrice(convertedTotals.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax (5%)</span>
                            <span className="font-medium">{formatPrice(convertedTotals.tax)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{formatPrice(convertedTotals.total)}</span>
                        </div>
                    </div>

                    {/* Auth Status Message */}
                    {!currentUser && (
                        <p className="text-xs text-red-500 mb-2">
                            * Please log in to complete your purchase
                        </p>
                    )}

                    <button
                        className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                        onClick={() => {
                            if (!currentUser) {
                                navigate('/login?redirect=/cart');
                            } else {
                                navigate('/checkout');
                            }
                        }}
                    >
                        {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
