import { useState, useEffect } from "react"

import { User, Lock, Store, Save, Loader2, Check } from "lucide-react"
import useStoreSettings from "../../hooks/useStoreSettings"
import API from "../../services/api"
import { toast } from "react-hot-toast"

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile")

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <nav className="flex flex-col">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === "profile"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                Profile Settings
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === "security"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Lock className="w-5 h-5" />
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab("store")}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === "store"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Store className="w-5 h-5" />
                                Store Configuration
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === "profile" && <ProfileSettings />}
                    {activeTab === "security" && <SecuritySettings />}
                    {activeTab === "store" && <StoreSettings />}
                </div>
            </div>
        </div>
    )
}

function ProfileSettings() {
    // Note: In a real app we would call an API to update user profile.
    // For now we just mock the UI as requested in MVP or implementing basic display.
    // Assuming we have a way to update profile coming soon.

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const [name, setName] = useState(userInfo.name || "")
    const [email, setEmail] = useState(userInfo.email || "")

    const handleSave = (e) => {
        e.preventDefault()
        alert("Profile update logic needs to be connected to backend API if available.")
        // Implement update profile API call
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Profile Information</h2>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="pt-2">
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

function SecuritySettings() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

    const handleSave = (e) => {
        e.preventDefault()
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match")
            return
        }
        alert("Password change logic needs to be connected to backend API.")
        // Implement change password API call
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Change Password</h2>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="pt-2">
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    )
}

function StoreSettings() {
    const { settings, fetchSettings, loading } = useStoreSettings()
    const [formData, setFormData] = useState({
        siteName: '',
        supportEmail: '',
        supportPhone: '',
        shippingPrice: 50,
        freeShippingThreshold: 1000,
        socialLinks: { instagram: '', facebook: '', whatsapp: '' },
        announcementBar: { show: false, text: '' },
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setFormData(settings)
        }
    }, [settings])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSocialChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }))
    }

    const handleAnnouncementChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            announcementBar: {
                ...prev.announcementBar,
                [name]: type === 'checkbox' ? checked : value
            }
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.put('/settings', formData)
            await fetchSettings()
            toast.success("Settings updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Store Configuration</h2>

            <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                {/* Financials */}
                <section className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Price (MVR)</label>
                            <input
                                type="number"
                                name="shippingPrice"
                                value={formData.shippingPrice}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (MVR)</label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={formData.freeShippingThreshold}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                            <input
                                type="text"
                                name="supportPhone"
                                value={formData.supportPhone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                            <input
                                type="text"
                                name="supportEmail"
                                value={formData.supportEmail}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Social Media</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleSocialChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.socialLinks.facebook}
                                onChange={handleSocialChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp URL</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.socialLinks.whatsapp}
                                onChange={handleSocialChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://wa.me/..."
                            />
                        </div>
                    </div>
                </section>

                {/* Banner */}
                <section className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Announcement Banner</h3>
                    <div className="flex items-center gap-3 mb-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="show"
                                checked={formData.announcementBar.show}
                                onChange={handleAnnouncementChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">Show Announcement</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
                        <input
                            type="text"
                            name="text"
                            value={formData.announcementBar.text}
                            onChange={handleAnnouncementChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Sale 50% Off!"
                        />
                    </div>
                </section>

                <div className="pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </form>
        </div>
    )
}
