import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            ABAYA CLOTHING
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-black">
              All Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-black">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-black">
              Contact
            </Link>
            
            {/* Admin Link - Only for admins */}
            {isAdmin() && (
              <Link to="/admin/dashboard" className="text-red-600 hover:text-red-700 font-semibold">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <span className="text-sm">MVR</span>
            
            <button className="text-gray-700 hover:text-black">
              🔍
            </button>

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/my-orders" className="text-gray-700 hover:text-black">
                  👤 {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-black"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-black">
                👤 Login
              </Link>
            )}

            <Link to="/cart" className="text-gray-700 hover:text-black">
              🛒
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
