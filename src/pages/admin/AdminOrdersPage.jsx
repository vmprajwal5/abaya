import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"
import { Loader2, Search, CheckCircle } from "lucide-react"

export function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const response = await adminAPI.getAllOrders();
            const data = response?.data || response;
            const orderList = Array.isArray(data) ? data : (data?.orders || []);
            const sorted = orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setOrders(sorted)
        } catch (error) {
            console.error("Failed to load orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeliver = async (id) => {
        try {
            await adminAPI.updateOrderStatus(id, 'Delivered')
            setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o))
        } catch (error) {
            alert("Failed to mark as delivered: " + error.message)
        }
    }

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

            {/* Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
                <Search className="absolute left-7 top-6.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-96 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Paid</th>
                                    <th className="px-6 py-4">Delivered</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{order._id}</td>
                                        <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">MVR {order.totalPrice.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            {order.isPaid ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">Paid</span>
                                            ) : (
                                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">Not Paid</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isDelivered ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">Delivered</span>
                                            ) : (
                                                <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-bold">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!order.isDelivered && (
                                                <button
                                                    onClick={() => handleDeliver(order._id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
