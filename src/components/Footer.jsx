import { Facebook, Instagram, Linkedin, ArrowUp, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useShop } from "../contexts/ShopContext"
import useStoreSettings from "../hooks/useStoreSettings"

export function Footer() {
    const { currency, toggleCurrency } = useShop()
    const { settings } = useStoreSettings()

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <footer className="bg-white text-black pt-24 pb-12 border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-gray-100">

                {/* COLUMN 1: BRAND */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-light uppercase tracking-[0.1em] mb-2">{settings?.siteName || 'ABAYA CLOTHING'}</h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.25em]">Minimalist Modesty</p>
                    </div>
                    <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
                        {settings?.storeDescription || 'Essentials for the modern wardrobe. Designed with precision, crafted for elegance.'}
                    </p>
                    <div className="flex gap-6 pt-2">
                        {settings?.socialLinks?.instagram && (
                            <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors duration-300">
                                <Instagram className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                        )}
                        {settings?.socialLinks?.facebook && (
                            <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors duration-300">
                                <Facebook className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                        )}
                        {settings?.socialLinks?.whatsapp && (
                            <a href={settings.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors duration-300">
                                <Phone className="w-5 h-5" strokeWidth={1.5} />
                            </a>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: SHOP */}
                <div className="space-y-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black">Shop</h3>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link to="/new-arrivals" className="hover:text-black hover:underline underline-offset-4 transition-all">New Arrivals</Link></li>
                        <li><Link to="/shop" className="hover:text-black hover:underline underline-offset-4 transition-all">All Products</Link></li>
                        <li><Link to="/best-sellers" className="hover:text-black hover:underline underline-offset-4 transition-all">Best Sellers</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3: SUPPORT */}
                <div className="space-y-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black">Support</h3>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link to="/shipping-policy" className="hover:text-black hover:underline underline-offset-4 transition-all">Shipping & Returns</Link></li>
                        <li><Link to="/size-guide" className="hover:text-black hover:underline underline-offset-4 transition-all">Size Guide</Link></li>
                        <li><Link to="/faqs" className="hover:text-black hover:underline underline-offset-4 transition-all">FAQ</Link></li>
                        <li><Link to="/contact" className="hover:text-black hover:underline underline-offset-4 transition-all">Contact Us</Link></li>
                    </ul>
                    <div className="space-y-2 text-sm text-gray-500 pt-4 border-t border-gray-50">
                        {settings?.supportPhone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{settings.supportPhone}</span>
                            </div>
                        )}
                        {settings?.supportEmail && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{settings.supportEmail}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 4: NEWSLETTER */}
                <div className="space-y-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black">Newsletter</h3>
                    <p className="text-gray-500 text-sm font-light">Subscribe to receive updates, access to exclusive deals, and more.</p>

                    <div className="relative">
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="w-full bg-transparent border-b border-gray-300 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
                        />
                        <button className="absolute right-0 bottom-3 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">&copy; {new Date().getFullYear()} {settings?.siteName || 'Abaya Clothing'}. All rights reserved.</p>

                <div className="flex items-center gap-6">
                    {/* Currency Selector Text Only */}
                    <button
                        onClick={toggleCurrency}
                        className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
                    >
                        {currency}
                    </button>

                    {/* Back to Top - Minimal */}
                    <button
                        onClick={scrollToTop}
                        className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                        Top <ArrowUp className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </footer>
    )
}
