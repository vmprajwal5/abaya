import { PolicyLayout } from "../components/PolicyLayout"

export function ShippingPolicyPage() {
    return (
        <PolicyLayout
            title="Shipping Policy"
            lastUpdated="January 11, 2026"
            sections={[
                {
                    id: "locations",
                    title: "1. Shipping Locations",
                    content: (
                        <p>We ship domestically throughout the Maldives and internationally to over 50 countries including USA, UK, UAE, Saudi Arabia, and most of Europe and Asia. If your country is not listed at checkout, please contact us.</p>
                    )
                },
                {
                    id: "methods-costs",
                    title: "2. Shipping Methods & Costs",
                    content: (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 mt-4 text-sm text-left">
                                <thead className="bg-gray-50 font-bold text-gray-900 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Region</th>
                                        <th className="px-6 py-3">Service</th>
                                        <th className="px-6 py-3">Cost</th>
                                        <th className="px-6 py-3">Estimated Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-6 py-4">Maldives (Greater Malé)</td>
                                        <td className="px-6 py-4">Standard Delivery</td>
                                        <td className="px-6 py-4">Free</td>
                                        <td className="px-6 py-4">1-2 Days</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Maldives (Atolls)</td>
                                        <td className="px-6 py-4">Boat/Ferry Cargo</td>
                                        <td className="px-6 py-4">MVR 50 (Free over MVR 1000)</td>
                                        <td className="px-6 py-4">3-5 Days</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">International</td>
                                        <td className="px-6 py-4">DHL Express</td>
                                        <td className="px-6 py-4">$25 USD</td>
                                        <td className="px-6 py-4">5-7 Days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                },
                {
                    id: "processing",
                    title: "3. Processing Time",
                    content: (
                        <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
                    )
                },
                {
                    id: "tracking",
                    title: "4. Package Tracking",
                    content: (
                        <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
                    )
                },
                {
                    id: "customs",
                    title: "5. Customs, Duties and Taxes",
                    content: (
                        <p>Abaya Clothing is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>
                    )
                },
                {
                    id: "issues",
                    title: "6. Use of P.O. Boxes",
                    content: (
                        <p>Unfortunately, we cannot ship to P.O. Boxes via DHL Express. Please provide a physical address to ensure delivery.</p>
                    )
                }
            ]}
        />
    )
}
