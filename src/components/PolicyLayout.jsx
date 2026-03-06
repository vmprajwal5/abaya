import { useRef, useState, useEffect } from "react"
import { Printer, Download, ChevronRight, Menu } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export function PolicyLayout({ title, lastUpdated, sections }) {
    const [activeSection, setActiveSection] = useState(sections[0].id)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const observer = useRef(null)

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }, {
            rootMargin: "-20% 0px -60% 0px"
        })

        sections.forEach((section) => {
            const element = document.getElementById(section.id)
            if (element && observer.current) observer.current.observe(element)
        })

        return () => {
            if (observer.current) observer.current.disconnect()
        }
    }, [sections])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth"
            })
            setIsMobileMenuOpen(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-20 print:bg-white print:pt-0">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 print:hidden">
                <div className="container max-w-[1400px] px-6 md:px-12 py-12">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-6">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span>Legal</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-black font-medium">{title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-2 uppercase">{title}</h1>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Last Updated: {lastUpdated}</p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 text-[10px] uppercase tracking-wider border-gray-200">
                                <Printer className="w-3 h-3" /> Print
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-[1400px] px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Mobile TOC Toggle */}
                    <div className="lg:hidden col-span-1 border border-gray-100 rounded-none bg-white p-4 sticky top-24 z-30">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center justify-between w-full font-medium text-xs uppercase tracking-wider text-black"
                        >
                            <span>Table of Contents</span>
                            <Menu className="w-4 h-4" />
                        </button>
                        {isMobileMenuOpen && (
                            <nav className="mt-4 space-y-2 border-t border-gray-100 pt-4 max-h-60 overflow-y-auto">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "block w-full text-left text-xs uppercase tracking-wide py-2 px-2 transition-colors",
                                            activeSection === section.id
                                                ? "text-black font-bold"
                                                : "text-gray-400 hover:text-black"
                                        )}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Desktop Sidebar TOC */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-32 print:hidden">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-8">Contents</h3>
                        <nav className="space-y-4 border-l border-gray-100 pl-6">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={cn(
                                        "block w-full text-left text-xs uppercase tracking-wider transition-all",
                                        activeSection === section.id
                                            ? "text-black font-bold translate-x-1"
                                            : "text-gray-400 hover:text-black hover:translate-x-1"
                                    )}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-8 lg:col-start-5 bg-white print:p-0">
                        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-light prose-headings:uppercase prose-headings:tracking-wide prose-p:text-gray-600 prose-p:font-light prose-strong:font-medium prose-strong:text-black prose-li:text-gray-600">
                            {sections.map((section) => (
                                <div key={section.id} id={section.id} className="scroll-mt-32 mb-16 last:mb-0 border-b border-gray-100 last:border-0 pb-16 last:pb-0">
                                    <h2 className="text-xl text-black mb-6 group flex items-center gap-2">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-6 text-sm leading-8">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    )
}
