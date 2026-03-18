import { useState, useEffect } from "react"
import { contactAPI } from "../../services/api"
import { Trash2, CheckCircle, Mail, Clock } from "lucide-react"
import toast from "react-hot-toast"

export function AdminMessagesPage() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        try {
            // The API interceptor returns the data object, but TS infers AxiosResponse
            const response = await contactAPI.getAll()
            const data = /** @type {any} */ (response)
            
            setMessages(data)
        } catch (error) {
            toast.error("Failed to fetch messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleMarkAsRead = async (id) => {
        try {
            await contactAPI.markAsRead(id)
            setMessages(messages.map(msg => 
                msg._id === id ? { ...msg, isRead: true } : msg
            ))
            toast.success("Message marked as read")
        } catch (error) {
            toast.error("Failed to update message")
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return
        
        try {
            await contactAPI.delete(id)
            setMessages(messages.filter(msg => msg._id !== id))
            toast.success("Message deleted successfully")
        } catch (error) {
            toast.error("Failed to delete message")
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Contact Messages</h2>
                    <p className="text-muted-foreground text-gray-500">
                        View and manage messages from the Contact Us page.
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No messages found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((message) => (
                        <div 
                            key={message._id} 
                            className={`p-6 rounded-lg border shadow-sm transition-colors ${
                                message.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {message.name}
                                        {!message.isRead && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                New
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {message.email}
                                        </a>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(message.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-gray-700 whitespace-pre-wrap pt-4 border-t border-gray-100">
                                        {message.message}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {!message.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(message._id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="Mark as read"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(message._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
