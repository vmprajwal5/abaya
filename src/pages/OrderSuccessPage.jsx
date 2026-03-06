import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Check, ArrowRight, MapPin } from "lucide-react"
import { Button } from "../components/ui/button"
import confetti from "canvas-confetti"

export function OrderSuccessPage() {
    const [searchParams] = useSearchParams()
    const [orderId] = useState(() => searchParams.get("orderId") || "AB-" + Math.random().toString(36).substr(2, 6).toUpperCase())

    // Trigger confetti on mount
    useEffect(() => {
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min, max) => Math.random() * (max - min) + min

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container max-w-2xl text-center space-y-8 animate-fade-in">

                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
                    <Check className="w-12 h-12 text-green-600" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-serif text-primary">Order Confirmed!</h1>
                    <p className="text-gray-500 text-lg">
                        Thank you for your purchase. We have received your order.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg text-left space-y-6 border border-gray-100 shadow-sm mt-8">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <span className="text-gray-500">Order Number</span>
                        <span className="font-mono font-bold text-lg text-primary">{orderId}</span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            Shipping To
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {/* Mock data or retrieved from state if we fully implemented persistence */}
                            Fathimath Sarah<br />
                            H. Moonlit Rose, 4th Floor<br />
                            Majeedhee Magu<br />
                            Male&apos;, 20057<br />
                            Maldives
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Estimated Delivery</span>
                            <span className="font-medium">3-5 Business Days</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="font-medium">Cash on Delivery</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link to="/track-order">
                        <Button variant="outline" className="w-full sm:w-auto min-w-[200px]">
                            Track Your Order
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button className="w-full sm:w-auto min-w-[200px] bg-secondary text-white hover:bg-primary">
                            Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
