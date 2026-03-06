

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border border-gray-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-[1.5px] border-black rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    )
}

export function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner />
        </div>
    )
}
