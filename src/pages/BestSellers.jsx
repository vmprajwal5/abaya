import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';

export default function BestSellers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const data = await productsAPI.getAll();
            // Sort by rating descending (best sellers = highest rated)
            const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setProducts(sorted);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-light tracking-widest uppercase text-black mb-3">
                    Best Sellers
                </h1>
                <p className="text-gray-500 text-sm">Our most loved abayas — chosen by you</p>
                <div className="w-12 h-px bg-black mx-auto mt-4" />
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="w-8 h-8 border border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-sm tracking-wider uppercase">No products found</p>
                    <Link
                        to="/shop"
                        className="mt-6 inline-block text-xs tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors"
                    >
                        Browse All
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product) => {
                        const image =
                            Array.isArray(product.images) && product.images.length > 0
                                ? product.images[0]
                                : product.image || '';
                        return (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="group block"
                            >
                                <div className="overflow-hidden bg-gray-50 aspect-[3/4] mb-4">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 tracking-wide truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">₹{product.price?.toLocaleString()}</p>
                                {product.rating > 0 && (
                                    <p className="text-xs text-amber-500 mt-1">
                                        {'★'.repeat(Math.round(product.rating))}
                                        {'☆'.repeat(5 - Math.round(product.rating))}
                                        <span className="text-gray-400 ml-1">({product.numReviews || 0})</span>
                                    </p>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
