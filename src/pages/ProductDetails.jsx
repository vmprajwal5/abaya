import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Star, Heart, Share2, Facebook, Copy, Truck, ShieldCheck, Undo2, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "../components/ui/button"
import { useCart } from "../contexts/CartContext"
import { useCurrency } from "../contexts/CurrencyContext"
import { cn } from "../lib/utils"
import { openWhatsApp } from "../lib/whatsapp"
import * as Accordion from "@radix-ui/react-accordion"
import { productsAPI } from "../services/api"
import { PageLoader } from "../components/ui/LoadingSpinner"

const DesktopTabs = ({ activeTab, setActiveTab, product }) => (
    <div className="mt-12 border-t border-gray-100 pt-8 hidden lg:block">
        <div className="flex gap-8 border-b border-gray-100 mb-8">
            {["Description", "Size & Fit", "Shipping", "Reviews"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={cn(
                        "pb-4 text-sm uppercase tracking-widest transition-colors relative",
                        activeTab === tab.toLowerCase() ? "text-primary" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary" />
                    )}
                </button>
            ))}
        </div>
        <div className="text-gray-600 leading-relaxed font-light">
            {activeTab === "description" && (
                <div className="space-y-4">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Premium Fabric</li>
                        <li>Breathable and lightweight</li>
                        <li>Quality craftsmanship</li>
                    </ul>
                </div>
            )}
            {activeTab === "size & fit" && <p>Standard sizing. Please check our size guide for detailed measurements.</p>}
            {activeTab === "shipping" && <p>Free shipping on orders over MVR 1,000. Delivery within 3-5 business days.</p>}
            {activeTab === "reviews" && <p>No reviews yet.</p>}
        </div>
    </div>
)

const MobileAccordions = ({ product }) => (
    <Accordion.Root type="multiple" className="lg:hidden mt-8 border-t border-gray-100">
        {["Description", "Size & Fit", "Shipping", "Reviews"].map((item) => (
            <Accordion.Item key={item} value={item.toLowerCase()} className="border-b border-gray-100">
                <Accordion.Trigger className="flex items-center justify-between w-full py-4 font-serif text-lg group">
                    {item}
                    <ChevronDown className="w-5 h-5 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="pb-4 text-gray-600 font-light leading-relaxed">
                    {item === "Description" && (
                        <div className="space-y-4">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Premium Fabric</li>
                                <li>Breathable and lightweight</li>
                            </ul>
                        </div>
                    )}
                    {item === "Size & Fit" && <p>Standard sizing.</p>}
                    {item === "Shipping" && <p>Free shipping on orders over MVR 1,000.</p>}
                    {item === "Reviews" && <p>No reviews yet.</p>}
                </Accordion.Content>
            </Accordion.Item>
        ))}
    </Accordion.Root>
)

