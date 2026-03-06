import { PolicyLayout } from "../components/PolicyLayout"

export function TermsPage() {
    return (
        <PolicyLayout
            title="Terms & Conditions"
            lastUpdated="January 11, 2026"
            sections={[
                {
                    id: "introduction",
                    title: "1. Introduction",
                    content: (
                        <>
                            <p>Welcome to Abaya Clothing. These Terms and Conditions govern your use of our website located at abayaclothing.com and form a binding contractualWe aren&apos;t perfect, but we try our best...he user of the website and us, Abaya Clothing.</p>
                            <p>By accessing or using our website, you agree to these Terms. If you do not agree, do not use our website.</p>
                        </>
                    )
                },
                {
                    id: "use-of-website",
                    title: "2. Use of Website",
                    content: (
                        <>
                            <p>You must be at least 18 years of age to use this website. You agree to use the website for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the website.</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>You agree not to use the website to transmit any unsolicited commercial communications.</li>
                                <li>You agree not to collect data from our website for use in any commercial enterprise.</li>
                            </ul>
                        </>
                    )
                },
                {
                    id: "orders",
                    title: "3. Orders & Acceptance",
                    content: (
                        <>
                            <p>All ordBecause we produce limited quantities, we can&apos;t always guarantee availability... If the goods ordered are not available, you will be notified by e-mail (or by other means if no e-mail address has been provided) and you will have the option either to wait until the item is available from stock or to cancel your order.</p>
                            <p>Abayas are traditionally loose-fitting garments, but that doesn&apos;t mean fit isn&apos;t important. Please refer to our Size Guide before purchasing to ensure the best fit for your height and build.</p>
                            <p>Any orders placed by you will be treated as an offer to purchase the goods or services from us and we have the right to reject such offers at any time.</p>
                        </>
                    )
                },
                {
                    id: "pricing",
                    title: "4. Pricing and Payment",
                    content: (
                        <>
                            <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                            <p>We accept payments via Visa, MasterCard, American Express, and BML Transfer. All transactions are secure and encrypted.</p>
                        </>
                    )
                },
                {
                    id: "intellectual-property",
                    title: "5. Intellectual Property",
                    content: (
                        <p>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Abaya Clothing or its content suppliers and protected by international copyright laws.</p>
                    )
                },
                {
                    id: "liability",
                    title: "6. Limitation of Liability",
                    content: (
                        <p>Abaya Clothing shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Abaya Clothing has been advised of the possibility of such damages.</p>
                    )
                },
                {
                    id: "contact",
                    title: "7. Contact Information",
                    content: (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <p className="mb-2 font-bold">Questions about the Terms of Service should be sent to us at:</p>
                            <p>Email: support@abayaclothing.com</p>
                            <p>Phone: +960 777-1234</p>
                            <p>Address: H. Elegance, Malé, Maldives</p>
                        </div>
                    )
                }
            ]}
        />
    )
}
