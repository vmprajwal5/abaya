import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"
import { Loader2, Search, CheckCircle, Eye, X } from "lucide-react"
import toast from "react-hot-toast"

export function OrderListPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const response = await adminAPI.getAllOrders();
            // The Axios interceptor returns response.data, so `response` is already the payload
            // It may be { orders: [...] } or just [...] depending on backend shape
            const payload = response?.['orders'] ?? response;
            const orderList = Array.isArray(payload) ? payload : [];
            const sorted = orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setOrders(sorted)
        } catch (error) {
            console.error("Failed to load orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus)
            setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }))
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
            toast.success("Order status updated successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order status")
        }
    }

    const filteredOrders = orders.filter(o =>
        (o._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">User Name</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3 text-center">Method</th>
                                    <th className="px-4 py-3 text-center">Paid Status</th>
                                    <th className="px-4 py-3 text-center">Delivered Status</th>
                                    <th className="px-4 py-3 text-center w-24">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs">{order._id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{order.user?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">MVR {(order.total || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3 uppercase font-semibold text-xs text-gray-600 text-center">
                                            {order.paymentMethod || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {order.paymentStatus === 'completed' ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Paid</span>
                                            ) : (
                                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Not Paid</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {order.orderStatus === 'delivered' ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Delivered</span>
                                            ) : (
                                                <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">{order.orderStatus || 'Pending'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No orders found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Order Details
                                    {selectedOrder.orderNumber && (
                                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {selectedOrder.orderNumber}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1 font-mono">ID: {selectedOrder._id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                            {/* Top Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer & Shipping */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Customer & Shipping</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500 w-24 inline-block">Customer:</span> <span className="font-medium text-gray-900">{selectedOrder.user?.name || 'Unknown User'}</span></p>
                                        <p><span className="text-gray-500 w-24 inline-block">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                                        {selectedOrder.shippingAddress ? (
                                            <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="font-medium mb-1">Shipping Address:</p>
                                                <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                                                <p className="text-gray-600">
                                                    {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode && `, ${selectedOrder.shippingAddress.postalCode}`}
                                                </p>
                                                <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic mt-2">No shipping address provided</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Order Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Payment Status:</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {selectedOrder.paymentStatus?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Payment Method:</span>
                                            <span className="font-medium text-gray-900 capitalize">{selectedOrder.paymentMethod || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Order Status:</span>
                                            <select
                                                value={selectedOrder.orderStatus || 'pending'}
                                                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                                className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                                                    selectedOrder.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    selectedOrder.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    selectedOrder.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}
                                            >
                                                <option value="pending">PENDING</option>
                                                <option value="processing">PROCESSING</option>
                                                <option value="shipped">SHIPPED</option>
                                                <option value="delivered">DELIVERED</option>
                                                <option value="cancelled">CANCELLED</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Order Items</h3>
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => {
                                            const imageUrl = item.image || item.product?.images?.[0] || item.product?.image;
                                            
                                            return (
                                                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="w-16 h-16 bg-white rounded border overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-400 text-xs text-center">No Image</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                            <span>Qty: {item.quantity}</span>
                                                            {item.size && <span>Size: {item.size}</span>}
                                                            {item.color && <span>Color: {item.color}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="font-medium text-gray-900 ml-4">
                                                        MVR {(item.price * item.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No items found for this order.</p>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="border-t pt-4">
                                <div className="w-full md:w-1/2 ml-auto space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>MVR {(selectedOrder.subtotal || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping Cost</span>
                                        <span>MVR {(selectedOrder.shippingCost || 0).toLocaleString()}</span>
                                    </div>
                                    {selectedOrder.tax > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax</span>
                                            <span>MVR {selectedOrder.tax.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t mt-2 text-base">
                                        <span>Total</span>
                                        <span>MVR {(selectedOrder.total || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
