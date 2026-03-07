const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User'); // Import User model
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const products = [
    // 20 ABAYAS
    {
        name: 'Midnight Elegance Abaya',
        description: 'A flowing black abaya with intricate embroidery on the sleeves. Perfect for evening wear.',
        price: 1200,
        category: 'special-occasion',
        colors: [{ name: 'Black', hex: '#000000' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 50,
        featured: true,
        images: ['https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        reviewCount: 12
    },
    {
        name: 'Rose Dust Daily Abaya',
        description: 'Lightweight linen abaya in a soft rose dust color. Breathable and comfortable for all-day use.',
        price: 850,
        category: 'everyday',
        colors: [{ name: 'Rose', hex: '#FFC0CB' }, { name: 'Beige', hex: '#F5F5DC' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 100,
        featured: false,
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        reviewCount: 20
    },
    {
        name: 'Royal Blue Velvet Abaya',
        description: 'Luxurious velvet abaya in royal blue, ideal for winter gatherings.',
        price: 1500,
        category: 'special-occasion',
        colors: [{ name: 'Royal Blue', hex: '#4169E1' }],
        sizes: ['M', 'L', 'XL'],
        stock: 30,
        featured: true,
        images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        reviewCount: 8
    },
    {
        name: 'Emerald Green Silk Abaya',
        description: 'Soft silk abaya with a subtle sheen. Features a tie-waist for an adjustable fit.',
        price: 1800,
        category: 'special-occasion',
        colors: [{ name: 'Emerald Green', hex: '#50C878' }],
        sizes: ['S', 'M', 'L'],
        stock: 25,
        featured: true,
        images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800'],
        rating: 5.0,
        reviewCount: 5
    },
    {
        name: 'Classic Navy Open Abaya',
        description: 'Open front style abaya in navy blue. easy to layer over any outfit.',
        price: 950,
        category: 'everyday',
        colors: [{ name: 'Navy', hex: '#000080' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 80,
        featured: false,
        images: ['https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=800'],
        rating: 4.3,
        reviewCount: 15
    },
    {
        name: 'Beige Butterfly Abaya',
        description: 'Wide butterfly cut abaya for maximum coverage and elegance.',
        price: 1100,
        category: 'modest-wear',
        colors: [{ name: 'Beige', hex: '#F5F5DC' }, { name: 'Taupe', hex: '#483C32' }],
        sizes: ['S', 'M', 'L'], // Updated to match enum or just standard sizes
        stock: 60,
        featured: true,
        images: ['https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        reviewCount: 30
    },
    {
        name: 'Grey Linen Casual Abaya',
        description: 'Everyday staple. Grey linen fabric that keeps you cool.',
        price: 750,
        category: 'everyday',
        colors: [{ name: 'Grey', hex: '#808080' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 120,
        featured: false,
        images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb6d?auto=format&fit=crop&q=80&w=800'],
        rating: 4.4,
        reviewCount: 22
    },
    {
        name: 'White Pearl Prayer Abaya',
        description: 'Comfortable cotton blend prayer set with attached scarf.',
        price: 600,
        category: 'modest-wear',
        colors: [{ name: 'White', hex: '#FFFFFF' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 200,
        featured: false,
        images: ['https://images.unsplash.com/photo-1566866110279-b8830b9fa64b?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        reviewCount: 45
    },
    {
        name: 'Maroon Detailed Abaya',
        description: 'Deep maroon abaya with gold piping details along the front.',
        price: 1350,
        category: 'special-occasion',
        colors: [{ name: 'Maroon', hex: '#800000' }],
        sizes: ['M', 'L', 'XL'],
        stock: 40,
        featured: false,
        images: ['https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        reviewCount: 10
    },
    {
        name: 'Olive Green Kimono Abaya',
        description: 'Kimono style sleeves in a trendy olive green shade.',
        price: 1050,
        category: 'everyday',
        colors: [{ name: 'Olive', hex: '#808000' }],
        sizes: ['S', 'M', 'L'],
        stock: 55,
        featured: true,
        images: ['https://images.unsplash.com/photo-1617336141381-49b01c223c91?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        reviewCount: 18
    },
    {
        name: 'Black Chiffon Layered Abaya',
        description: 'Double layered chiffon for a sophisticated, airy look.',
        price: 1400,
        category: 'special-occasion',
        colors: [{ name: 'Black', hex: '#000000' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 35,
        featured: false,
        images: ['https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        reviewCount: 14
    },
    {
        name: 'Terracotta Crepe Abaya',
        description: 'Textured crepe fabric in a warm terracotta tone.',
        price: 980,
        category: 'everyday',
        colors: [{ name: 'Terracotta', hex: '#E2725B' }],
        sizes: ['M', 'L', 'XL'],
        stock: 70,
        featured: false,
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'],
        rating: 4.2,
        reviewCount: 9
    },
    {
        name: 'Teal Embroidered Abaya',
        description: 'Rich teal color with floral embroidery on the hem.',
        price: 1600,
        category: 'special-occasion',
        colors: [{ name: 'Teal', hex: '#008080' }],
        sizes: ['S', 'M', 'L'],
        stock: 20,
        featured: true,
        images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        reviewCount: 7
    },
    {
        name: 'Powder Blue Summer Abaya',
        description: 'Ultra-lightweight fabric perfect for hot summer days.',
        price: 790,
        category: 'everyday',
        colors: [{ name: 'Powder Blue', hex: '#B0E0E6' }],
        sizes: ['S', 'M', 'L'],
        stock: 90,
        featured: false,
        images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800'],
        rating: 4.4,
        reviewCount: 3
    },
    {
        name: 'Charcoal Grey Zipper Abaya',
        description: 'Practical front zipper abaya for nursing mothers or ease of wear.',
        price: 920,
        category: 'everyday',
        colors: [{ name: 'Charcoal', hex: '#36454F' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 65,
        featured: false,
        images: ['https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        reviewCount: 28
    },
    {
        name: 'Golden Beige Bisht Abaya',
        description: 'Traditional bisht cut with gold trimming.',
        price: 2100,
        category: 'special-occasion',
        colors: [{ name: 'Beige', hex: '#F5F5DC' }, { name: 'Gold', hex: '#FFD700' }],
        sizes: ['S', 'M', 'L'], // Adjusted for enum
        stock: 15,
        featured: true,
        images: ['https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=800'],
        rating: 5.0,
        reviewCount: 6
    },
    {
        name: 'Plum Satin Abaya',
        description: 'Glossy satin finish in a deep plum shade.',
        price: 1250,
        category: 'special-occasion',
        colors: [{ name: 'Plum', hex: '#DDA0DD' }],
        sizes: ['S', 'M', 'L'],
        stock: 45,
        featured: false,
        images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb6d?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        reviewCount: 11
    },
    {
        name: 'Denim Style Abaya',
        description: 'Casual denim-look fabric (soft cotton blend) for a modern twist.',
        price: 880,
        category: 'everyday',
        colors: [{ name: 'Blue', hex: '#0000FF' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 85,
        featured: true,
        images: ['https://images.unsplash.com/photo-1566866110279-b8830b9fa64b?auto=format&fit=crop&q=80&w=800'],
        rating: 4.3,
        reviewCount: 16
    },
    {
        name: 'Mint Green Pastel Abaya',
        description: 'Fresh mint green color, adds a pop of brightness to your wardrobe.',
        price: 820,
        category: 'everyday',
        colors: [{ name: 'Mint', hex: '#98FF98' }],
        sizes: ['S', 'M'],
        stock: 60,
        featured: false,
        images: ['https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        reviewCount: 13
    },
    {
        name: 'Black & White Monochrome Abaya',
        description: 'Geometric black and white patterns for a bold statement.',
        price: 1150,
        category: 'everyday',
        colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 40,
        featured: false,
        images: ['https://images.unsplash.com/photo-1617336141381-49b01c223c91?auto=format&fit=crop&q=80&w=800'],
        rating: 4.4,
        reviewCount: 8
    },

    // 10 ACCESSORIES
    {
        name: 'Chiffon Hijab Set - Black',
        description: 'Premium chiffon hijab with matching underscarf.',
        price: 150,
        category: 'accessories',
        colors: [{ name: 'Black', hex: '#000000' }],
        sizes: ['S'], // Using S as placeholder for One Size if enum enforced
        stock: 200,
        featured: true,
        images: ['https://images.unsplash.com/photo-1585728748176-455ac6efac91?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        reviewCount: 200
    },
    {
        name: 'Silk Scarf - Floral Print',
        description: '100% silk scarf with elegant floral prints.',
        price: 350,
        category: 'accessories',
        colors: [{ name: 'Multicolor', hex: '#FF00FF' }],
        sizes: ['S'],
        stock: 50,
        featured: true,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        reviewCount: 45
    },
    {
        name: 'Magnetic Hijab Pins (Set of 4)',
        description: 'Strong snag-free magnetic pins in nude tones.',
        price: 120,
        category: 'accessories',
        colors: [{ name: 'Nude', hex: '#E3BC9A' }, { name: 'Rose Gold', hex: '#B76E79' }],
        sizes: ['S'],
        stock: 500,
        featured: false,
        images: ['https://images.unsplash.com/photo-1616879895208-a5b67484dfce?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        reviewCount: 300
    },
    {
        name: 'Jersey Hijab - Taupe',
        description: 'Stretchy, comfortable jersey material. No pins needed.',
        price: 180,
        category: 'accessories',
        colors: [{ name: 'Taupe', hex: '#483C32' }],
        sizes: ['S'],
        stock: 150,
        featured: false,
        images: ['https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        reviewCount: 80
    },
    {
        name: 'Abaya Belt - Gold Chain',
        description: 'Adjustable gold chain belt to accessorize loose abayas.',
        price: 250,
        category: 'accessories',
        colors: [{ name: 'Gold', hex: '#FFD700' }],
        sizes: ['S'],
        stock: 80,
        featured: false,
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
        rating: 4.4,
        reviewCount: 25
    },
    {
        name: 'Velvet Scrunchie Volumizer',
        description: 'Adds volume under your hijab for the perfect shape.',
        price: 80,
        category: 'accessories',
        colors: [{ name: 'Black', hex: '#000000' }, { name: 'Brown', hex: '#964B00' }],
        sizes: ['S', 'M', 'L'], // Using standard sizes
        stock: 300,
        featured: false,
        images: ['https://images.unsplash.com/photo-1606166325683-e6deb697d301?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        reviewCount: 150
    },
    {
        name: 'Luxury Niqab',
        description: 'Breathable, two-layer niqab with tie back.',
        price: 200,
        category: 'accessories',
        colors: [{ name: 'Black', hex: '#000000' }],
        sizes: ['S'],
        stock: 100,
        featured: false,
        images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb6d?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        reviewCount: 60
    },
    {
        name: 'Embellished Cuffs (Detachable)',
        description: 'Add a touch of sparkle to plain sleeves with these detachable cuffs.',
        price: 190,
        category: 'accessories',
        colors: [{ name: 'Silver', hex: '#C0C0C0' }, { name: 'Gold', hex: '#FFD700' }],
        sizes: ['S'],
        stock: 40,
        featured: false,
        images: ['https://images.unsplash.com/photo-1619154402635-430466b69038?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        reviewCount: 12
    },
    {
        name: 'Cotton Underscarf Tube',
        description: 'Essential bone bonnet to keep hair in place.',
        price: 60,
        category: 'accessories',
        colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Nude', hex: '#E3BC9A' }],
        sizes: ['S'],
        stock: 1000,
        featured: false,
        images: ['https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        reviewCount: 500
    },
    {
        name: 'Handbag Match Set',
        description: 'Small clutch bag matching our "Classic Navy" collection.',
        price: 450,
        category: 'accessories',
        colors: [{ name: 'Navy', hex: '#000080' }],
        sizes: ['S'],
        stock: 25,
        featured: true,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'],
        rating: 4.3,
        reviewCount: 5
    }
];

const users = [
    {
        name: 'Admin User',
        email: 'admin@abaya.com',
        password: 'password123',
        isAdmin: true,
        phone: '1234567890'
    },
    {
        name: 'Aishath N.',
        email: 'aishath@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '9876543210'
    },
    {
        name: 'Mariyam S.',
        email: 'mariyam@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '7778889999'
    },
    {
        name: 'Fatima R.',
        email: 'fatima@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '1112223333'
    },
    {
        name: 'Aminath L.',
        email: 'aminath@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '4445556666'
    },
    {
        name: 'Zoya K.',
        email: 'zoya@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '5556667777'
    }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        await Product.insertMany(products);
        await User.insertMany(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
