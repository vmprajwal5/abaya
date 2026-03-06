import Navbar from "./Navbar"
import { Footer } from "./Footer"
import { ChatWidget } from "./ChatWidget"
import { WhatsAppButton } from "./WhatsAppButton"
import { NewsletterPopup } from "./NewsletterPopup"

export function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <NewsletterPopup />
            <ChatWidget />
            <WhatsAppButton />
        </div>
    )
}
