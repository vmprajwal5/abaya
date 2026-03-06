import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Copy } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

export function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [step, setStep] = useState("form")
    const [isCopied, setIsCopied] = useState(false)

    // Triggers
    useEffect(() => {
        // Check if already subscribed or dismissed recently
        const status = localStorage.getItem("newsletter_status")
        if (status) {
            const data = JSON.parse(status)
            if (data.type === "subscribed") return

            // If dismissed, check if 7 days have passed
            if (data.type === "dismissed") {
                const daysSinceDismissal = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24)
                if (daysSinceDismissal < 7) return
            }
        }

        const showPopup = () => setIsOpen(true)

        // 1. Time Trigger (10s)
        const timer = setTimeout(showPopup, 10000)

        // 2. Scroll Trigger (50%)
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
            if (scrollPercent > 0.5) {
                showPopup()
                window.removeEventListener("scroll", handleScroll)
            }
        }
        window.addEventListener("scroll", handleScroll)

        // 3. Exit Intent
        const handleExit = (e) => {
            if (e.clientY <= 0) {
                showPopup()
                document.removeEventListener("mouseleave", handleExit)
            }
        }
        document.addEventListener("mouseleave", handleExit)

        return () => {
            clearTimeout(timer)
            window.removeEventListener("scroll", handleScroll)
            document.removeEventListener("mouseleave", handleExit)
        }
    }, [])

    const handleDismiss = () => {
        setIsOpen(false)
        localStorage.setItem("newsletter_status", JSON.stringify({
            type: "dismissed",
            timestamp: Date.now()
        }))
    }

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!email) return

        // Simulate API call
        setTimeout(() => {
            setStep("success")
            localStorage.setItem("newsletter_status", JSON.stringify({
                type: "subscribed",
                timestamp: Date.now()
            }))
        }, 800)
    }

    const copyCode = () => {
        navigator.clipboard.writeText("WELCOME10")
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white w-full max-w-4xl h-auto md:h-[500px] overflow-hidden flex flex-col md:flex-row shadow-none"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-6 right-6 z-10 p-2 hover:opacity-50 transition-opacity"
                        >
                            <X className="w-5 h-5 text-black" strokeWidth={1} />
                        </button>

                        {/* Image Column */}
                        <div className="w-full md:w-[45%] bg-gray-100 relative hidden md:block grayscale">
                            <img
                                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800"
                                alt="Elegant Collection"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                            {step === "form" ? (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-light tracking-tight text-black uppercase">
                                            The Edit
                                        </h2>
                                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                                            Join our list for early access to new collections and receive 10% off your first purchase.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubscribe} className="space-y-4">
                                        <input
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-0 py-3 border-b border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors uppercase tracking-wide"
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-black text-white hover:bg-gray-800 py-6 text-xs uppercase tracking-[0.2em]"
                                        >
                                            Join Now
                                        </Button>
                                    </form>

                                    <div className="pt-2">
                                        <button
                                            onClick={handleDismiss}
                                            className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
                                        >
                                            No thanks
                                        </button>
                                        <p className="text-[10px] text-gray-300 mt-6 uppercase tracking-wider">
                                            By signing up, you agree to our Privacy Policy.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 py-8">
                                    <div className="w-16 h-16 border border-black rounded-full flex items-center justify-center mx-auto md:mx-0">
                                        <Check className="w-6 h-6 text-black" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-light text-black uppercase tracking-wide">
                                            Welcome
                                        </h2>
                                        <p className="text-gray-500 text-sm font-light">
                                            Use this code at checkout for your discount.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-6 flex items-center justify-between gap-4 border border-gray-100">
                                        <code className="text-xl font-medium text-black tracking-[0.1em]">
                                            WELCOME10
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={copyCode}
                                            className={cn("min-w-[80px] text-xs uppercase tracking-wider hover:bg-white", isCopied && "text-black")}
                                        >
                                            {isCopied ? "Copied" : "Copy"}
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={handleDismiss}
                                        variant="outline"
                                        className="w-full mt-4 border-black text-black hover:bg-black hover:text-white"
                                    >
                                        Start Shopping
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
