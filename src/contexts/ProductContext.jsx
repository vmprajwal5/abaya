import { createContext, useContext, useState, useEffect } from 'react';
import { sampleProducts } from '../data/products';

export const ProductContext = createContext(undefined);

export function useProducts() {
    return useContext(ProductContext);
}

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        minPrice: 0,
        maxPrice: 10000,
        sizes: [],
        colors: []
    });

    // Load products on mount
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Network Error');
            setLoading(false);
            // Fallback to sample products if API fails
            setProducts(sampleProducts);
        }
    };

    // Get filtered products
    const getFilteredProducts = () => {
        let filtered = [...products];

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Filter by price range
        filtered = filtered.filter(p =>
            p.prices.mvr >= filters.minPrice &&
            p.prices.mvr <= filters.maxPrice
        );

        return filtered;
    };

    // Get featured products
    const getFeaturedProducts = () => {
        return products.filter(p => p.featured && p.status === 'active');
    };

    // Get new arrivals
    const getNewArrivals = () => {
        return products.filter(p => p.newArrival && p.status === 'active');
    };

    // Get product by ID
    const getProductById = (id) => {
        return products.find(p => p.id === id || p.slug === id);
    };

    const value = {
        products,
        loading,
        error,
        filters,
        setFilters,
        getFilteredProducts,
        getFeaturedProducts,
        getNewArrivals,
        getProductById,
        refreshProducts: loadProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}
