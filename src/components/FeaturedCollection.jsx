import { Button } from "./ui/button"
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react"

export function FeaturedCollection() {
    return (
        <section>
            {/* Featured Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-[600px] lg:h-[800px] bg-cover bg-center sm:bg-top grayscale-[10%]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596464871407-1e5443202957?q=80&w=1400')" }} />
                <div className="bg-white flex items-center justify-center p-12 lg:p-24 border-b border-gray-100 lg:border-none">
                    <div className="max-w-md space-y-10 text-center lg:text-left">
                        <div>
                            <span className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-medium block mb-6">
                                Seasonal Focus
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-black leading-tight">
                                The Velvet Series
                            </h2>
                        </div>
                        <div className="w-12 h-px bg-black mx-auto lg:mx-0" />
                        <p className="text-gray-500 leading-relaxed font-light text-sm tracking-wide">
                            Crafted for the cooler season, our premium velvet collection combines warmth with effortless drape.
                            Minimalist silhouettes meet rich, deep textures.
                        </p>
                        <Button variant="outline" className="px-10 py-6 uppercase tracking-[0.2em] text-xs">
                            View Collection
                        </Button>
                    </div>
                </div>
            </div>

            {/* Why Choose Us - Minimal */}
            <div className="bg-white text-black py-32 border-t border-gray-100">
                <div className="container max-w-[1400px] px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
                        <Feature
                            icon={<Truck className="w-6 h-6 text-black" strokeWidth={1} />}
                            title="Global Shipping"
                            desc="Complimentary on orders over $150"
                        />
                        <Feature
                            icon={<RotateCcw className="w-6 h-6 text-black" strokeWidth={1} />}
                            title="Returns"
                            desc="30-day simplified return process"
                        />
                        <Feature
                            icon={<ShieldCheck className="w-6 h-6 text-black" strokeWidth={1} />}
                            title="Quality Agnostic"
                            desc="Premium materials, verified origin"
                        />
                        <Feature
                            icon={<CreditCard className="w-6 h-6 text-black" strokeWidth={1} />}
                            title="Secure Checkout"
                            desc="Encrypted payment processing"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Feature({ icon, title, desc }) {
    return (
        <div className="flex flex-col items-center space-y-6 group">
            <div className="p-4 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-medium uppercase tracking-[0.1em]">{title}</h3>
                <p className="text-gray-400 text-xs font-light tracking-wide">{desc}</p>
            </div>
        </div>
    )
}
