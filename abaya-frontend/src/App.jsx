import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages (create placeholder pages for missing ones)
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components for missing pages
const ProductDetail = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Product Detail Page</h1></div>;
const Cart = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Cart Page</h1></div>;
const Checkout = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Checkout Page</h1></div>;
const MyOrders = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">My Orders Page</h1></div>;
const AdminProducts = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Admin Products Management</h1></div>;
const AdminOrders = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Admin Orders Management</h1></div>;
const AdminCustomers = () => <div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Customer Logs</h1></div>;

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Only Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
