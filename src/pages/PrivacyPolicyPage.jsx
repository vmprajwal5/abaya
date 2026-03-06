import { PolicyLayout } from "../components/PolicyLayout"

export function PrivacyPolicyPage() {
    return (
        <PolicyLayout
            title="Privacy Policy"
            lastUpdated="January 11, 2026"
            sections={[
                {
                    id: "collection",
                    title: "1. Information We Collect",
                    content: (
                        <>
                            <p>We collect information you provide directly to us. For example, we collect information when you create an account, make a purchase, sign up for our newsletter, or contact us. The types of information we may collect include:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Name, email address, postal address, phone number</li>
                                <li>Payment information (credit card numbers are not stored on our servers)</li>
                                <li>Demographic information</li>
                                <li>Purchase history</li>
                            </ul>
                        </>
                    )
                },
                {
                    id: "usage",
                    title: "2. How We Use Information",
                    content: (
                        <>
                            <p>We use the information we collect to provide, maintain, and improve our services, such as to:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Communicate with you about products, services, and offers</li>
                                <li>Monitor and analyze trends and usage</li>
                            </ul>
                        </>
                    )
                },
                {
                    id: "sharing",
                    title: "3. Information Sharing",
                    content: (
                        <p>We may share information about you as follows or as otherwise described in this Privacy Policy: with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</p>
                    )
                },
                {
                    id: "cookies",
                    title: "4. Cookies & Tracking",
                    content: (
                        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                    )
                },
                {
                    id: "security",
                    title: "5. Data Security",
                    content: (
                        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                    )
                },
                {
                    id: "rights",
                    title: "6. Your Rights (GDPR)",
                    content: (
                        <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights using Abaya Clothing. You have the right to access, update or to delete the information we have on you. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.</p>
                    )
                },
                {
                    id: "contact",
                    title: "7. Contact Us",
                    content: (
                        <p>If you have any questions about this Privacy Policy, please contact us by email: privacy@abayaclothing.com</p>
                    )
                }
            ]}
        />
    )
}
