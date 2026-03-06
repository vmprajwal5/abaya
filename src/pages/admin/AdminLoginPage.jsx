import { useState } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { Lock, User, Loader2 } from "lucide-react"
import { authAPI } from "../../services/api"

export function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/admin/dashboard"

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            const data = await authAPI.login({ email, password })
            if (data.isAdmin) {
                navigate(from, { replace: true })
            } else {
                setError("Access denied: Not an administrator")
                // Optional: Logout if they logged in but aren't admin, to clear state
                authAPI.logout()
            }
        } catch (err) {
            setError(err.message || "Invalid credentials")
        } finally {
            setIsLoading(false)
        }
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
    if (userInfo && userInfo.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-500 mt-2">Sign in to manage your store</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="admin@abaya.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Sign In
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                    <p className="font-medium mb-1">Demo Credentials:</p>
                    <p>admin@example.com</p>
                    <p>password123</p>
                </div>
            </div>
        </div>
    )
}
