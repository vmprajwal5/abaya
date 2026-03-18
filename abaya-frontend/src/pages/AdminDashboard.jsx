import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Fetch real data from API
      // For now, using mock data
      setStats({
        totalProducts: 45,
        totalOrders: 123,
        totalUsers: 567,
        totalRevenue: 89450
      });
      
      setRecentOrders([
        { id: 1, customer: 'John Doe', amount: 'MVR 1,200', status: 'Pending' },
        { id: 2, customer: 'Jane Smith', amount: 'MVR 850', status: 'Completed' },
        { id: 3, customer: 'Bob Wilson', amount: 'MVR 2,100', status: 'Processing' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Products</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl opacity-50">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl opacity-50">🛍️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl opacity-50">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">MVR {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-4xl opacity-50">💰</div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="text-5xl mb-4 text-center">📦</div>
          <h2 className="text-xl font-bold mb-2 text-center">Manage Products</h2>
          <p className="text-gray-600 text-center">Add, edit, or remove products from catalog</p>
          <div className="mt-4 text-center">
            <span className="text-blue-600 font-semibold">View Products →</span>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
        >
          <div className="text-5xl mb-4 text-center">🛍️</div>
          <h2 className="text-xl font-bold mb-2 text-center">Manage Orders</h2>
          <p className="text-gray-600 text-center">Track and update order statuses</p>
          <div className="mt-4 text-center">
            <span className="text-green-600 font-semibold">View Orders →</span>
          </div>
        </Link>

        <Link
          to="/admin/customers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500"
        >
          <div className="text-5xl mb-4 text-center">👥</div>
          <h2 className="text-xl font-bold mb-2 text-center">Customer Logs</h2>
          <p className="text-gray-600 text-center">View customer accounts and activity</p>
          <div className="mt-4 text-center">
            <span className="text-purple-600 font-semibold">View Customers →</span>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 font-semibold">
            View All Orders →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          + Add New Product
        </button>
        <button className="bg-white text-black border-2 border-black py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
          📊 Generate Report
        </button>
      </div>
    </div>
  );
}
