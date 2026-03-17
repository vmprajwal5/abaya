import { useState, useEffect, useRef } from "react"
import { Search, X, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { useShop } from "../contexts/ShopContext"

export function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState("")
    const inputRef = useRef(null)
    const { products } = useShop()

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Filter products
    const results = query.length > 1
        ? products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
        : []

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-white transition-opacity"
                >
                    <div className="container max-w-[1400px] h-full flex flex-col pt-24 pb-10 px-6 md:px-12">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 hover:opacity-50 transition-opacity"
                        >
                            <X className="w-8 h-8 text-black stroke-[1px]" />
                        </button>

                        {/* Search Input */}
                        <div className="max-w-4xl mx-auto w-full mb-16">
                            <div className="relative border-b border-gray-200 focus-within:border-black transition-colors">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" strokeWidth={1.5} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="SEARCH..."
                                    className="w-full bg-transparent py-6 pl-12 pr-4 text-2xl md:text-4xl font-light text-black placeholder:text-gray-200 focus:outline-none uppercase tracking-wide"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto">
                            {query.length === 0 && (
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-8">Suggest</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {["Classic Abaya", "Daily Wear", "New Collection", "Scarves", "Gifts"].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-6 py-3 border border-gray-100 text-gray-500 text-xs uppercase tracking-wider hover:border-black hover:text-black transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-6">Products</h3>
                                    {results.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/product/${product._id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-6 p-4 hover:bg-gray-50 group transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-16 h-20 bg-gray-100 overflow-hidden">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"  loading="lazy" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-black uppercase tracking-wide text-sm group-hover:text-black/70 transition-colors">{product.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">MVR {product.priceMVR}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {query.length > 1 && results.length === 0 && (
                                <div className="text-center text-gray-400 py-12">
                                    <p className="font-light">No matches for &quot;{query}&quot;</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
