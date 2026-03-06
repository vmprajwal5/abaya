import { Button } from "./ui/button"

const categories = [
    {
        title: "Abayas",
        image: "https://images.unsplash.com/photo-1594136976569-82559779df30?q=80&w=1200",
        link: "/shop?category=abayas"
    },
    {
        title: "Hijabs",
        image: "https://images.unsplash.com/photo-1585854460596-f3089d4d5462?q=80&w=1200",
        link: "/shop?category=hijabs"
    },
    {
        title: "Accessories",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200",
        link: "/shop?category=accessories"
    }
]

export function CategoryShowcase() {
    return (
        <section className="py-24 bg-white">
            <div className="container px-6 md:px-12 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => (
                        <a href={cat.link} key={idx} className="group relative h-[500px] overflow-hidden block bg-gray-50">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />
                            {/* Minimal Overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                                <h3 className="text-2xl font-light uppercase tracking-[0.2em] mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.title}
                                </h3>
                                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1">
                                        View Products
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
