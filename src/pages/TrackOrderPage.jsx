import { motion } from "framer-motion"

export function TrackOrderPage() {
    return (
        <div className="container max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-lg mx-auto"
            >
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black uppercase mb-8">Track Order</h1>
                <p className="text-gray-500 mb-12 font-light text-sm">
                    Enter your order number to retrieve status.
                </p>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="ORDER NUMBER"
                        className="w-full border-b border-gray-200 py-4 text-center text-lg uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                    />
                    <button className="mt-8 bg-black text-white px-12 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors w-full md:w-auto">
                        Track Status
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
