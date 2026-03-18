import { NavLink, useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    Mail,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "../../lib/utils"

import { useAuth } from "../../contexts/AuthContext"

export function AdminSidebar() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Package, label: "Products", path: "/admin/products" },
        { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
        { icon: Users, label: "Customers", path: "/admin/users" },
        { icon: FolderTree, label: "Categories", path: "/admin/categories" },
        { icon: Mail, label: "Messages", path: "/admin/messages" },
        { icon: Mail, label: "Newsletter", path: "/admin/newsletter" },

        { icon: Settings, label: "Settings", path: "/admin/settings" },
    ]

    return (
        <aside className="w-64 bg-[#1e293b] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-serif font-bold tracking-wider">ABAYA</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">AD</div>
                <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-400">admin@abayaclothing.com</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                            isActive
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
