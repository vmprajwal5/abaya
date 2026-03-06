import { motion } from "framer-motion"

export function PaymentMethodsPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-serif font-bold mb-8">Payment Methods</h1>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    We accept a variety of payment methods to make your shopping experience convenient and secure.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div className="border p-8 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                        <span className="font-bold text-xl mb-2">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                    <div className="border p-8 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                        <span className="font-bold text-xl mb-2">PayPal</span>
                        <p className="text-sm text-gray-500">Secure online payment</p>
                    </div>
                    <div className="border p-8 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                        <span className="font-bold text-xl mb-2">BML Transfer</span>
                        <p className="text-sm text-gray-500">Bank of Maldives Online Transfer</p>
                    </div>
                    <div className="border p-8 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                        <span className="font-bold text-xl mb-2">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Available in Male&apos; City</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
