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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            ABAYA CLOTHING
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-black transition-colors">
              All Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-black transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-black transition-colors">
              Contact
            </Link>
            
            {/* Admin Link - Only visible to admins */}
            {user && isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold"
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">MVR</span>
            
            <button className="text-gray-700 hover:text-black">
              🔍
            </button>

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    👤 {user.name}
                  </span>
                  {isAdmin() && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-black bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-black bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                👤 Login
              </Link>
            )}

            <Link to="/cart" className="text-gray-700 hover:text-black text-xl">
              🛒
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
