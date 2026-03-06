
export function AboutPage() {
    return (
        <div className="pt-24 pb-16 bg-white">
            {/* Hero Section */}
            <div className="container max-w-[1400px] px-6 md:px-12 mb-24">
                <div className="max-w-4xl mx-auto text-center border-b border-gray-100 pb-20">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block mb-6">Established 2024</span>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black mb-8 uppercase">Minimalist Modesty</h1>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed tracking-wide font-light max-w-2xl mx-auto">
                        Abaya Clothing bridges the gap between tradition and modern reductionism.
                        We craft silhouettes that empower through simplicity, using materials that speak for themselves.
                    </p>
                </div>
            </div>

            {/* Image Grid */}
            <div className="container max-w-[1400px] px-6 md:px-12 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="h-[600px] bg-gray-50 overflow-hidden grayscale">
                        {/* Placeholder for brand image */}
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                            Brand Imagery
                        </div>
                    </div>
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-xl font-light uppercase tracking-widest mb-4 border-l-2 border-black pl-6">Craftsmanship</h2>
                            <p className="text-gray-500 text-sm leading-8 font-light pl-6">
                                Every piece is an exercise in restraint. We reject fast fashion in favor of deliberate design.
                                Sourcing only premium, breathable fabrics designed for comfort in tropical and arid climates alike.
                                Precision stitching is our quiet signature.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-light uppercase tracking-widest mb-6 border-l-2 border-black pl-6">Principles</h2>
                            <ul className="space-y-6 pl-6">
                                <li className="flex flex-col gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black">Modesty First</span>
                                    <span className="text-gray-500 text-sm font-light">Integrating contemporary forms with respectful coverage.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black">Uncompromising Quality</span>
                                    <span className="text-gray-500 text-sm font-light">Standards that exceed expectation.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black">Sustainable Practice</span>
                                    <span className="text-gray-500 text-sm font-light">Supporting artisans and minimizing waste.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founder/Team Section - Optional */}
            <div className="bg-white py-20 border-t border-gray-100">
                <div className="container max-w-[1400px] px-6 md:px-12 text-center">
                    <h2 className="text-2xl font-light uppercase tracking-widest mb-16">The Methodology</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Design", desc: "Form follows function." },
                            { title: "Material", desc: "Natural, breathable fibers." },
                            { title: "Production", desc: "Ethical and precise." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8">
                                <div className="w-12 h-12 border border-black rounded-full flex items-center justify-center mx-auto mb-6 text-black text-sm">
                                    0{i + 1}
                                </div>
                                <h3 className="font-medium text-sm w-full uppercase tracking-widest mb-3">{item.title}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
