import { PolicyLayout } from "../components/PolicyLayout"
import { ArrowRight } from "lucide-react"

export function ReturnPolicyPage() {
    return (
        <PolicyLayout
            title="Return Policy"
            lastUpdated="January 11, 2026"
            sections={[
                {
                    id: "eligibility",
                    title: "1. Return Eligibility",
                    content: (
                        <>
                            <p>If you are not satisfied, you may return the item within <strong>30 days</strong> of receipt for a refund or exchange.</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-gray-300">
                                <li>Items must be unworn, unwashed, and original condition.</li>
                                <li>All tags must be attached.</li>
                            </ul>
                            <div className="bg-gray-50 p-4 mt-6 border border-gray-100">
                                <p className="text-xs text-black uppercase tracking-wider">Note: Final Sale items are not eligible for return.</p>
                            </div>
                        </>
                    )
                },
                {
                    id: "process",
                    title: "2. How to Initiate a Return",
                    content: (
                        <div className="space-y-4">
                            <p>To start a return:</p>
                            <ol className="list-decimal pl-5 space-y-3 marker:text-gray-400 marker:font-light">
                                <li>Log in to your account.</li>
                                <li>Select items to return.</li>
                                <li>Print the prepaid shipping label.</li>
                            </ol>
                            <button className="text-black text-xs uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity mt-4 flex items-center gap-2">
                                Access Return Portal <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    )
                },
                {
                    id: "refunds",
                    title: "3. Refund Process",
                    content: (
                        <p>Refunds are processed to the original payment method within 5-10 business days of receipt.</p>
                    )
                },
                {
                    id: "exchanges",
                    title: "4. Exchanges",
                    content: (
                        <p>We allow free exchanges for size or color. For different styles, please return and place a new order.</p>
                    )
                },
                {
                    id: "shipping-costs",
                    title: "5. Return Shipping Costs",
                    content: (
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-300">
                            <li><strong>Maldives:</strong> Free.</li>
                            <li><strong>International:</strong> Flat fee of $15 USD deducted from refund.</li>
                        </ul>
                    )
                },
                {
                    id: "damaged",
                    title: "6. Damaged Items",
                    content: (
                        <p>Contact support@abayaclothing.com immediately with photos if you receive a defective item.</p>
                    )
                }
            ]}
        />
    )
}
