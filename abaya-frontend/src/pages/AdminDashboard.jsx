import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Management */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </Link>

        {/* Orders Management */}
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          <p className="text-gray-600">View and manage orders</p>
        </Link>

        {/* Users Management */}
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-gray-600">Manage user accounts</p>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold">--</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">--</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">--</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Revenue</h3>
          <p className="text-3xl font-bold">MVR --</p>
        </div>
      </div>
    </div>
  );
}
