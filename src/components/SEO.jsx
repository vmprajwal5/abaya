import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function SEO({ title, description, image }) {
    const { pathname } = useLocation()
    const url = `https://abayaclothing.com${pathname}`
    const defaultDescription = "Premium Abaya Clothing Store in Maldives. Discover our exclusive collection of modest fashion, hand-crafted with luxury fabrics."
    const defaultImage = "https://images.unsplash.com/photo-1596464871407-1e5443202957?q=80&w=1200"

    useEffect(() => {
        // Update Title
        document.title = `${title} | Abaya Clothing`

        // Update Meta Tags
        const updateMeta = (name, content) => {
            let element = document.querySelector(`meta[name="${name}"]`)
            if (!element) {
                element = document.createElement("meta")
                element.setAttribute("name", name)
                document.head.appendChild(element)
            }
            element.setAttribute("content", content)
        }

        const updateOg = (property, content) => {
            let element = document.querySelector(`meta[property="${property}"]`)
            if (!element) {
                element = document.createElement("meta")
                element.setAttribute("property", property)
                document.head.appendChild(element)
            }
            element.setAttribute("content", content)
        }

        const desc = description || defaultDescription
        const img = image || defaultImage

        // Standard Meta
        updateMeta("description", desc)

        // Open Graph
        updateOg("og:title", title)
        updateOg("og:description", desc)
        updateOg("og:image", img)
        updateOg("og:url", url)
        updateOg("og:type", "website")

        // Twitter
        updateMeta("twitter:card", "summary_large_image")
        updateMeta("twitter:title", title)
        updateMeta("twitter:description", desc)
        updateMeta("twitter:image", img)

    }, [title, description, image, pathname, url])

    return null
}
