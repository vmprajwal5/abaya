import { Button } from "./ui/button"

export function Hero() {
    return (
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-white">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop')" }}
            >
                {/* Light Overlay for text readability if needed, or keeping it clean */}
                <div className="absolute inset-0 bg-white/10" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto space-y-10">
                <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium animate-fade-in opacity-0 text-white/90" style={{ animationDelay: '0.2s' }}>
                    Collection 2026
                </h2>

                <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[1.1] animate-fade-in opacity-0 mix-blend-difference" style={{ animationDelay: '0.4s' }}>
                    MONOCHROME <br /> ELEGANCE
                </h1>

                <p className="text-sm md:text-base font-normal tracking-wide opacity-0 animate-fade-in text-white/80 block max-w-lg mx-auto uppercase" style={{ animationDelay: '0.6s' }}>
                    Modesty refined through the art of simplicity.
                </p>

                <div className="pt-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <Button size="lg" variant="white" className="px-12 py-6 text-xs uppercase tracking-[0.2em] border-none hover:bg-black hover:text-white transition-colors duration-500">
                        Explore Collection
                    </Button>
                </div>
            </div>
        </section>
    )
}
