import { useState, useEffect } from "react"
import { productAPI } from "../../services/api"
import { Tag, Loader2, Plus, Search } from "lucide-react"

export function CategoryListPage() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            try {
                // Since we don't have a categories endpoint, we derive unique categories from products
                const data = await productAPI.getAll()
                if (data) {
                    const uniqueCategories = [...new Set(data.map(product => product.category))].filter(Boolean)
                    setCategories(uniqueCategories)
                }
            } catch (error) {
                console.error("Failed to fetch products/categories", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const filteredCategories = categories.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                {/* Optional: Add Category Button (Visual only for now since no backend) */}
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors cursor-not-allowed opacity-70" title="Not implemented yet">
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
                <Search className="absolute left-7 top-6.5 h-5 w-5 text-gray-400" />
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
                    filteredCategories.map((category, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-gray-800 text-lg">{category}</span>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                Active
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        No categories found.
                    </div>
                )}
            </div>
        </div>
    )
}
