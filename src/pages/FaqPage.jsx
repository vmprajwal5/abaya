import { motion } from "framer-motion"

export function FaqPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">Frequently Asked Questions</h1>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">How long does shipping take?</h3>
                        <p className="text-gray-600">Standard shipping typically takes 3-5 business days within Maldives, and 7-14 business days for international orders.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">What is your return policy?</h3>
                        <p className="text-gray-600">We accept returns within 14 days of delivery. Items must be unworn and in original condition with tags attached.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Do you ship internationally?</h3>
                        <p className="text-gray-600">Yes, we ship to most countries worldwide. Shipping costs will be calculated at checkout.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">How do I care for my Abaya?</h3>
                        <p className="text-gray-600">We recommend dry cleaning or gentle hand wash in cold water for most of our garments to ensure longevity.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
