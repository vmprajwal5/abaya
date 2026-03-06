import { Navigate, Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"

export function AdminLayout({ children = null }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
    const isAuthenticated = userInfo && userInfo.isAdmin

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-10 bg-gray-100 min-h-screen">
                {children || <Outlet />}
            </main>
        </div>
    )
}
