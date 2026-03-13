import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SearchOverlay } from './SearchOverlay';
import CurrencySwitcher from './CurrencySwitcher';
import CartIcon from './CartIcon';
import useStoreSettings from '../hooks/useStoreSettings';

function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const { settings } = useStoreSettings();

    const handleProfileClick = () => {
        if (currentUser) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };
    return (
        <>
            {settings?.announcementBar?.show && (
                <div className="bg-black text-white text-center py-2.5 text-xs font-medium tracking-widest uppercase">
                    {settings.announcementBar.text}
                </div>
            )}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 min-w-0">
                            <a href="/" className="text-lg md:text-2xl font-light tracking-[0.06em] md:tracking-[0.1em] uppercase text-black">
                                Abaya Clothing
                            </a>
                        </div>

                        {/* Navigation */}
                        <div className="hidden md:flex items-center gap-10">
                            <a href="/" className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors">Home</a>
                            <a href="/shop" className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors">All Products</a>
                            <a href="/best-sellers" className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors">Best Sellers</a>
                            <a href="/about" className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors">About</a>
                            <a href="/contact" className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors">Contact</a>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                            {/* Currency Switcher */}
                            <CurrencySwitcher />

                            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

                            {/* Search Icon */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:opacity-60 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* User Icon */}
                            <button
                                onClick={handleProfileClick}
                                className="p-2 hover:opacity-60 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>

                            {/* Cart Icon */}
                            <CartIcon />
                        </div>
                    </div>
                </div>
                <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </nav>
        </>
    );
}

export default Navbar;
