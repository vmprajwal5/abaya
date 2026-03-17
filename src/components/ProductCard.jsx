import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

function ProductCard({ product }) {
    const { formatPrice, convertPrice } = useCurrency();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    // Guard clause for missing product data
    if (!product) return null;

    const handleViewDetails = () => {
        // Allow clicks on the image/title to navigate
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    // Convert price from MVR (base) to current currency
    const finalPrice = convertPrice(product.price, 'MVR');

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="group block relative cursor-pointer"
            onClick={handleViewDetails}
        >
            {/* Image Container - Removed borders, relying on pure visual */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                {!imageError ? (
                    <img
                        src={product?.images?.[0] || product?.image || '/placeholder.jpg'}
                        alt={product?.name || 'Product'}
                        loading="lazy"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-xs uppercase tracking-[0.2em]">
                        No Image
                    </div>
                )}

                {/* Add to Cart Button Overlay - Slide up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white text-xs uppercase tracking-[0.2em] py-4 hover:bg-white hover:text-black transition-colors duration-300 border-t border-black"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Info - Minimalist, spaced out */}
            <div className="flex flex-col items-start space-y-2 px-1">
                <h3 className="font-serif text-xl mb-2 text-black group-hover:text-black/80 transition-colors duration-300">
                    {product?.name || 'Unnamed Product'}
                </h3>

                <div className="font-sans text-lg font-semibold text-gray-900 mt-2">
                    {formatPrice(convertPrice(product?.price || product?.priceMVR || 0, 'MVR'))}
                </div>
            </div>
        </motion.div>
    );
}

export default ProductCard;
