import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { productsAPI, updateProduct, uploadAPI } from "../../services/api";
import { Button } from "../../components/ui/button";

export function ProductEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");

    // Additional Abaya specific fields
    const [fabric, setFabric] = useState("");
    const [sku, setSku] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productsAPI.getById(id);
                const product = data;

                setName(product.name);
                setPrice(product.price || product.priceMVR || 0);
                setImage(product.image || "");
                setBrand(product.brand || "");
                setCategory(product.category || "");
                setCountInStock(product.countInStock || product.stock || 0);
                setDescription(product.description || "");
                setFabric(product.fabric || "");
                setSku(product.sku || "");

                setIsLoading(false);
            } catch {
                toast.error("Failed to load product");
                navigate("/admin/products");
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const data = await uploadAPI.upload(file); // Services/api uses different signature? Let's check.
            // In ProductListPage it was `uploadAPI.uploadImage`. Let's assume standard `uploadAPI.upload` is compatible or use provided logic in prev file.
            // Wait, previous file had `uploadAPI.uploadImage`. But my service file shows `uploadAPI.upload`.
            // Let's rely on `uploadAPI.upload` (it takes a file directly and does FormData internaly) based on `src/services/api.js` view.

            // Correction: `src/services/api.js` showed `uploadAPI.upload(file)` doing FormData logic.
            // AND `uploadImage(imageFile)` doing separate logic.
            // I will use `uploadAPI.upload(file)` which seems cleaner.

            // The response returns path.
            setImage(data.image); // Adjusted based on backend response typical format
            setIsUploading(false);
            toast.success("Image uploaded!");
        } catch (error) {
            console.error(error);
            setIsUploading(false);
            toast.error("Image upload failed");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProduct({
                _id: id,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
                fabric,
                sku
            });
            toast.success("Product Updated");
            navigate("/admin/products");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <Link to="/admin/products" className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Edit Product</h1>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <form onSubmit={submitHandler} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                    {/* Image Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Product Image</label>
                        <div className="flex items-start gap-6">
                            <div className="w-40 h-52 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                                {image ? (
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500">Image URL</label>
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-black focus:border-black"
                                        placeholder="/images/sample.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full justify-center">
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                        Upload Image
                                        <input type="file" className="hidden" onChange={uploadFileHandler} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">SKU (Stock Keeping Unit)</label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">MVR</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-2.5 focus:ring-black focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Count In Stock</label>
                            <input
                                type="number"
                                value={countInStock}
                                onChange={(e) => setCountInStock(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Fabric</label>
                            <input
                                type="text"
                                value={fabric}
                                onChange={(e) => setFabric(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black resize-y"
                        ></textarea>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-secondary text-white px-8 py-3 rounded-md hover:bg-primary transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </span>
                            ) : (
                                "Update Product"
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
