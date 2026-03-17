import { useState, useEffect } from "react"
import { adminLogsAPI } from "../../services/api"
import {
    Activity,
    ShieldAlert,
    UserX,
    AlertTriangle,
    Eye
} from "lucide-react"

export function AdminLogsPage() {
    const [stats, setStats] = useState(null)
    const [securityLogs, setSecurityLogs] = useState([])
    const [auditLogs, setAuditLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('security')

    useEffect(() => {
        const fetchLogData = async () => {
            try {
                const [statsRes, securityRes, auditRes] = await Promise.all([
                    adminLogsAPI.getStats().catch(() => ({ data: null })),
                    adminLogsAPI.getSecurityLogs().catch(() => ({ data: [] })),
                    adminLogsAPI.getAuditLogs().catch(() => ({ data: [] }))
                ])

                if (statsRes && statsRes.data) setStats(statsRes.data)
                if (securityRes && securityRes.data) setSecurityLogs(securityRes.data)
                if (auditRes && auditRes.data) setAuditLogs(auditRes.data)

            } catch (error) {
                console.error("Failed to fetch logs data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLogData()
    }, [])

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading system logs...</div>
    }

    const statCards = [
        { 
            title: "Successful Logins (24h)", 
            value: stats?.authentication?.successfulLogins || 0, 
            icon: Activity, 
            color: "text-green-500" 
        },
        { 
            title: "Failed Logins (24h)", 
            value: stats?.authentication?.failedLogins || 0, 
            icon: UserX, 
            color: "text-red-500" 
        },
        { 
            title: "Suspicious Activity (24h)", 
            value: stats?.suspicious || 0, 
            icon: ShieldAlert, 
            color: "text-orange-500" 
        },
        { 
            title: "System Errors (24h)", 
            value: stats?.errors || 0, 
            icon: AlertTriangle, 
            color: "text-red-600" 
        },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">System Activity & Logs</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-2 text-white">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-800">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    className={`pb-4 px-4 font-medium text-sm transition-colors ${
                        activeTab === 'security'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('security')}
                >
                    Security Logs
                </button>
                <button
                    className={`pb-4 px-4 font-medium text-sm transition-colors ${
                        activeTab === 'audit'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('audit')}
                >
                    Audit Trail
                </button>
            </div>

            {/* Tables Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'security' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {securityLogs.length === 0 ? (
                                    <tr>
                                        <td className="px-6 py-8 text-center" colSpan={4}>
                                            No security logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    securityLogs.map((log, index) => (
                                        <tr key={log._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {log.event}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    log.level === 'error' ? 'bg-red-100 text-red-800' : 
                                                    log.level === 'warn' ? 'bg-orange-100 text-orange-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {log.level?.toUpperCase() || 'INFO'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono bg-gray-50 rounded">
                                                {JSON.stringify(log.message || log.details || {})}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Actor</th>
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td className="px-6 py-8 text-center" colSpan={5}>
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log, index) => (
                                        <tr key={log._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {log.action || log.event}
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.actor?.email || 'System'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.resource?.type ? `${log.resource.type} (${log.resource.id})` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                    onClick={() => alert(JSON.stringify(log.changes || log.message || log, null, 2))}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
