import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"
import {
    ShoppingBag,
    DollarSign,
    Users,
    TrendingUp
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts"

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        totalUsers: 0,
        dailySales: []
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Determine if we are in dev or prod, or just handle potential errors gracefully
                const response = await adminAPI.getDashboardStats()
                setStats(response?.data || response || {
                    totalOrders: 0,
                    totalSales: 0,
                    totalUsers: 0,
                    dailySales: []
                })
            } catch (error) {
                console.error("Failed to load stats", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-gray-900", iconColor: "text-white" },
        // Ensure totalSales is a number before calling toLocaleString
        { title: "Total Revenue", value: `MVR ${(stats.totalSales || 0).toLocaleString()}`, icon: DollarSign, color: "bg-gray-900", iconColor: "text-white" },
        { title: "Total Customers", value: stats.totalUsers, icon: Users, color: "bg-gray-900", iconColor: "text-white" },
    ]

    // Placeholder data for Top Products content since backend doesn't provide it yet
    const topProductsData = [
        { name: 'Classic Black', sales: 40 },
        { name: 'Golden Hour', sales: 30 },
        { name: 'Midnight Blue', sales: 20 },
        { name: 'Emerald Silk', sales: 27 },
        { name: 'Royal Velvet', sales: 18 },
    ]

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-2 text-white">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-800">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
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

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProductsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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
                            {/* Placeholder data as stats endpoint doesn't return orders list yet */}
                            <tr>
                                <td className="px-6 py-4 text-center" colSpan={4}>
                                    See <a href="/admin/orders" className="text-blue-600 hover:underline">Orders Page</a> for full details.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
