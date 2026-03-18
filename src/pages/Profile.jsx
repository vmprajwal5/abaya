import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Package, MapPin, Edit2, Loader2, Clock, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI, orderAPI } from "../services/api";
import { profileSchema } from "../utils/validation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [activeTab, setActiveTab] = useState(location.pathname === "/my-orders" ? "orders" : "profile");
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [addresses, setAddresses] = useState(currentUser?.addresses || []);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', postalCode: '', country: '' });
    const [savingAddress, setSavingAddress] = useState(false);

    useEffect(() => {
        if (activeTab === "orders" && currentUser) {
            fetchMyOrders();
        }
    }, [activeTab, currentUser]);

    const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await orderAPI.getMyOrders();
            const payload = data?.['orders'] ?? data;
            const orderList = Array.isArray(payload) ? payload : [];
            setOrders(orderList);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: currentUser?.displayName || currentUser?.name || "",
            email: currentUser?.email || "",
            phoneNumber: currentUser?.phoneNumber || "",
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authAPI.updateProfile({
                name: data.displayName,
                displayName: data.displayName
            });
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        logout();
        navigate("/");
    };

    if (loading) return <LoadingSpinner message="Loading profile..." />;
    if (!currentUser) return null;

    return (
        <div className="container min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-2xl font-serif">
                                {currentUser.displayName?.charAt(0) || currentUser.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h2 className="font-serif text-xl">{currentUser.displayName || currentUser.name}</h2>
                                <p className="text-xs text-gray-500">Member since {new Date(currentUser.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Button 
                                variant="ghost" 
                                onClick={() => setActiveTab("profile")}
                                className={cn(
                                    "w-full justify-start gap-3 transition-colors",
                                    activeTab === "profile" ? "text-black font-medium bg-gray-50" : "text-gray-500 hover:text-black"
                                )}
                            >
                                <User size={18} /> My Profile
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => setActiveTab("orders")}
                                className={cn(
                                    "w-full justify-start gap-3 transition-colors",
                                    activeTab === "orders" ? "text-black font-medium bg-gray-50" : "text-gray-500 hover:text-black"
                                )}
                            >
                                <Package size={18} /> Orders
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("addresses")}
                                className={cn(
                                    "w-full justify-start gap-3 transition-colors",
                                    activeTab === "addresses" ? "text-black font-medium bg-gray-50" : "text-gray-500 hover:text-black"
                                )}
                            >
                                <MapPin size={18} /> Addresses
                            </Button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-8"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        {activeTab === "profile" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                    <h1 className="font-serif text-3xl text-primary">My Profile</h1>
                                    {!isEditing && (
                                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                                            <Edit2 size={14} /> Edit Profile
                                        </Button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                        <input
                                            {...register("displayName")}
                                            disabled={!isEditing}
                                            type="text"
                                            className={cn(
                                                "w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors bg-white disabled:bg-transparent disabled:border-transparent disabled:pl-0",
                                                errors.displayName && "border-red-500"
                                            )}
                                        />
                                        {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                        <input
                                            {...register("email")}
                                            disabled
                                            type="email"
                                            className="w-full border-b border-transparent py-2 bg-transparent pl-0 text-gray-600 cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-400">Email cannot be changed directly.</p>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-4 flex gap-4">
                                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isLoading} className="bg-secondary text-white hover:bg-primary">
                                                {isLoading ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                                <div className="mb-8 pb-4 border-b border-gray-100">
                                    <h1 className="font-serif text-3xl text-primary">My Orders</h1>
                                </div>

                                {loadingOrders ? (
                                    <div className="py-12 flex justify-center text-gray-400">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500 border border-dashed rounded-lg border-gray-200 bg-gray-50">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg mb-2">You haven't placed any orders yet.</p>
                                        <Button variant="outline" onClick={() => navigate("/shop")} className="mt-4">
                                            Start Shopping
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                {/* Header */}
                                                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                                        <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                                        <p className="font-medium text-gray-900">MVR {(order.total || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                                                        <p className="font-medium text-gray-900 font-mono text-sm">{order.orderNumber || order._id.substring(0, 10).toUpperCase()}</p>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="p-6">
                                                    {/* Status Badge */}
                                                    <div className="mb-6 flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5",
                                                            order.orderStatus === 'delivered' ? "bg-green-100 text-green-700" :
                                                            order.orderStatus === 'cancelled' ? "bg-red-100 text-red-700" :
                                                            order.orderStatus === 'shipped' ? "bg-blue-100 text-blue-700" :
                                                            "bg-yellow-100 text-yellow-700"
                                                        )}>
                                                            {order.orderStatus === 'delivered' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                            {order.orderStatus?.toUpperCase() || 'PENDING'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid via ' + (order.paymentMethod || 'Card')}
                                                        </span>
                                                    </div>

                                                    {/* Items */}
                                                    <div className="space-y-4">
                                                        {order.items && order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                                                <div className="w-16 h-16 bg-gray-100 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                                                                    {(item.image || item.product?.images?.[0] || item.product?.image) ? (
                                                                        <img 
                                                                            src={item.image || item.product?.images?.[0] || item.product?.image} 
                                                                            alt={item.name} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <Package className="w-6 h-6 text-gray-300" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                                                        <span>Qty: {item.quantity}</span>
                                                                        {item.size && <span>Size: {item.size}</span>}
                                                                        {item.color && <span>Color: {item.color}</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="font-medium text-gray-900">
                                                                    MVR {(item.price * item.quantity).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                    <h1 className="font-serif text-3xl text-primary">My Addresses</h1>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAddressForm(v => !v)}
                                        className="gap-2"
                                    >
                                        <Plus size={14} /> Add Address
                                    </Button>
                                </div>

                                {showAddressForm && (
                                    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                                        <h3 className="font-medium text-gray-900">New Address</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Label (e.g. Home)</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.label}
                                                    onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))}
                                                    placeholder="Home / Work / Other"
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.address}
                                                    onChange={e => setNewAddress(a => ({ ...a, address: e.target.value }))}
                                                    placeholder="123 Main St"
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))}
                                                    placeholder="Male'"
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.postalCode}
                                                    onChange={e => setNewAddress(a => ({ ...a, postalCode: e.target.value }))}
                                                    placeholder="20026"
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                                                />
                                            </div>
                                            <div className="space-y-1 sm:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Country</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.country}
                                                    onChange={e => setNewAddress(a => ({ ...a, country: e.target.value }))}
                                                    placeholder="Maldives"
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                type="button"
                                                disabled={savingAddress}
                                                onClick={async () => {
                                                    if (!newAddress.address || !newAddress.city || !newAddress.country) return;
                                                    setSavingAddress(true);
                                                    try {
                                                        const result = await authAPI.addAddress(newAddress);
                                                        const saved = result?.['address'] ?? result;
                                                        setAddresses(prev => [...prev, saved]);
                                                        setNewAddress({ label: '', address: '', city: '', postalCode: '', country: '' });
                                                        setShowAddressForm(false);
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                        setSavingAddress(false);
                                                    }
                                                }}
                                                className="bg-secondary text-white hover:bg-primary"
                                            >
                                                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Address'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                )}

                                {addresses.length === 0 && !showAddressForm ? (
                                    <div className="py-12 text-center text-gray-500 border border-dashed rounded-lg border-gray-200 bg-gray-50">
                                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg mb-2">No saved addresses yet.</p>
                                        <Button variant="outline" onClick={() => setShowAddressForm(true)} className="mt-4 gap-2">
                                            <Plus size={14} /> Add your first address
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.map((addr, idx) => (
                                            <div key={addr._id || idx} className="flex items-start justify-between p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                                                    <div className="text-sm">
                                                        {addr.label && <p className="font-semibold text-gray-900 mb-1">{addr.label}</p>}
                                                        <p className="text-gray-700">{addr.address}</p>
                                                        <p className="text-gray-500">{addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}</p>
                                                        <p className="text-gray-500">{addr.country}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (!addr._id) {
                                                            setAddresses(prev => prev.filter((_, i) => i !== idx));
                                                            return;
                                                        }
                                                        try {
                                                            await authAPI.deleteAddress(addr._id);
                                                            setAddresses(prev => prev.filter(a => a._id !== addr._id));
                                                        } catch (err) {
                                                            console.error(err);
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete address"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
