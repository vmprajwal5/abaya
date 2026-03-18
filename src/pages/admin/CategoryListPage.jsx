import { useState, useEffect } from "react"
import { productAPI, adminAPI } from "../../services/api"
import { Tag, Loader2, Plus, Search, Pencil, Trash2, X, Check, ChevronRight, Package, ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react"
import toast from 'react-hot-toast'

export function CategoryListPage() {
    const [allProducts, setAllProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Selected category view
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [productSearch, setProductSearch] = useState("")

    // Add Category Modal
    const [showAddModal, setShowAddModal] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")

    // Edit inline
    const [editingIndex, setEditingIndex] = useState(null)
    const [editValue, setEditValue] = useState("")

    // Product stock editing
    const [editingStock, setEditingStock] = useState(null)
    const [stockValue, setStockValue] = useState("")
    const [savingStock, setSavingStock] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            try {
                const data = await productAPI.getAll()
                if (data) {
                    setAllProducts(data)
                    const productCategories = [...new Set(data.map(p => p.category))].filter(Boolean)
                    const local = JSON.parse(localStorage.getItem("admin_categories") || "[]")
                    const merged = [...new Set([...productCategories, ...local])]
                    setCategories(merged)
                }
            } catch (error) {
                console.error("Failed to fetch categories", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const saveLocal = (updated) => {
        localStorage.setItem("admin_categories", JSON.stringify(updated))
        setCategories(updated)
    }

    const handleAdd = () => {
        const name = newCategoryName.trim()
        if (!name) return
        if (categories.map(c => c.toLowerCase()).includes(name.toLowerCase())) {
            alert("Category already exists!"); return
        }
        saveLocal([...categories, name])
        setNewCategoryName("")
        setShowAddModal(false)
    }

    const handleDelete = (index) => {
        if (!window.confirm(`Delete category "${categories[index]}"?`)) return
        if (selectedCategory === categories[index]) setSelectedCategory(null)
        saveLocal(categories.filter((_, i) => i !== index))
    }

    const startEdit = (index) => { setEditingIndex(index); setEditValue(categories[index]) }
    const confirmEdit = () => {
        const name = editValue.trim()
        if (!name) return
        const updated = categories.map((c, i) => i === editingIndex ? name : c)
        if (selectedCategory === categories[editingIndex]) setSelectedCategory(name)
        saveLocal(updated)
        setEditingIndex(null)
    }
    const cancelEdit = () => setEditingIndex(null)

    const filteredCategories = categories.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const categoryProducts = selectedCategory
        ? allProducts.filter(p => p.category === selectedCategory &&
            (p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
             p.category?.toLowerCase().includes(productSearch.toLowerCase())))
        : []

    // ── Product Detail View ──────────────────────────────────────────────────
    if (selectedCategory) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setSelectedCategory(null); setProductSearch("") }}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Categories
                    </button>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-500" />
                        {selectedCategory}
                        <span className="text-sm font-normal text-gray-400 ml-1">({categoryProducts.length} products)</span>
                    </h1>
                </div>

                {/* Product Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
                    <Search className="absolute left-7 top-6 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search products in ${selectedCategory}...`}
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-10 w-full md:w-96 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Products Grid */}
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categoryProducts.map(product => {
                            const isAvailable = product.stock > 0
                            const isEditingThis = editingStock === product._id
                            const isSaving = savingStock === product._id

                            const toggleAvailability = async () => {
                                setSavingStock(product._id)
                                try {
                                    const newStock = isAvailable ? 0 : 10
                                    await adminAPI.updateProduct(product._id, { stock: newStock })
                                    setAllProducts(prev => prev.map(p => p._id === product._id ? { ...p, stock: newStock } : p))
                                    toast.success(isAvailable ? `${product.name} marked as Out of Stock` : `${product.name} marked as Available`)
                                } catch (err) {
                                    toast.error('Failed to update availability')
                                } finally {
                                    setSavingStock(null)
                                }
                            }

                            const saveStock = async () => {
                                const val = parseInt(stockValue)
                                if (isNaN(val) || val < 0) { toast.error('Enter a valid stock number'); return }
                                setSavingStock(product._id)
                                try {
                                    await adminAPI.updateProduct(product._id, { stock: val })
                                    setAllProducts(prev => prev.map(p => p._id === product._id ? { ...p, stock: val } : p))
                                    toast.success(`Stock updated to ${val}`)
                                    setEditingStock(null)
                                } catch (err) {
                                    toast.error('Failed to update stock')
                                } finally {
                                    setSavingStock(null)
                                }
                            }

                            return (
                                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-40 bg-gray-100 overflow-hidden relative">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package className="w-10 h-10" />
                                            </div>
                                        )}
                                        {!isAvailable && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">UNAVAILABLE</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-blue-600 font-bold text-sm">MVR {product.price?.toLocaleString()}</span>
                                            {isEditingThis ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        autoFocus
                                                        type="number"
                                                        min="0"
                                                        value={stockValue}
                                                        onChange={(e) => setStockValue(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') saveStock(); if (e.key === 'Escape') setEditingStock(null) }}
                                                        className="w-16 border rounded px-1 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    />
                                                    <button onClick={saveStock} disabled={isSaving} className="p-0.5 text-green-600 hover:bg-green-50 rounded">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingStock(null)} className="p-0.5 text-gray-400 hover:bg-gray-100 rounded">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setEditingStock(product._id); setStockValue(String(product.stock || 0)) }}
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                    title="Click to edit stock"
                                                >
                                                    {isAvailable ? `Stock: ${product.stock}` : 'Out of stock'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Availability Toggle */}
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Availability</span>
                                            <button
                                                onClick={toggleAvailability}
                                                disabled={isSaving}
                                                className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 transition-colors ${isAvailable ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : isAvailable ? (
                                                    <ToggleRight className="w-4 h-4" />
                                                ) : (
                                                    <ToggleLeft className="w-4 h-4" />
                                                )}
                                                {isAvailable ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No products found in "{selectedCategory}"</p>
                        <p className="text-gray-400 text-sm mt-1">Products assigned to this category will appear here.</p>
                    </div>
                )}
            </div>
        )
    }

    // ── Category List View ───────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
                <Search className="absolute left-7 top-6 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-96 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => {
                        const realIndex = categories.indexOf(category)
                        const isEditing = editingIndex === realIndex
                        const productCount = allProducts.filter(p => p.category === category).length
                        return (
                            <div
                                key={index}
                                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow ${!isEditing ? 'cursor-pointer hover:border-blue-200' : ''}`}
                                onClick={() => !isEditing && editingIndex === null && setSelectedCategory(category)}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="border border-blue-400 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        <div className="min-w-0">
                                            <span className="font-medium text-gray-800 text-lg truncate block">{category}</span>
                                            <span className="text-xs text-gray-400">{productCount} product{productCount !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    {isEditing ? (
                                        <>
                                            <button onClick={confirmEdit} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Save">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={cancelEdit} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Cancel">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(realIndex)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(realIndex)} className="p-1.5 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">No categories found.</div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Add New Category</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Category name (e.g. Summer Collection)"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={handleAdd}
                                disabled={!newCategoryName.trim()}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
