import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom"
import { useLayoutEffect, lazy, Suspense } from "react"
import { Layout } from "./components/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import CartSidebar from "./components/CartSidebar"
import { PageLoader } from "./components/ui/LoadingSpinner"
import { ProductProvider } from './contexts/ProductContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { ShopProvider } from './contexts/ShopContext';
import { StoreProvider } from './context/StoreContext';

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/HomePage"))
const CartPage = lazy(() => import("./pages/CartPage"))
const ProductDetails = lazy(() => import("./pages/ProductDetails").then(module => ({ default: module.ProductDetails })))
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(module => ({ default: module.CategoryPage })))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })))
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage").then(module => ({ default: module.OrderSuccessPage })))

// Auth Pages
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Signup = lazy(() => import("./pages/Signup"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const Profile = lazy(() => import("./pages/Profile"))

// Legal Pages
const TermsPage = lazy(() => import("./pages/TermsPage").then(module => ({ default: module.TermsPage })))
const ReturnPolicyPage = lazy(() => import("./pages/ReturnPolicyPage").then(module => ({ default: module.ReturnPolicyPage })))
const ShippingPolicyPage = lazy(() => import("./pages/ShippingPolicyPage").then(module => ({ default: module.ShippingPolicyPage })))
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage").then(module => ({ default: module.PrivacyPolicyPage })))
const AboutPage = lazy(() => import("./pages/AboutPage").then(module => ({ default: module.AboutPage })))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })))
const BestSellers = lazy(() => import("./pages/BestSellers"))
const WishlistPage = lazy(() => import("./pages/WishlistPage"))

// Support Pages
const ContactPage = lazy(() => import("./pages/ContactPage").then(module => ({ default: module.ContactPage })))
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage").then(module => ({ default: module.TrackOrderPage })))
const SizeGuidePage = lazy(() => import("./pages/SizeGuidePage").then(module => ({ default: module.SizeGuidePage })))
const FaqPage = lazy(() => import("./pages/FaqPage").then(module => ({ default: module.FaqPage })))
const PaymentMethodsPage = lazy(() => import("./pages/PaymentMethodsPage").then(module => ({ default: module.PaymentMethodsPage })))

// Admin Pages
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage").then(module => ({ default: module.AdminLoginPage })))
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(module => ({ default: module.AdminLayout })))

// New Admin Dashboard Pages
const DashboardHome = lazy(() => import("./pages/admin/DashboardHome").then(module => ({ default: module.DashboardHome })))
const ProductListPage = lazy(() => import("./pages/admin/ProductListPage").then(module => ({ default: module.ProductListPage })))
const OrderListPage = lazy(() => import("./pages/admin/OrderListPage").then(module => ({ default: module.OrderListPage })))
const UserListPage = lazy(() => import("./pages/admin/UserListPage").then(module => ({ default: module.UserListPage })))
const CategoryListPage = lazy(() => import("./pages/admin/CategoryListPage").then(module => ({ default: module.CategoryListPage })))
const NewsletterPage = lazy(() => import("./pages/admin/NewsletterPage").then(module => ({ default: module.NewsletterPage })))
const AdminMessagesPage = lazy(() => import("./pages/admin/AdminMessagesPage.jsx").then(module => ({ default: module.AdminMessagesPage })))
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage").then(module => ({ default: module.SettingsPage })))


const ProductEditPage = lazy(() => import("./pages/admin/ProductEditPage").then(module => ({ default: module.ProductEditPage })))

import { DebugPage } from "./pages/DebugPage"
import { Toaster } from "react-hot-toast";

