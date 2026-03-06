const productsData = [
    // --- ABAYAS (24 Items) ---
    {
        id: 1,
        name: "Classic Nida Abaya",
        category: "Daily Wear",
        type: "abaya",
        priceMVR: 1200,
        priceUSD: 78,
        image: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=600",
        colors: ["black", "navy"],
        sizes: ["S", "M", "L"],
        fabric: "Nida",
        rating: 4.5,
        date: "2024-01-10"
    },
    {
        id: 2,
        name: "Gold Embroidered Luxe",
        category: "Embroidered",
        type: "abaya",
        priceMVR: 2500,
        priceUSD: 162,
        image: "https://images.unsplash.com/photo-1596464871407-1e5443202957?w=600",
        colors: ["black", "gold"],
        sizes: ["M", "L", "XL"],
        fabric: "Crepe",
        rating: 5.0,
        date: "2024-02-15"
    },
    {
        id: 3,
        name: "Butterfly Chiffon Layer",
        category: "Butterfly Abayas",
        type: "abaya",
        priceMVR: 1800,
        priceUSD: 116,
        image: "https://images.unsplash.com/photo-1585854460596-f3089d4d5462?w=600",
        colors: ["beige", "brown"],
        sizes: ["One Size"],
        fabric: "Chiffon",
        rating: 4.8,
        date: "2024-01-20"
    },
    // ... (For the project, duplicate these objects to reach 24 items, changing IDs and names slightly)
    
    // --- HIJABS (Simulated) ---
    {
        id: 101,
        name: "Premium Jersey Hijab",
        category: "Solid",
        type: "hijab",
        priceMVR: 250,
        priceUSD: 16,
        image: "https://images.unsplash.com/photo-1596464871383-09741d402b8d?w=600",
        colors: ["black", "beige", "white"],
        sizes: ["Standard"],
        fabric: "Cotton",
        rating: 4.9,
        date: "2024-03-01"
    }
];

// Helper to get products by type
function getProductsByType(type) {
    return productsData.filter(p => p.type === type);
}