export function ProductDetails() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const { formatPrice, convertPrice } = useCurrency()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState("description")

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const data = await productsAPI.getById(id)
                setProduct(data)
                // Set defaults
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0])
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0])
            } catch (err) {
                console.error(err)
                setError("Failed to load product details")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchProduct()
    }, [id])

    if (loading) return <PageLoader />
    if (error || !product) return <div className="min-h-screen pt-32 text-center text-red-500">{error || "Product not found"}</div>

    const handleAddToCart = () => {
        addToCart({
            _id: product._id,
            title: product.name,
            priceMVR: product.price,
            image: product.images?.[0],
            color: selectedColor?.name,
            size: selectedSize,
        }, quantity)
    }

    // Determine price to show (using MVR as base from DB)
    const finalPrice = convertPrice(product.price, 'MVR');

    return (
        <div className="pt-24 lg:pt-32 pb-32 lg:pb-20 container animate-fade-in relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span>
                <span>/</span>
                <span>Shop</span>
                <span>/</span>
                <span className="text-secondary font-bold">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Gallery */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Desktop Gallery */}
                    <div className="hidden lg:block relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm group cursor-zoom-in">
                        <img
                            src={product.images?.[activeImage] || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 origin-center"
                        />
                    </div>
                    <div className="hidden lg:flex gap-4 overflow-x-auto pb-2">
                        {product.images?.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={cn(
                                    "w-20 h-24 flex-shrink-0 border-2 transition-all",
                                    activeImage === idx ? "border-secondary" : "border-transparent hover:border-gray-200"
                                )}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Mobile Gallery (Horizontal Scroll) */}
                    <div className="lg:hidden -mx-4 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide">
                        {product.images?.map((img, idx) => (
                            <div key={idx} className="snap-center flex-shrink-0 w-[85vw] mx-2 first:ml-4 last:mr-4 aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
                                <img src={img} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <DesktopTabs activeTab={activeTab} setActiveTab={setActiveTab} product={product} />
                </div>

                {/* Right Column: Info */}
                <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="space-y-4 border-b border-gray-100 pb-8">
                        <h1 className="text-3xl lg:text-4xl font-serif text-primary">{product.name}</h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex text-secondary text-xs">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating || 0) ? 'fill-secondary' : 'text-gray-300'}`} />)}
                                </div>
                                <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
                            </div>
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> In Stock
                            </span>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-serif text-primary">
                                    {formatPrice(finalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Color */}
                        {product.colors && product.colors.length > 0 && selectedColor && (
                            <div className="space-y-3">
                                <span className="text-sm font-bold uppercase tracking-wide">Color: {selectedColor.name}</span>
                                <div className="flex gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-10 h-10 rounded-full border-2 p-[2px]",
                                                selectedColor.name === color.name ? "border-secondary" : "border-transparent"
                                            )}
                                        >
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-wide">Size: {selectedSize}</span>
                                    <button className="text-xs text-gray-500 underline hover:text-secondary">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center border text-sm transition-all",
                                                selectedSize === size
                                                    ? "border-secondary bg-secondary text-white"
                                                    : "border-gray-200 hover:border-black text-gray-900"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add (Desktop Hidden) */}
                        <div className="hidden lg:flex gap-4 pt-4">
                            <div className="flex items-center border border-gray-200 w-32 justify-between px-4">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black">-</button>
                                <span className="font-medium">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="text-gray-500 hover:text-black">+</button>
                            </div>
                            <Button
                                className="flex-1 bg-secondary text-white hover:bg-primary h-12 text-sm uppercase tracking-widest"
                                onClick={handleAddToCart}
                            >
                                Add to Bag
                            </Button>
                            <div className="w-12 h-12 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                                <Heart className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Sticky Mobile Bar */}
                        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 z-40 flex gap-4 items-center shadow-2xl">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Total</span>
                                <span className="font-serif font-bold text-lg">{formatPrice(convertPrice(product.price * quantity, 'MVR'))}</span>
                            </div>
                            <Button
                                className="flex-1 bg-secondary text-white hover:bg-primary h-12 text-sm uppercase tracking-widest"
                                onClick={handleAddToCart}
                            >
                                Add to Bag
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 py-6 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-secondary" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Undo2 className="w-4 h-4 text-secondary" />
                                <span>30-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                <span>Secure Checkout</span>
                            </div>
                        </div>

                        {/* Share & Help */}
                        <div className="border-t border-gray-100 pt-6 flex justify-between items-center text-sm text-gray-500">
                            <div className="flex gap-4">
                                <span>Share:</span>
                                <div className="flex gap-3 text-gray-400">
                                    <Facebook className="w-4 h-4 hover:text-blue-600 cursor-pointer transition-colors" />
                                    <Share2 className="w-4 h-4 hover:text-green-600 cursor-pointer transition-colors" />
                                    <Copy className="w-4 h-4 hover:text-black cursor-pointer transition-colors" />
                                </div>
                            </div>
                            <button
                                onClick={() => openWhatsApp(`Hi! I'm interested in ${product.name}. Could you help me with sizing?`)}
                                className="text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <span className="hidden sm:inline">Ask via </span>WhatsApp <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Accordions (Placed after content on mobile) */}
                <div className="col-span-1 lg:hidden">
                    <MobileAccordions product={product} />
                </div>
            </div>
        </div>
    )
}
