import { useState, useEffect } from "react"
import { getSubscribers } from "../../services/api"
import { Mail, Send, Loader2, Copy, Check } from "lucide-react"

export function NewsletterPage() {
    const [subscribers, setSubscribers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        setIsLoading(true)
        try {
            const { data } = await getSubscribers()
            setSubscribers(data || [])
        } catch (error) {
            console.error("Failed to fetch subscribers", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleComposeEmail = () => {
        if (subscribers.length === 0) return alert("No subscribers to email.")

        const emails = subscribers.map(s => s.email).join(',')
        const mailtoLink = `mailto:?bcc=${emails}&subject=Newsletter Update`
        window.location.href = mailtoLink
    }

    const copyEmails = () => {
        const emails = subscribers.map(s => s.email).join(', ')
        navigator.clipboard.writeText(emails)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
                <div className="flex gap-3">
                    <button
                        onClick={copyEmails}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copy all emails to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Emails"}
                    </button>
                    <button
                        onClick={handleComposeEmail}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        Compose Email
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : subscribers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Email Address</th>
                                    <th className="px-6 py-4">Subscribed Date</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(sub.createdAt || sub.subscribedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Subscribed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p>No subscribers yet.</p>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-3 items-start">
                <div className="p-1"><Mail className="w-5 h-5" /></div>
                <div>
                    <strong>Tip:</strong> You can define the newsletter signup form in your website footer. Ensure it calls the <code>/api/newsletter</code> endpoint to populate this list.
                </div>
            </div>
        </div>
    )
}
