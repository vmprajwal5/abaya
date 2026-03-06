import { useState, useEffect } from "react"
import { getUsers, deleteUser } from "../../services/api"
import { Search, Trash2 } from "lucide-react"

export function UserListPage() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const { data } = await getUsers()
            setCustomers(data)
        } catch (err) {
            setError("Failed to load customers")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id)
                setCustomers(customers.filter(c => c._id !== id))
            } catch (err) {
                alert("Failed to delete user: " + err.message)
            }
        }
    }

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-8 text-center">Loading customers...</div>
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Admin Status</th>
                                <th className="px-6 py-4 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono">{customer._id.slice(-6)}...</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                        <td className="px-6 py-4">{customer.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {customer.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(customer._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
