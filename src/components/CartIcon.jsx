import { useCart } from '../contexts/CartContext';

function CartIcon() {
    const { itemCount, setIsCartOpen } = useCart();

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 group transition-opacity hover:opacity-70"
            aria-label="Open Cart"
        >
            <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
            {itemCount > 0 && (
                <span className="absolute top-1 right-0 bg-black text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </button>
    );
}

export default CartIcon;
