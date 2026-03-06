import { Layout } from "../components/Layout"
import { motion } from "framer-motion"

export function ContactPage() {
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
                    Please email us directly.
                </p>
                <div className="pt-4 space-y-2">
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
