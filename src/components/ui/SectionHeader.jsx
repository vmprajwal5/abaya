import { ArrowRight } from "lucide-react"

export function SectionHeader({ title, subtitle, viewAllLink, centered = false }) {
    return (
        <div className={`mb-16 ${centered ? "text-center" : "flex flex-col md:flex-row md:justify-between md:items-end gap-6"}`}>
            <div className="space-y-4">
                {subtitle && (
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-medium">
                        {subtitle}
                    </p>
                )}
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                    {title}
                </h2>
            </div>

            {viewAllLink && (
                <a
                    href={viewAllLink}
                    className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:opacity-60 transition-opacity pb-1"
                >
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[1px]" />
                </a>
            )}
        </div>
    )
}
