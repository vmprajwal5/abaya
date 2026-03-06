import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useSearchParams, Link } from "react-router-dom"
import { Grid, List, ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { cn } from "../lib/utils"
import { useShop } from "../contexts/ShopContext"
import { Button } from "../components/ui/button"
import * as Slider from "@radix-ui/react-slider"
import * as Accordion from "@radix-ui/react-accordion"
import { Loader2 } from "lucide-react"

const ITEMS_PER_PAGE = 9

export function CategoryPage() {
    const { slug } = useParams()
    const { formatPrice, products, loading } = useShop()
    const [searchParams, setSearchParams] = useSearchParams()

    // State derived from URL
    const viewMode = searchParams.get("view") || "grid"
    const sortBy = searchParams.get("sort") || "newest"
    const currentPage = parseInt(searchParams.get("page") || "1")

    // Filter State - MUST be called before any conditional returns
    const [priceRange, setPriceRange] = useState([0, 5000])
    const [selectedColors, setSelectedColors] = useState([])
    const [selectedSizes, setSelectedSizes] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedFabrics, setSelectedFabrics] = useState([])

    // Mobile Drawer State
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Sync URL filters to state on mount (simplified for this demo, usually we'd sync both ways robustly)
    // For now, we'll keep local state for filters to allow "Apply" but URL for view/sort/page

    // Derived Data (Filtering) - MUST be called before any conditional returns
    const filteredProducts = useMemo(() => {
        // Return empty if loading or no products
        if (!products || products.length === 0) return [];

        let result = products.filter(product => {
            // Main Category Slug (e.g., "Abayas")
            // Main Category Slug
            if (slug && slug !== "all") {
                // Handle special "new-arrivals" slug causing issues if not handled
                if (slug === 'new-arrivals') {
                    // Logic handled in sort usually, or verified by isNew
                    return true;
                }
                // If slug is "abayas", show all (since it's the main store name basically)
                if (slug === 'abayas') return true;

                // Otherwise match specific category
                if (product.category && product.category.toLowerCase() !== slug.toLowerCase()) {
                    return false
                }
            }

            // Sub Category Filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.subCategory)) {
                return false
            }

            // Fabric Filter
            if (selectedFabrics.length > 0 && !selectedFabrics.includes(product.fabric)) {
                return false
            }


            // Price Filter - Check if product has priceMVR, fallback to price
            const productPrice = product.priceMVR || product.price || 0;
            if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
                return false
            }

            // Color Filter
            if (selectedColors.length > 0) {
                const hasColor = product.colors && product.colors.some(c => selectedColors.includes(c.name))
                if (!hasColor) return false
            }

            // Size Filter
            if (selectedSizes.length > 0) {
                const hasSize = product.size && product.size.some(s => selectedSizes.includes(s))
                if (!hasSize) return false
            }

            return true
        })

        // Sorting
        return result.sort((a, b) => {
            if (sortBy === "price-low") return a.priceMVR - b.priceMVR
            if (sortBy === "price-high") return b.priceMVR - a.priceMVR
            if (sortBy === "popular") return b.rating - a.rating
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) // Newest first approximation
        })
    }, [slug, priceRange, selectedColors, selectedSizes, selectedCategories, selectedFabrics, sortBy, products])

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Lock body scroll when filter is open - MUST be before any conditional returns
    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
    }, [isFilterOpen])

    // Handle loading state AFTER all hooks are declared
    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
        )
    }

    // Handlers
    const updateParam = (key, value) => {
        setSearchParams(prev => {
            prev.set(key, value)
            return prev
        })
    }

    const toggleFilter = (item, setter) => {
        setter(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        )
        // Reset page on filter change
        updateParam("page", "1")
    }

    // Constants
    const subCategories = ["Daily Wear", "Party Wear", "Embroidered", "Open Abayas", "Premium"]
    const fabrics = ["Nida", "Crepe", "Chiffon", "Silk", "Cotton"]
    const colors = [
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#000080" },
        { name: "Burgundy", hex: "#800020" },
        { name: "Grey", hex: "#808080" },
        { name: "Beige", hex: "#F5F5DC" },
        { name: "Brown", hex: "#964B00" }
    ]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedFabrics([])
        setSelectedColors([])
        setSelectedSizes([])
        setPriceRange([0, 5000])
        updateParam("page", "1")
    }

    const renderFilterContent = () => (
        <div className="space-y-8 pr-4">
            <Accordion.Root type="multiple" defaultValue={["category", "price"]} className="space-y-6">

                {/* Categories */}
                <Accordion.Item value="category" className="border-b border-gray-100 pb-6">
                    <Accordion.Trigger className="flex items-center justify-between w-full font-serif font-bold text-lg mb-4 group">
                        Category
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="space-y-3">
                        {subCategories.map(cat => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn(
                                    "w-4 h-4 border flex items-center justify-center transition-colors",
                                    selectedCategories.includes(cat) ? "bg-secondary border-secondary" : "border-gray-300 group-hover:border-secondary"
                                )}>
                                    {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleFilter(cat, setSelectedCategories)}
                                />
                                <span className={cn("text-sm transition-colors", selectedCategories.includes(cat) ? "text-black font-medium" : "text-gray-600")}>
                                    {cat}
                                </span>
                            </label>
                        ))}
                    </Accordion.Content>
                </Accordion.Item>

                {/* Size */}
                <Accordion.Item value="size" className="border-b border-gray-100 pb-6">
                    <Accordion.Trigger className="flex items-center justify-between w-full font-serif font-bold text-lg mb-4 group">
                        Size
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => toggleFilter(size, setSelectedSizes)}
                                    className={cn(
                                        "h-10 border text-sm flex items-center justify-center transition-all",
                                        selectedSizes.includes(size)
                                            ? "border-secondary bg-secondary text-white"
                                            : "border-gray-200 hover:border-black text-gray-700"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <button className="text-xs text-gray-400 underline mt-4 hover:text-secondary">Size Guide</button>
                    </Accordion.Content>
                </Accordion.Item>

                {/* Color */}
                <Accordion.Item value="color" className="border-b border-gray-100 pb-6">
                    <Accordion.Trigger className="flex items-center justify-between w-full font-serif font-bold text-lg mb-4 group">
                        Color
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <div className="flex flex-wrap gap-3">
                            {colors.map(color => (
                                <div key={color.name} className="flex flex-col items-center gap-1 group">
                                    <button
                                        onClick={() => toggleFilter(color.name, setSelectedColors)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-all",
                                            selectedColors.includes(color.name) ? "ring-2 ring-secondary ring-offset-2" : "hover:scale-110"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                    <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>

                {/* Price */}
                <Accordion.Item value="price" className="border-b border-gray-100 pb-6">
                    <Accordion.Trigger className="flex items-center justify-between w-full font-serif font-bold text-lg mb-4 group">
                        Price Range
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <div className="px-2 pt-4">
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={priceRange}
                                max={5000}
                                step={100}
                                onValueChange={setPriceRange}
                                minStepsBetweenThumbs={1}
                            >
                                <Slider.Track className="bg-gray-200 relative grow rounded-sm h-[3px]">
                                    <Slider.Range className="absolute bg-secondary h-full" />
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block w-4 h-4 bg-white border border-secondary shadow-md hover:scale-110 focus:outline-none transition-all cursor-grab active:cursor-grabbing rounded-full"
                                    aria-label="Min price"
                                />
                                <Slider.Thumb
                                    className="block w-4 h-4 bg-white border border-secondary shadow-md hover:scale-110 focus:outline-none transition-all cursor-grab active:cursor-grabbing rounded-full"
                                    aria-label="Max price"
                                />
                            </Slider.Root>
                            <div className="flex justify-between mt-6 text-sm font-medium text-gray-600">
                                <span>{formatPrice(priceRange[0], priceRange[0] / 15.42)}</span>
                                <span>{formatPrice(priceRange[1], priceRange[1] / 15.42)}</span>
                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion.Item>

                {/* Fabric */}
                <Accordion.Item value="fabric" className="pb-6">
                    <Accordion.Trigger className="flex items-center justify-between w-full font-serif font-bold text-lg mb-4 group">
                        Fabric
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="space-y-3">
                        {fabrics.map(fabric => (
                            <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn(
                                    "w-4 h-4 border flex items-center justify-center transition-colors",
                                    selectedFabrics.includes(fabric) ? "bg-secondary border-secondary" : "border-gray-300 group-hover:border-secondary"
                                )}>
                                    {selectedFabrics.includes(fabric) && <div className="w-2 h-2 bg-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedFabrics.includes(fabric)}
                                    onChange={() => toggleFilter(fabric, setSelectedFabrics)}
                                />
                                <span className={cn("text-sm transition-colors", selectedFabrics.includes(fabric) ? "text-black font-medium" : "text-gray-600")}>
                                    {fabric}
                                </span>
                            </label>
                        ))}
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Root>

            <button
                onClick={clearAllFilters}
                className="w-full py-3 text-sm text-gray-500 border border-gray-200 hover:border-black hover:text-black transition-colors uppercase tracking-widest"
            >
                Clear All Filters
            </button>
        </div>
    )

    const renderFilterDrawer = () => (
        <AnimatePresence>
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFilterOpen(false)}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto lg:hidden"
                    >
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <h2 className="font-serif text-2xl font-bold">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {renderFilterContent()}
                        <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-6">
                            <Button className="w-full bg-secondary text-white hover:bg-primary h-12 uppercase tracking-widest" onClick={() => setIsFilterOpen(false)}>
                                Show {filteredProducts.length} Results
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    const renderActiveFilters = () => {
        const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || selectedFabrics.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000
        if (!hasFilters) return null

        return (
            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
                {selectedCategories.map(c => (
                    <div key={c} className="flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs text-gray-600 rounded-full">
                        {c} <button onClick={() => toggleFilter(c, setSelectedCategories)}><X className="w-3 h-3 hover:text-red-500" /></button>
                    </div>
                ))}
                {selectedSizes.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs text-gray-600 rounded-full">
                        Size: {s} <button onClick={() => toggleFilter(s, setSelectedSizes)}><X className="w-3 h-3 hover:text-red-500" /></button>
                    </div>
                ))}
                {selectedColors.map(c => (
                    <div key={c} className="flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs text-gray-600 rounded-full">
                        {c} <button onClick={() => toggleFilter(c, setSelectedColors)}><X className="w-3 h-3 hover:text-red-500" /></button>
                    </div>
                ))}
                {selectedFabrics.map(f => (
                    <div key={f} className="flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs text-gray-600 rounded-full">
                        {f} <button onClick={() => toggleFilter(f, setSelectedFabrics)}><X className="w-3 h-3 hover:text-red-500" /></button>
                    </div>
                ))}
                <button onClick={clearAllFilters} className="text-xs text-secondary hover:text-primary underline ml-2">Clear All</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {renderFilterDrawer()}

            {/* Hero Header */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-black">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-abaya.png"
                        alt="Collection Background"
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container relative z-10 text-center space-y-4">
                    {/* Breadcrumb */}
                    <div className="flex justify-center items-center gap-2 text-xs text-gray-300 uppercase tracking-widest mb-4">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-white font-bold">{slug || "Shop"}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-white capitalize">{slug || "Collection"}</h1>
                    <p className="text-gray-200 max-w-2xl mx-auto font-light text-lg">
                        Discover our exquisite collection of premium abayas, hand-crafted with the finest fabrics for elegance and modularity.
                    </p>

                </div>
            </div>

            <div className="container py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT SIDEBAR (Desktop) */}
                    <aside className="hidden lg:block w-1/4 flex-shrink-0">
                        <div className="sticky top-24">
                            <h3 className="font-serif font-bold text-xl mb-6 pb-4 border-b border-gray-100">Filters</h3>
                            {renderFilterContent()}
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                            <span className="text-sm text-gray-500 font-medium">
                                Showing {paginatedProducts.length} of {filteredProducts.length} products
                            </span>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <Button
                                    variant="outline"
                                    className="lg:hidden flex items-center gap-2 h-10"
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </Button>

                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => updateParam("sort", e.target.value)}
                                            className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm border border-gray-200 rounded-none focus:border-secondary focus:ring-0 cursor-pointer min-w-[180px]"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="popular">Most Popular</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>


                                    <div className="flex border border-gray-200 rounded-none overflow-hidden">
                                        <button
                                            onClick={() => updateParam("view", "grid")}
                                            className={cn(
                                                "p-2.5 transition-colors",
                                                viewMode === "grid" ? "bg-black text-white" : "bg-white text-gray-400 hover:text-black"
                                            )}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <div className="w-[1px] bg-gray-200" />
                                        <button
                                            onClick={() => updateParam("view", "list")}
                                            className={cn(
                                                "p-2.5 transition-colors",
                                                viewMode === "list" ? "bg-black text-white" : "bg-white text-gray-400 hover:text-black"
                                            )}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {renderActiveFilters()}

                        {filteredProducts.length > 0 ? (
                            <>
                                <div className={cn(
                                    "grid gap-x-8 gap-y-12 animate-fade-in",
                                    viewMode === "grid"
                                        ? "grid-cols-1 md:grid-cols-3 gap-8"
                                        : "grid-cols-1"
                                )}>
                                    {paginatedProducts.map(product => {
                                        if (!product || !product._id) return null;
                                        return (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-20 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => updateParam("page", String(Math.max(1, currentPage - 1)))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateParam("page", String(i + 1))}
                                                className={cn(
                                                    "w-10 h-10 flex items-center justify-center border text-sm transition-colors",
                                                    currentPage === i + 1
                                                        ? "bg-secondary border-secondary text-white"
                                                        : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => updateParam("page", String(Math.min(totalPages, currentPage + 1)))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-20 text-center space-y-6 bg-gray-50 rounded-lg">
                                <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-serif">No products found</h3>
                                    <p className="text-gray-500">We couldn&apos;t find any matches for your filters.</p>
                                </div>
                                <Button
                                    onClick={clearAllFilters}
                                    className="bg-black text-white hover:bg-secondary px-8"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
