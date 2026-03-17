import { useState, useEffect } from "react"
import { Search, Plus, Filter, Edit, Trash2, X, Loader2 } from "lucide-react"
import { productAPI, uploadAPI } from "../../services/api"

export function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("All")
    const [formError, setFormError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Form State
    const [newProduct, setNewProduct] = useState({
        _id: null,
        name: "",
        sku: "",
        category: "Classic",
        brand: "Abaya Clothing",
        fabric: "Nidha",
        priceMVR: "",
        stock: "",
        sizes: [],
        colors: [],
        description: "",
        image: "" // Using a single image URL for simplicity or handle comma separated
    })

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
            } catch (error) {
                alert("Failed to delete product: " + error.message)
            }
        }
    }


    const handleSaveProduct = async () => {
        setFormError(null)
        setIsSaving(true)

        // Validation
        if (!newProduct.name?.trim()) {
            setFormError("Product Name is required")
            setIsSaving(false)
            return
        }
        if (!newProduct.priceMVR || parseFloat(newProduct.priceMVR) <= 0) {
            setFormError("Price must be greater than 0")
            setIsSaving(false)
            return
        }
        if (newProduct.stock === "" || parseInt(newProduct.stock) < 0) {
            setFormError("Stock cannot be negative")
            setIsSaving(false)
            return
        }
        if (!newProduct.category) {
            setFormError("Category is required")
            setIsSaving(false)
            return
        }
        if (!newProduct.image) {
            setFormError("Product image is required")
            setIsSaving(false)
            return
        }

        try {
            const payload = {
                name: newProduct.name,
                brand: newProduct.brand,
                fabric: newProduct.fabric,
                category: newProduct.category,
                price: parseFloat(newProduct.priceMVR),
                priceMVR: parseFloat(newProduct.priceMVR),
                stock: parseInt(newProduct.stock),
                sku: newProduct.sku,
                description: newProduct.description,
                images: newProduct.image ? [newProduct.image] : [],
                colors: newProduct.colors.map(c => typeof c === 'string' ? { name: c, hex: '#000000' } : c),
                sizes: newProduct.sizes
            }

            if (newProduct._id) { // If editing
                await productAPI.update(newProduct._id, payload)
            } else {
                await productAPI.create(payload)
            }

            setIsModalOpen(false)
            fetchProducts()
            // Reset form
            setNewProduct({
                _id: null,
                name: "",
                sku: "",
                category: "Classic",
                brand: "Abaya Clothing",
                fabric: "Nidha",
                priceMVR: "",
                stock: "",
                sizes: [],
                colors: [],
                description: "",
                image: ""
            })
        } catch (error) {
            setFormError(error.message || "Failed to save product")
        } finally {
            setIsSaving(false)
        }
    }

    const toggleSize = (size) => {
        setNewProduct(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }))
    }

    const handleImageUpload = async (file) => {
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setFormError("File too large. Max 5MB.")
            return
        }

        setIsUploading(true)
        setFormError(null)

        try {
            const formData = new FormData()
            formData.append('image', file)

            const data = await uploadAPI.uploadImage(formData)

            // Backend returns relative path "/uploads/...", verify if we need to prepend base URL
            // Since we serve static files from backend, we might need full URL if frontend is on different port
            // But usually proxy handles it or we use relative if same origin.
            // For dev with separate ports (5173 vs 5000), we need full URL or proxy.
            // Let's assume proxy or prepend API url base (excluding /api)

            const imageUrl = `${import.meta.env.VITE_API_URL.replace('/api', '')}${data.image}`

            setNewProduct(prev => ({ ...prev, image: imageUrl }))
        } catch (error) {
            console.error(error)
            setFormError("Image upload failed: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
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
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Brand</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price (MVR)</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                        {product._id.substring(product._id.length - 6)}...
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                                            {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                                        </div>
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">{product.brand || 'N/A'}</td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{product.price?.toLocaleString() || product.priceMVR?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {product.stock > 0 ? "Active" : "Out of Stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
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

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {formError && <div className="bg-red-50 text-red-600 p-3 rounded">{formError}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Product Name *</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="e.g. Royal Silk Abaya"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">SKU (Optional)</label>
                                    <input
                                        type="text"
                                        value={newProduct.sku}
                                        onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="AB-00X"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Brand</label>
                                    <input
                                        type="text"
                                        value={newProduct.brand || ""}
                                        onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="Brand Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Fabric</label>
                                    <input
                                        type="text"
                                        value={newProduct.fabric || ""}
                                        onChange={e => setNewProduct({ ...newProduct, fabric: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="e.g. Nidha"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none bg-white"
                                    >
                                        <option>Classic</option>
                                        <option>Luxury</option>
                                        <option>Occasion</option>
                                        <option>Casual</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Price (MVR) *</label>
                                    <input
                                        type="number"
                                        value={newProduct.priceMVR}
                                        onChange={e => setNewProduct({ ...newProduct, priceMVR: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Stock Qty *</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Sizes</label>
                                <div className="flex gap-4">
                                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newProduct.sizes.includes(size)}
                                                onChange={() => toggleSize(size)}
                                                className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                            />
                                            <span className="text-sm text-gray-600">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows={3}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-secondary outline-none"
                                    placeholder="Product description..."
                                ></textarea>
                            </div>

                            <div
                                className={`space-y-4 bg-gray-50 p-6 rounded-lg border-2 border-dashed transition-colors text-center ${isDragging ? "border-secondary bg-secondary/10" : "border-gray-300 hover:bg-gray-100"
                                    }`}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragging(true)
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={async (e) => {
                                    e.preventDefault()
                                    setIsDragging(false)
                                    const file = e.dataTransfer.files[0]
                                    if (file) await handleImageUpload(file)
                                }}
                            >
                                <div className="space-y-2 cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                                    <div className="mx-auto w-12 h-12 text-gray-400">
                                        {isUploading ? <Loader2 className="w-full h-full animate-spin text-secondary" /> : "📷"}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {isUploading ? "Uploading..." : "Click or drag image to upload"}
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) await handleImageUpload(file)
                                    }}
                                />

                                {newProduct.image && (
                                    <div className="relative w-32 h-32 mx-auto mt-4 group">
                                        <img
                                            src={newProduct.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setNewProduct(prev => ({ ...prev, image: "" }))
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Manual URL Fallback (Toggle/Optional) */}
                                <div className="pt-4 border-t border-gray-200 mt-4">
                                    <input
                                        type="text"
                                        value={newProduct.image}
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="w-full text-xs border-b border-gray-300 bg-transparent py-1 text-center focus:border-secondary outline-none text-gray-500"
                                        placeholder="Or paste image URL here"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                disabled={isSaving}
                                className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-primary disabled:opacity-70"
                            >
                                {isSaving ? "Saving..." : "Save Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
