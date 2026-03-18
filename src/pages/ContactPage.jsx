import { motion } from "framer-motion"
import { useState } from "react"
import toast from "react-hot-toast"

export function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            toast.success("Thank you for your message. We will get back to you shortly.")
            setFormData({ name: '', email: '', message: '' })
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="container max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-xl mx-auto space-y-8"
            >
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black uppercase">Contact Us</h1>
                <div className="md:w-px md:h-12 bg-black mx-auto hidden md:block" />
                <p className="text-gray-500 font-light leading-relaxed">
                    We are available to assist you with any inquiries.<br />
                    Please fill out the form below.
                </p>

                <form onSubmit={handleSubmit} className="text-left space-y-4 pt-4">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Message</label>
                        <textarea
                            id="message"
                            required
                            rows="4"
                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 w-full uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <div className="pt-8 space-y-2 border-t border-gray-100 mt-8">
                    <a href="mailto:support@abayaclothing.com" className="block text-lg md:text-xl text-black border-b border-black/20 pb-1 hover:border-black transition-colors w-fit mx-auto">
                        support@abayaclothing.com
                    </a>
                    <p className="text-sm text-gray-400 font-light mt-4">
                        +960 777-1234
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default ContactPage;
