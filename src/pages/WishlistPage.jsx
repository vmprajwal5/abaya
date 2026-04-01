import { Heart, Trash2, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useWishlist } from "../contexts/WishlistContext"
import { useEffect, useState } from "react"
import { productAPI } from "../services/api"
import { useCurrency } from "../contexts/CurrencyContext"
import LoadingSpinner from "../components/LoadingSpinner"

export default function WishlistPage() {
    const { wishlist, toggleWishlist } = useWishlist()
    const { formatPrice, convertPrice } = useCurrency()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlist.length === 0) {
                setProducts([])
                setLoading(false)
                return
            }
            try {
                // Fetch all products and filter to the wishlisted ones
                const data = await productAPI.getAll()
                const all = Array.isArray(data) ? data : []
                setProducts(all.filter((p) => wishlist.includes(p._id)))
            } catch {
                setProducts([])
            } finally {
                setLoading(false)
            }
        }
        fetchWishlistProducts()
    }, [wishlist])

    if (loading) return <LoadingSpinner message="Loading your favourites..." />

    return (
        <div className="pt-24 lg:pt-32 pb-20 container animate-fade-in">
            <h1 className="text-3xl font-serif text-primary mb-2">My Favourites</h1>
            <p className="text-gray-500 text-sm mb-10 uppercase tracking-widest">
                {products.length} {products.length === 1 ? "item" : "items"} saved
            </p>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                    <Heart className="w-16 h-16 text-gray-200" />
                    <p className="text-xl font-serif text-gray-400">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400">Browse our collection and heart the items you love.</p>
                    <Link
                        to="/shop"
                        className="mt-2 px-8 py-3 bg-secondary text-white text-sm uppercase tracking-widest hover:bg-primary transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="group relative">
                            {/* Remove button */}
                            <button
                                onClick={() => toggleWishlist(product._id)}
                                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                aria-label="Remove from favourites"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <Link to={`/product/${product._id}`} className="block">
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm mb-3">
                                    <img
                                        src={product.images?.[0] || "/placeholder.jpg"}
                                        alt={product.name}
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.jpg" }}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-sm font-serif text-primary truncate">{product.name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatPrice(convertPrice(product.price, "MVR"))}
                                </p>
                            </Link>

                            <Link
                                to={`/product/${product._id}`}
                                className="mt-3 w-full flex items-center justify-center gap-2 border border-secondary text-secondary text-xs uppercase tracking-widest py-2 hover:bg-secondary hover:text-white transition-colors"
                            >
                                <ShoppingBag className="w-3 h-3" />
                                View Product
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
