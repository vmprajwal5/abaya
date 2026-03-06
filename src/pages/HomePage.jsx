import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const { data } = await fetchProducts();
                setProducts(Array.isArray(data) ? data : (data.products || []));
            } catch (err) {
                setError(err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-white">
                <div className="w-16 h-16 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400 font-sans">Loading Collection</div>
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500 font-mono text-sm">{error}</div>;
    }

    // Marquee Content
    const marqueeText = "LUXURY • MODESTY • ELEGANCE • TIMELESS • SOPHISTICATION • ";

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Immersive Hero Section - Full Screen */}
            <div className="relative h-screen w-full overflow-hidden">
                {/* Hero Image */}
                <div className="absolute inset-0">
                    <img
                        src="/images/hero-abaya.png"
                        alt="Luxury Abaya Collection"
                        className="w-full h-full object-cover grayscale contrast-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Hero Content - Giant Hollow Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="text-5xl md:text-8xl lg:text-9xl font-bold text-transparent tracking-tighter text-center"
                        style={{ WebkitTextStroke: "1px white" }}
                    >
                        ABAYA CLOTHING
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-8 font-sans text-white/80 text-sm md:text-base tracking-[0.3em] uppercase"
                    >
                        Elegance in Every Detail
                    </motion.p>
                </div>

                {/* Scroll Down Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={20} className="w-6 h-6" />
                </motion.div>
            </div>

            {/* 2. Marquee Section */}
            <div className="bg-black text-white py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    className="inline-block"
                >
                    <span className="text-xs md:text-sm font-light tracking-[0.5em] uppercase mx-4">
                        {marqueeText.repeat(10)}
                    </span>
                </motion.div>
            </div>

            {/* 3. Product Grid - Staggered/Masonry Layout */}
            <div className="container mx-auto px-4 md:px-12 py-24">
                {/* Section Title */}
                <div className="flex flex-col items-center justify-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-serif text-black mb-4">
                        Trending
                    </h2>
                    <div className="w-24 h-px bg-black/20"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.length > 0 ? (
                        products.slice(0, 3).map((product, index) => {
                            return (
                                <div
                                    key={product._id || product.id}
                                    className={`${(index % 2 !== 0) && "md:mt-24"}`} // Stagger effect on desktop
                                >
                                    <ProductCard product={product} />
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 font-sans tracking-widest text-sm uppercase">
                            Collection currently empty.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
