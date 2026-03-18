import { useState, useEffect } from "react"
import { Search, Plus, Filter, Edit, Trash2, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { productAPI, adminAPI } from "../../services/api"
import { toast } from "react-hot-toast"

export function ProductListPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("All")
    const [isCreating, setIsCreating] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const data = await productAPI.getAll()
            setProducts(data || [])
        } catch (error) {
            console.error("Failed to load products", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filter logic
    const filteredProducts = products.filter(p =>
        (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCategory === "All" || p.category === filterCategory)
    )

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productAPI.delete(id)
                setProducts(products.filter(p => p._id !== id))
                toast.success("Product deleted")
            } catch (error) {
                toast.error("Failed to delete product: " + error.message)
            }
        }
    }

    // Task 3: Wiring the "Create" Button
    const createProductHandler = async () => {
        setIsCreating(true)
        try {
            // Logic: Create a new product with "Sample Name"
            const { data } = await adminAPI.createProduct({}) // Payload optional if backend handles it

            // Then: Automatically navigate to edit page
            toast.success("Sample product created")
            navigate(`/admin/product/${data.id}/edit`)
        } catch (error) {
            toast.error(error.message || "Failed to create product")
            setIsCreating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={createProductHandler}
                    disabled={isCreating}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create New Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="pl-10 w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none bg-white"
                    >
                        <option value="All">All Categories</option>
                        <option value="Classic">Classic</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Occasion">Occasion</option>
                        <option value="Casual">Casual</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Brand</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                            {(product.images?.[0] || product.image) && (
                                                <img
                                                    src={product.images?.[0] || product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">MVR {product.price?.toLocaleString() || product.priceMVR?.toLocaleString()}</td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{product.brand || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="p-1 hover:bg-gray-100 rounded text-blue-500 hover:text-blue-700"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-1 hover:bg-gray-100 rounded text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    )
}
