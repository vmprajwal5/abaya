import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { SEO } from "../components/SEO"

export function NotFoundPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-white">
            <SEO
                title="Page Not Found"
                description="The page you are looking for does not exist."
                image="/default-og.jpg"
            />
            <h1 className="text-[10rem] font-extralight text-gray-100 leading-none select-none">404</h1>
            <h2 className="text-2xl font-light text-black uppercase tracking-widest -mt-8 mb-8">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-12 font-light text-sm">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/">
                <Button className="bg-black text-white px-12 py-6 text-xs uppercase tracking-[0.2em] rounded-none hover:bg-gray-800">
                    Back to Homepage
                </Button>
            </Link>
        </div>
    )
}
