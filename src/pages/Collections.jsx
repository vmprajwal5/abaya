import { Link } from 'react-router-dom';

const collections = [
    {
        name: 'Casual',
        description: 'Effortless everyday elegance',
        image: 'https://images.unsplash.com/photo-1583391733981-0af1f6d4a9f1?w=600&q=80',
        slug: 'casual',
    },
    {
        name: 'Formal',
        description: 'Refined sophistication',
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&q=80',
        slug: 'formal',
    },
    {
        name: 'Party Wear',
        description: 'Make every occasion memorable',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
        slug: 'party-wear',
    },
    {
        name: 'Daily Wear',
        description: 'Comfort meets style',
        image: 'https://images.unsplash.com/photo-1589810876535-b01d51d96a8a?w=600&q=80',
        slug: 'daily-wear',
    },
];

export default function Collections() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-light tracking-widest uppercase text-black mb-3">
                    Collections
                </h1>
                <p className="text-gray-500 text-sm">Curated styles for every moment</p>
                <div className="w-12 h-px bg-black mx-auto mt-4" />
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((collection) => (
                    <Link
                        key={collection.name}
                        to={`/shop/${collection.slug}`}
                        className="relative group overflow-hidden block"
                    >
                        {/* Image */}
                        <div className="aspect-[3/4] overflow-hidden">
                            <img
                                src={collection.image}
                                alt={collection.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 flex flex-col items-center justify-end pb-8 px-4">
                            <h3 className="text-white text-xl font-light tracking-[0.15em] uppercase">
                                {collection.name}
                            </h3>
                            <p className="text-white/70 text-xs tracking-widest mt-1">
                                {collection.description}
                            </p>
                            <span className="mt-4 text-[10px] tracking-[0.2em] uppercase border border-white/70 text-white/80 px-5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Shop Now
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
