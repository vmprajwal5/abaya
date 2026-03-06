import ProductCard from "./ProductCard"
import { SectionHeader } from "./ui/SectionHeader"
import { useShop } from "../contexts/ShopContext"

export function NewArrivals() {
    const { products, loading } = useShop()

    if (loading) return <div className="py-24 text-center text-xs uppercase tracking-wider text-gray-400">Loading New Arrivals...</div>
    if (!products || products.length === 0) return null;

    // Display only first 4 products for new arrivals or filter by 'isNew' if available
    const newArrivals = products.slice(0, 4);

    return (
        <section className="py-32 bg-white">
            <div className="container max-w-[1400px] px-6 md:px-12">
                <SectionHeader
                    title="New Arrivals"
                    subtitle="Latest Collection"
                    viewAllLink="/shop"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {newArrivals.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