function ScrollToTop() {
    const { pathname } = useLocation()
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

function App() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <ShopProvider>
                    <ProductProvider>
                        <CurrencyProvider>
                            <CartProvider>
                                <AuthProvider>
                                    <ScrollToTop />
                                    <Toaster position="top-center" reverseOrder={false} />
                                    <div className="flex flex-col min-h-screen">
                                        <Suspense fallback={<PageLoader />}>
                                            <Routes>
                                                {/* Public Routes wrapped in Layout */}
                                                <Route element={<Layout><Outlet /></Layout>}>
                                                    <Route path="/" element={<HomePage />} />
                                                    <Route path="/cart" element={<CartPage />} />
                                                    <Route path="/shop" element={<CategoryPage />} />
                                                    <Route path="/shop/:slug" element={<CategoryPage />} />
                                                    <Route path="/products" element={<CategoryPage />} />
                                                    <Route path="/products/:slug" element={<CategoryPage />} />
                                                    <Route path="/product/:id" element={<ProductDetails />} />
                                                    <Route path="/about" element={<AboutPage />} />
                                                    <Route path="/best-sellers" element={<BestSellers />} />
                                                    <Route path="/checkout" element={<CheckoutPage />} />
                                                    <Route path="/order-success" element={<OrderSuccessPage />} />

                                                    {/* Support Pages */}
                                                    <Route path="/contact" element={<ContactPage />} />
                                                    <Route path="/track-order" element={<TrackOrderPage />} />
                                                    <Route path="/size-guide" element={<SizeGuidePage />} />
                                                    <Route path="/faqs" element={<FaqPage />} />
                                                    <Route path="/faq" element={<Navigate to="/faqs" replace />} />
                                                    <Route path="/payment-methods" element={<PaymentMethodsPage />} />

                                                    {/* Legal Pages */}
                                                    <Route path="/terms" element={<TermsPage />} />
                                                    <Route path="/return-policy" element={<ReturnPolicyPage />} />
                                                    <Route path="/returns" element={<Navigate to="/return-policy" replace />} />
                                                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                                                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                                                    <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

                                                    {/* Auth Routes */}
                                                    <Route path="/login" element={<Login />} />
                                                    <Route path="/signup" element={<Signup />} />
                                                    <Route path="/register" element={<Register />} />
                                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                                    <Route path="/reset-password" element={<ResetPassword />} />
                                                    <Route
                                                        path="/profile"
                                                        element={
                                                            <ProtectedRoute>
                                                                <Profile />
                                                            </ProtectedRoute>
                                                        }
                                                    />
                                                    <Route
                                                        path="/wishlist"
                                                        element={
                                                            <ProtectedRoute>
                                                                <WishlistPage />
                                                            </ProtectedRoute>
                                                        }
                                                    />
                                                    <Route
                                                        path="/my-orders"
                                                        element={
                                                            <ProtectedRoute>
                                                                <Profile />
                                                            </ProtectedRoute>
                                                        }
                                                    />
                                                    {/* 404 - Show with layout */}
                                                    <Route path="*" element={<NotFoundPage />} />
                                                </Route>

                                                {/* Admin Routes - No Public Layout */}
                                                <Route path="/admin/login" element={<Navigate to="/login" replace />} />

                                                <Route path="/admin" element={<AdminLayout />}>
                                                    <Route path="dashboard" element={<DashboardHome />} />
                                                    <Route path="products" element={<ProductListPage />} />
                                                    <Route path="product/:id/edit" element={<ProductEditPage />} />
                                                    <Route path="orders" element={<OrderListPage />} />
                                                    <Route path="users" element={<UserListPage />} />
                                                    <Route path="categories" element={<CategoryListPage />} />
                                                    <Route path="newsletter" element={<NewsletterPage />} />
                                                    <Route path="messages" element={<AdminMessagesPage />} />

                                                    <Route path="settings" element={<SettingsPage />} />
                                                    <Route index element={<Navigate to="dashboard" replace />} />
                                                </Route>

                                                <Route path="/debug" element={<DebugPage />} />
                                            </Routes>
                                        </Suspense>
                                    </div>
                                    <CartSidebar />
                                </AuthProvider>
                            </CartProvider>
                        </CurrencyProvider>
                    </ProductProvider>
                </ShopProvider>
            </StoreProvider>
        </BrowserRouter>
    )
}

export default App
