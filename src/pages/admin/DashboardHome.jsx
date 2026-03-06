import { useState, useEffect } from "react"
import { getOrderStats, getOrders, productsAPI } from "../../services/api"
import {
    ShoppingBag,
    DollarSign,
    Users,
    Package
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export function DashboardHome() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        totalUsers: 0,
        dailySales: []
    })
    const [totalProducts, setTotalProducts] = useState(0)
    const [recentOrders, setRecentOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ordersRes, productsRes] = await Promise.all([
                    getOrderStats(),
                    getOrders(),
                    productsAPI.getAll()
                ])

                setStats(statsRes.data || {
                    totalOrders: 0,
                    totalSales: 0,
                    totalUsers: 0,
                    dailySales: []
                })

                if (ordersRes.data) {
                    // Sort by date desc and take top 5
                    const sorted = ordersRes.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    setRecentOrders(sorted.slice(0, 5))
                }

                if (productsRes) {
                    setTotalProducts(productsRes.length)
                }

            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const statCards = [
        { title: "Total Sales", value: `MVR ${(stats.totalSales || 0).toLocaleString()}`, icon: DollarSign, color: "bg-blue-500" },
        { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-purple-500" },
        { title: "Total Customers", value: stats.totalUsers, icon: Users, color: "bg-green-500" },
        { title: "Total Products", value: totalProducts, icon: Package, color: "bg-orange-500" },
    ]

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.dailySales && stats.dailySales.length > 0 ? stats.dailySales : []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#2563EB' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 text-xs font-mono">{order._id.slice(-6)}...</td>
                                            <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4">MVR {order.totalPrice.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-6 py-4 text-center" colSpan={4}>No recent orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
