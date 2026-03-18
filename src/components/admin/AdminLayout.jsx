import { Navigate, Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { useAuth } from "../../contexts/AuthContext"

export function AdminLayout({ children = null }) {
    const { currentUser, loading } = useAuth()
    
    if (loading) return null;

    const isAuthenticated = currentUser && currentUser.isAdmin

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
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
