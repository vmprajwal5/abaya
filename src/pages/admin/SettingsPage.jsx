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
    const [activeSubTab, setActiveSubTab] = useState('general')
    const [formData, setFormData] = useState({
        siteName: 'Abaya Store',
        storeDescription: '',
        storeAddress: '',
        currency: 'MVR',
        taxRate: 6,
        orderPrefix: 'ABY-',
        supportEmail: '',
        supportPhone: '',
        shippingPrice: 50,
        freeShippingThreshold: 1000,
        socialLinks: { instagram: '', facebook: '', whatsapp: '' },
        announcementBar: { show: false, text: '' },
        bankDetails: { accountName: '', accountNumber: '', bankName: 'Bank of Maldives', instructions: '' },
        seoSettings: { metaTitle: '', metaDescription: '', keywords: '' }
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (settings) {
            setFormData({
                ...formData, // ensure defaults
                ...settings,
                socialLinks: { ...formData.socialLinks, ...(settings.socialLinks || {}) },
                announcementBar: { ...formData.announcementBar, ...(settings.announcementBar || {}) },
                bankDetails: { ...formData.bankDetails, ...(settings.bankDetails || {}) },
                seoSettings: { ...formData.seoSettings, ...(settings.seoSettings || {}) }
            })
        }
    }, [settings])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNestedChange = (category, e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
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

    const subTabs = [
        { id: 'general', label: 'General & SEO' },
        { id: 'logistics', label: 'Financials & Logistics' },
        { id: 'payment', label: 'Payment Methods' },
        { id: 'social', label: 'Social' }
    ]

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-800">Store Configuration</h2>
                <div className="flex flex-wrap gap-2">
                    {subTabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                activeSubTab === tab.id 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col max-w-2xl">
                <div className="flex-1 space-y-8">
                    {/* General & SEO Tab */}
                    {activeSubTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input type="text" name="siteName" value={formData.siteName || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                    <input type="email" name="supportEmail" value={formData.supportEmail || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                                    <input type="text" name="supportPhone" value={formData.supportPhone || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                                <input type="text" name="storeAddress" value={formData.storeAddress || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
                                <textarea name="storeDescription" value={formData.storeDescription || ''} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mt-8">SEO Settings</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                <input type="text" name="metaTitle" value={formData.seoSettings.metaTitle || ''} onChange={(e) => handleNestedChange('seoSettings', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea name="metaDescription" value={formData.seoSettings.metaDescription || ''} onChange={(e) => handleNestedChange('seoSettings', e)} rows={2} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                                <input type="text" name="keywords" value={formData.seoSettings.keywords || ''} onChange={(e) => handleNestedChange('seoSettings', e)} placeholder="abaya, modest fashion, etc" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    )}

                    {/* Financials & Logistics Tab */}
                    {activeSubTab === 'logistics' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <input type="text" name="currency" value={formData.currency || 'MVR'} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Prefix</label>
                                    <input type="text" name="orderPrefix" value={formData.orderPrefix || 'ABY-'} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                    <input type="number" name="taxRate" value={formData.taxRate || 0} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Price Base (MVR)</label>
                                    <input type="number" name="shippingPrice" value={formData.shippingPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (MVR)</label>
                                    <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Methods Tab */}
                    {activeSubTab === 'payment' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Bank Transfer Details (BML)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankDetails.bankName || ''} onChange={(e) => handleNestedChange('bankDetails', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                    <input type="text" name="accountName" value={formData.bankDetails.accountName || ''} onChange={(e) => handleNestedChange('bankDetails', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input type="text" name="accountNumber" value={formData.bankDetails.accountNumber || ''} onChange={(e) => handleNestedChange('bankDetails', e)} placeholder="e.g. 7730 0000 0000 0000" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Instructions</label>
                                <textarea name="instructions" value={formData.bankDetails.instructions || ''} onChange={(e) => handleNestedChange('bankDetails', e)} rows={3} placeholder="Provide clear instructions for customer after order placement" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>
                        </div>
                    )}

                    {/* Social & Announcements Tab */}
                    {activeSubTab === 'social' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Social Media Links</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                    <input type="text" name="instagram" value={formData.socialLinks.instagram || ''} onChange={(e) => handleNestedChange('socialLinks', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://instagram.com/..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                                    <input type="text" name="facebook" value={formData.socialLinks.facebook || ''} onChange={(e) => handleNestedChange('socialLinks', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://facebook.com/..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp URL</label>
                                    <input type="text" name="whatsapp" value={formData.socialLinks.whatsapp || ''} onChange={(e) => handleNestedChange('socialLinks', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://wa.me/..." />
                                </div>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mt-8">Announcement Banner</h3>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="show" checked={formData.announcementBar.show || false} onChange={(e) => handleNestedChange('announcementBar', e)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Show Announcement</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
                                <input type="text" name="text" value={formData.announcementBar.text || ''} onChange={(e) => handleNestedChange('announcementBar', e)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Sale 50% Off!" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex flex-col items-start">
                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Changes apply to all tabs. Save once when done.</p>
                </div>
            </form>
        </div>
    )
}
