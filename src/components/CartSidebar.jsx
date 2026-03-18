import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

function CartSidebar() {
    const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, getCartTotals } = useCart();
    const { currency, formatPrice } = useCurrency();
    const navigate = useNavigate();

    const totals = getCartTotals(currency);

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col animate-slide-in border-l border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                    <h2 className="text-sm font-medium uppercase tracking-[0.1em]">
                        Shopping Bag ({totals.itemCount})
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 -mr-2 hover:opacity-50 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-8">
                    {cart.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide">Your bag is empty</p>
                            <Button
                                onClick={() => setIsCartOpen(false)}
                                variant="outline"
                                className="w-full max-w-xs"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map(item => {
                                if (!item || !item.name) return null;
                                return (
                                    <div key={item.productId || item.id || item._id} className="flex gap-6">
                                        {/* Image */}
                                        <div className="w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden">
                                            <img
                                                src={item.productImage}
                                                alt={item?.name}
                                                className="w-full h-full object-cover grayscale-[20%]"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h3 className="font-medium text-sm text-black line-clamp-2 uppercase tracking-wide">
                                                        {item?.name}
                                                    </h3>
                                                    <p className="font-medium text-sm text-black whitespace-nowrap">
                                                        {(() => {
                                                            const priceObj = item.price || item.prices || {};
                                                            const price = currency === 'USD'
                                                                ? (priceObj.usd || priceObj.originalUsd || 0)
                                                                : (priceObj.mvr || priceObj.originalMvr || 0);
                                                            return formatPrice(price * item.quantity);
                                                        })()}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Size: {item.size}
                                                </p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                    Color: {item.color?.name}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-xs text-gray-400 hover:text-black underline underline-offset-4 transition-colors uppercase tracking-wider"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with Totals */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-100 p-8 bg-white">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 uppercase tracking-wider text-xs">Subtotal</span>
                                <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 uppercase tracking-wider text-xs">Shipping</span>
                                <span className="font-medium">
                                    {totals.shipping === 0 ? 'CALCULATED AT CHECKOUT' : formatPrice(totals.shipping)}
                                </span>
                            </div>
                            <div className="flex justify-between text-base font-medium pt-4 border-t border-gray-100">
                                <span className="uppercase tracking-widest text-sm">Total</span>
                                <span>{formatPrice(totals.total)}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate('/checkout');
                                }}
                                className="w-full"
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                onClick={() => setIsCartOpen(false)}
                                variant="outline"
                                className="w-full"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartSidebar;
