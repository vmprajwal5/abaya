export const sampleProducts = [
    {
        id: '1',
        name: 'Luxury Embroidered Abaya - Black',
        slug: 'luxury-embroidered-abaya-black',
        sku: 'AB-LUX-BLK-001',
        description: 'Elegant black abaya with intricate gold embroidery. Perfect for special occasions and evening events. Made from premium Nida fabric for ultimate comfort and sophistication.',
        shortDescription: 'Elegant black abaya with gold embroidery',
        category: 'abayas',
        subcategory: 'party-wear',
        prices: {
            mvr: 1999,
            usd: 130,
            originalMvr: 2499,
            originalUsd: 162,
            discount: 20
        },
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            {
                name: 'Black',
                hexCode: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
                    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'
                ]
            },
            {
                name: 'Navy Blue',
                hexCode: '#000080',
                images: [
                    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'
                ]
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
        images: [
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'
        ],
        stock: 25,
        fabric: 'Nida',
        featured: true,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['luxury', 'embroidered', 'party-wear', 'elegant'],
        reviews: {
            average: 4.8,
            count: 24
        }
    },
    {
        id: '2',
        name: 'Daily Wear Abaya - Charcoal Gray',
        slug: 'daily-wear-abaya-charcoal',
        sku: 'AB-DLY-GRY-002',
        description: 'Comfortable daily wear abaya in charcoal gray. Simple, elegant design perfect for everyday use. Breathable fabric for all-day comfort.',
        shortDescription: 'Comfortable charcoal gray daily abaya',
        category: 'abayas',
        subcategory: 'daily-wear',
        prices: {
            mvr: 899,
            usd: 58
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Charcoal Gray',
                hexCode: '#36454F',
                images: ['https://images.unsplash.com/photo-1589810635657-84f2c2c9c0ad?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1589810635657-84f2c2c9c0ad?w=500',
        images: ['https://images.unsplash.com/photo-1589810635657-84f2c2c9c0ad?w=500'],
        stock: 50,
        fabric: 'Crepe',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['daily-wear', 'comfortable', 'simple'],
        reviews: {
            average: 4.6,
            count: 18
        }
    },
    {
        id: '3',
        name: 'Butterfly Abaya - Burgundy',
        slug: 'butterfly-abaya-burgundy',
        sku: 'AB-BTF-BUR-003',
        description: 'Stunning butterfly style abaya in rich burgundy color. Features elegant sleeves and flowing design. Perfect for special occasions.',
        shortDescription: 'Burgundy butterfly style abaya',
        category: 'abayas',
        subcategory: 'party-wear',
        prices: {
            mvr: 1599,
            usd: 104
        },
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: [
            {
                name: 'Burgundy',
                hexCode: '#800020',
                images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500']
            },
            {
                name: 'Emerald Green',
                hexCode: '#50C878',
                images: ['https://images.unsplash.com/photo-1544957992-20514f595d6f?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500',
        images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500'],
        stock: 15,
        fabric: 'Chiffon',
        featured: true,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['butterfly', 'elegant', 'party'],
        reviews: {
            average: 4.9,
            count: 12
        }
    },
    {
        id: '4',
        name: 'Bridal White Abaya',
        slug: 'bridal-white-abaya',
        sku: 'AB-BRD-WHT-004',
        description: 'Exquisite white abaya designed for brides. Features delicate lace details and pearl embellishments.',
        shortDescription: 'White bridal abaya with lace',
        category: 'abayas',
        subcategory: 'bridal',
        prices: {
            mvr: 3500,
            usd: 227
        },
        sizes: ['S', 'M', 'L'],
        colors: [
            {
                name: 'White',
                hexCode: '#FFFFFF',
                images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500',
        images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500'],
        stock: 5,
        fabric: 'Silk',
        featured: true,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['bridal', 'white', 'luxury'],
        reviews: {
            average: 5.0,
            count: 8
        }
    },
    {
        id: '5',
        name: 'Casual Denim Abaya',
        slug: 'casual-denim-abaya',
        sku: 'AB-CAS-DEN-005',
        description: 'Modern denim abaya for a chic casual look. Durable and stylish, perfect for university or work.',
        shortDescription: 'Modern denim abaya',
        category: 'abayas',
        subcategory: 'casual',
        prices: {
            mvr: 1200,
            usd: 78
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Denim Blue',
                hexCode: '#1560BD',
                images: ['https://images.unsplash.com/photo-1591369048301-80e075dc2d78?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1591369048301-80e075dc2d78?w=500',
        images: ['https://images.unsplash.com/photo-1591369048301-80e075dc2d78?w=500'],
        stock: 40,
        fabric: 'Denim',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['casual', 'denim', 'modern'],
        reviews: {
            average: 4.5,
            count: 15
        }
    },
    {
        id: '6',
        name: 'Classic Black Open Abaya',
        slug: 'classic-black-open-abaya',
        sku: 'AB-CLS-BLK-006',
        description: 'Timeless open front abaya in black. Can be styled with any outfit. A wardrobe essential.',
        shortDescription: 'Classic black open front abaya',
        category: 'abayas',
        subcategory: 'open-abaya',
        prices: {
            mvr: 1100,
            usd: 71
        },
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            {
                name: 'Black',
                hexCode: '#000000',
                images: ['https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500',
        images: ['https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500'],
        stock: 60,
        fabric: 'Nada',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['classic', 'open', 'black'],
        reviews: {
            average: 4.7,
            count: 50
        }
    },
    {
        id: '7',
        name: 'Premium Silk Hijab - Rose',
        slug: 'premium-silk-hijab-rose',
        sku: 'HJ-SLK-ROS-007',
        description: 'Soft and shiny silk hijab in a beautiful rose shade. Adds a touch of luxury to any outfit.',
        shortDescription: 'Rose silk hijab',
        category: 'hijabs',
        subcategory: 'premium',
        prices: {
            mvr: 350,
            usd: 23
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'Rose',
                hexCode: '#FF007F',
                images: ['https://images.unsplash.com/photo-1585728748176-455ac5eed962?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1585728748176-455ac5eed962?w=500',
        images: ['https://images.unsplash.com/photo-1585728748176-455ac5eed962?w=500'],
        stock: 100,
        fabric: 'Silk',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['hijab', 'silk', 'premium'],
        reviews: {
            average: 4.8,
            count: 40
        }
    },
    {
        id: '8',
        name: 'Chiffon Hijab Selection',
        slug: 'chiffon-hijab-selection',
        sku: 'HJ-CHF-SEL-008',
        description: 'Lightweight chiffon hijabs in various colors. Essential for daily wear.',
        shortDescription: 'Daily chiffon hijabs',
        category: 'hijabs',
        subcategory: 'daily',
        prices: {
            mvr: 150,
            usd: 10
        },
        sizes: ['One Size'],
        colors: [
            { name: 'Beige', hexCode: '#F5F5DC', images: ['https://images.unsplash.com/photo-1621332856402-9904221183b0?w=500'] },
            { name: 'Black', hexCode: '#000000', images: ['https://images.unsplash.com/photo-1621332856402-9904221183b0?w=500'] },
            { name: 'White', hexCode: '#FFFFFF', images: ['https://images.unsplash.com/photo-1621332856402-9904221183b0?w=500'] }
        ],
        mainImage: 'https://images.unsplash.com/photo-1621332856402-9904221183b0?w=500',
        images: ['https://images.unsplash.com/photo-1621332856402-9904221183b0?w=500'],
        stock: 200,
        fabric: 'Chiffon',
        featured: false,
        newArrival: true,
        bestseller: true,
        status: 'active',
        tags: ['hijab', 'chiffon', 'daily'],
        reviews: {
            average: 4.6,
            count: 85
        }
    },
    {
        id: '9',
        name: 'Printed Kimono Abaya',
        slug: 'printed-kimono-abaya',
        sku: 'AB-KIM-PRT-009',
        description: 'Stylish kimono style abaya with unique prints. Great for layering over simple outfits.',
        shortDescription: 'Printed kimono abaya',
        category: 'abayas',
        subcategory: 'kimono',
        prices: {
            mvr: 1450,
            usd: 94
        },
        sizes: ['M', 'L', 'XL'],
        colors: [
            {
                name: 'Mixed Print',
                hexCode: '#808080',
                images: ['https://images.unsplash.com/photo-1545959965-0b043187c473?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1545959965-0b043187c473?w=500',
        images: ['https://images.unsplash.com/photo-1545959965-0b043187c473?w=500'],
        stock: 20,
        fabric: 'Viscose',
        featured: true,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['kimono', 'printed', 'stylish'],
        reviews: {
            average: 4.4,
            count: 10
        }
    },
    {
        id: '10',
        name: 'Velvet Winter Abaya',
        slug: 'velvet-winter-abaya',
        sku: 'AB-VEL-WIN-010',
        description: 'Heavy velvet abaya designed for colder weather. Keeps you warm while looking elegant.',
        shortDescription: 'Warm velvet abaya',
        category: 'abayas',
        subcategory: 'winter',
        prices: {
            mvr: 2200,
            usd: 142
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Deep Purple',
                hexCode: '#301934',
                images: ['https://images.unsplash.com/photo-1550614000-4b9519e0050a?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1550614000-4b9519e0050a?w=500',
        images: ['https://images.unsplash.com/photo-1550614000-4b9519e0050a?w=500'],
        stock: 15,
        fabric: 'Velvet',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['winter', 'velvet', 'warm'],
        reviews: {
            average: 4.9,
            count: 5
        }
    },
    {
        id: '11',
        name: 'Sporty Activewear Abaya',
        slug: 'sporty-activewear-abaya',
        sku: 'AB-SPT-ACT-011',
        description: 'Designed for the active woman. Breathable and flexible fabric suitable for jogging or gym.',
        shortDescription: 'Activewear sporty abaya',
        category: 'abayas',
        subcategory: 'sport',
        prices: {
            mvr: 1100,
            usd: 71
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Grey',
                hexCode: '#808080',
                images: ['https://images.unsplash.com/photo-1520632514582-723145d25287?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1520632514582-723145d25287?w=500',
        images: ['https://images.unsplash.com/photo-1520632514582-723145d25287?w=500'],
        stock: 30,
        fabric: 'Jersey',
        featured: false,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['sport', 'active', 'comfortable'],
        reviews: {
            average: 4.5,
            count: 14
        }
    },
    {
        id: '12',
        name: 'Gold Plated Abaya Pin',
        slug: 'gold-plated-abaya-pin',
        sku: 'AC-PIN-GLD-012',
        description: 'Beautiful gold plated pin to secure your abaya or hijab. Minimalist design.',
        shortDescription: 'Gold plated pin',
        category: 'accessories',
        subcategory: 'pins',
        prices: {
            mvr: 150,
            usd: 10
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'Gold',
                hexCode: '#FFD700',
                images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'],
        stock: 100,
        fabric: 'Metal',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['accessory', 'pin', 'gold'],
        reviews: {
            average: 4.7,
            count: 32
        }
    },
    {
        id: '13',
        name: 'Two-Piece Prayer Set',
        slug: 'two-piece-prayer-set',
        sku: 'AB-PRY-SET-013',
        description: 'Comfortable two-piece prayer set including skirt and khimar. Soft cotton material.',
        shortDescription: 'Cotton prayer set',
        category: 'abayas',
        subcategory: 'prayer',
        prices: {
            mvr: 650,
            usd: 42
        },
        sizes: ['Free Size'],
        colors: [
            {
                name: 'White Floral',
                hexCode: '#FFF',
                images: ['https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=500',
        images: ['https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=500'],
        stock: 45,
        fabric: 'Cotton',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['prayer', 'cotton', 'set'],
        reviews: {
            average: 4.8,
            count: 60
        }
    },
    {
        id: '14',
        name: 'Embellished Evening Abaya',
        slug: 'embellished-evening-abaya',
        sku: 'AB-EVE-EMB-014',
        description: 'Heavily embellished evening abaya with sequins and beads. Stand out at any party.',
        shortDescription: 'Sequined evening abaya',
        category: 'abayas',
        subcategory: 'evening',
        prices: {
            mvr: 2800,
            usd: 181
        },
        sizes: ['M', 'L', 'XL'],
        colors: [
            {
                name: 'Midnight Blue',
                hexCode: '#191970',
                images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500',
        images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500'],
        stock: 10,
        fabric: 'Georgette',
        featured: true,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['evening', 'party', 'sparkle'],
        reviews: {
            average: 5.0,
            count: 6
        }
    },
    {
        id: '15',
        name: 'Lightweight Summer Abaya',
        slug: 'lightweight-summer-abaya',
        sku: 'AB-SUM-LGT-015',
        description: 'Cool and airy abaya for the hot summer days. Pastel colors available.',
        shortDescription: 'Pastel summer abaya',
        category: 'abayas',
        subcategory: 'summer',
        prices: {
            mvr: 950,
            usd: 62
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Mint Green',
                hexCode: '#98FF98',
                images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500']
            },
            {
                name: 'Pale Pink',
                hexCode: '#FFD1DC',
                images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'] // Placeholder
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
        images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'],
        stock: 35,
        fabric: 'Linen',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['summer', 'light', 'pastel'],
        reviews: {
            average: 4.6,
            count: 22
        }
    },
    {
        id: '16',
        name: 'Instant Hijab - Black',
        slug: 'instant-hijab-black',
        sku: 'HJ-INS-BLK-016',
        description: 'Easy to wear instant hijab. No pins required. Perfect for busy mornings.',
        shortDescription: 'Black instant hijab',
        category: 'hijabs',
        subcategory: 'instant',
        prices: {
            mvr: 250,
            usd: 16
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'Black',
                hexCode: '#000000',
                images: ['https://images.unsplash.com/photo-1583391733975-f773410526e0?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1583391733975-f773410526e0?w=500',
        images: ['https://images.unsplash.com/photo-1583391733975-f773410526e0?w=500'],
        stock: 80,
        fabric: 'Jersey',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['hijab', 'instant', 'easy'],
        reviews: {
            average: 4.5,
            count: 45
        }
    },
    {
        id: '17',
        name: 'Hooded Abaya',
        slug: 'hooded-abaya',
        sku: 'AB-HOD-GRN-017',
        description: 'Unique abaya with a hood for extra coverage and style. Urban and modest.',
        shortDescription: 'Hooded urban abaya',
        category: 'abayas',
        subcategory: 'urban',
        prices: {
            mvr: 1300,
            usd: 84
        },
        sizes: ['S', 'M', 'L'],
        colors: [
            {
                name: 'Olive Green',
                hexCode: '#808000',
                images: ['https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=500',
        images: ['https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=500'],
        stock: 20,
        fabric: 'Cotton Blend',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['hooded', 'urban', 'modern'],
        reviews: {
            average: 4.7,
            count: 18
        }
    },
    {
        id: '18',
        name: 'Lace Trimmed Abaya',
        slug: 'lace-trimmed-abaya',
        sku: 'AB-LCE-BEI-018',
        description: 'Beige abaya with delicate white lace trimming on sleeves and hem. Feminin and soft.',
        shortDescription: 'Beige lace trim abaya',
        category: 'abayas',
        subcategory: 'occasion',
        prices: {
            mvr: 1750,
            usd: 113
        },
        sizes: ['M', 'L', 'XL'],
        colors: [
            {
                name: 'Beige',
                hexCode: '#F5F5DC',
                images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500',
        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500'],
        stock: 25,
        fabric: 'Nida',
        featured: false,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['lace', 'classic', 'occasion'],
        reviews: {
            average: 4.8,
            count: 12
        }
    },
    {
        id: '19',
        name: 'Undercap Bone',
        slug: 'undercap-bone',
        sku: 'AC-CAP-BLK-019',
        description: 'Cotton tube undercap to keep your hijab in place.',
        shortDescription: 'Cotton undercap',
        category: 'accessories',
        subcategory: 'undercaps',
        prices: {
            mvr: 50,
            usd: 3.25
        },
        sizes: ['One Size'],
        colors: [
            { name: 'Black', hexCode: '#000', images: ['https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=500'] },
            { name: 'White', hexCode: '#FFF', images: ['https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=500'] }
        ],
        mainImage: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=500',
        images: ['https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=500'],
        stock: 200,
        fabric: 'Cotton',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['accessory', 'basic', 'essential'],
        reviews: {
            average: 4.5,
            count: 150
        }
    },
    {
        id: '20',
        name: 'Batwing Abaya',
        slug: 'batwing-abaya',
        sku: 'AB-BAT-GRY-020',
        description: 'Loose fitting batwing abaya for maximum coverage and comfort.',
        shortDescription: 'Grey batwing abaya',
        category: 'abayas',
        subcategory: 'loose',
        prices: {
            mvr: 1050,
            usd: 68
        },
        sizes: ['Free Size'],
        colors: [
            {
                name: 'Light Grey',
                hexCode: '#D3D3D3',
                images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00f4b7?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1614707267537-b85aaf00f4b7?w=500',
        images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00f4b7?w=500'],
        stock: 40,
        fabric: 'Jersey',
        featured: false,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['batwing', 'loose', 'modest'],
        reviews: {
            average: 4.6,
            count: 28
        }
    },
    {
        id: '21',
        name: 'Eid Special Collection Abaya',
        slug: 'eid-special-collection-abaya',
        sku: 'AB-EID-GLD-021',
        description: 'Part of our exclusive Eid collection. Rich fabric with gold hues.',
        shortDescription: 'Gold Eid Abaya',
        category: 'abayas',
        subcategory: 'eid',
        prices: {
            mvr: 3000,
            usd: 194
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            {
                name: 'Gold',
                hexCode: '#D4AF37',
                images: ['https://images.unsplash.com/photo-1582234032734-d2e825488172?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1582234032734-d2e825488172?w=500',
        images: ['https://images.unsplash.com/photo-1582234032734-d2e825488172?w=500'],
        stock: 12,
        fabric: 'Silk Satin',
        featured: true,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['eid', 'special', 'luxury'],
        reviews: {
            average: 5.0,
            count: 4
        }
    },
    {
        id: '22',
        name: 'Simple Prayer Mat',
        slug: 'simple-prayer-mat',
        sku: 'AC-MAT-BLU-022',
        description: 'Soft padded prayer mat. Simple design to avoid distractions.',
        shortDescription: 'Blue prayer mat',
        category: 'accessories',
        subcategory: 'mats',
        prices: {
            mvr: 450,
            usd: 29
        },
        sizes: ['Standard'],
        colors: [
            {
                name: 'Navy',
                hexCode: '#000080',
                images: ['https://images.unsplash.com/photo-1628151011864-83e87747e4c9?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1628151011864-83e87747e4c9?w=500',
        images: ['https://images.unsplash.com/photo-1628151011864-83e87747e4c9?w=500'],
        stock: 50,
        fabric: 'Velvet',
        featured: false,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['accessory', 'prayer', 'mat'],
        reviews: {
            average: 4.8,
            count: 10
        }
    },
    {
        id: '23',
        name: 'Ruffled Sleeve Abaya',
        slug: 'ruffled-sleeve-abaya',
        sku: 'AB-RUF-PNK-023',
        description: 'Cute and playful abaya with ruffled sleeves.',
        shortDescription: 'Pink ruffled sleeve abaya',
        category: 'abayas',
        subcategory: 'casual',
        prices: {
            mvr: 1150,
            usd: 74
        },
        sizes: ['S', 'M', 'L'],
        colors: [
            {
                name: 'Dusty Pink',
                hexCode: '#C48793',
                images: ['https://images.unsplash.com/photo-1596706913401-44709d30005a?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1596706913401-44709d30005a?w=500',
        images: ['https://images.unsplash.com/photo-1596706913401-44709d30005a?w=500'],
        stock: 30,
        fabric: 'Crepe',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['ruffle', 'cute', 'casual'],
        reviews: {
            average: 4.5,
            count: 8
        }
    },
    {
        id: '24',
        name: 'Belted Trench Abaya',
        slug: 'belted-trench-abaya',
        sku: 'AB-TRN-BEI-024',
        description: 'Structured trench coat style abaya with belt.',
        shortDescription: 'Beige trench abaya',
        category: 'abayas',
        subcategory: 'coat',
        prices: {
            mvr: 1850,
            usd: 120
        },
        sizes: ['M', 'L', 'XL'],
        colors: [
            {
                name: 'Camel',
                hexCode: '#C19A6B',
                images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'],
        stock: 18,
        fabric: 'Cotton Twill',
        featured: true,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['trench', 'structured', 'work'],
        reviews: {
            average: 4.7,
            count: 14
        }
    },
    {
        id: '25',
        name: 'Pashmina Shawl',
        slug: 'pashmina-shawl',
        sku: 'HJ-PASH-BRN-025',
        description: 'Warm pashmina shawl for cool evenings.',
        shortDescription: 'Brown pashmina shawl',
        category: 'hijabs',
        subcategory: 'shawl',
        prices: {
            mvr: 400,
            usd: 26
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'Brown',
                hexCode: '#964B00',
                images: ['https://images.unsplash.com/photo-1601648764658-095d9cc46513?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1601648764658-095d9cc46513?w=500',
        images: ['https://images.unsplash.com/photo-1601648764658-095d9cc46513?w=500'],
        stock: 60,
        fabric: 'Wool Blend',
        featured: false,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['shawl', 'warm', 'winter'],
        reviews: {
            average: 4.6,
            count: 20
        }
    },
    {
        id: '26',
        name: 'Niqab Set',
        slug: 'niqab-set',
        sku: 'AC-NQ-BLK-026',
        description: 'Breathable niqab with tying cords.',
        shortDescription: 'Black niqab',
        category: 'accessories',
        subcategory: 'niqab',
        prices: {
            mvr: 200,
            usd: 13
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'Black',
                hexCode: '#000',
                images: ['https://images.unsplash.com/photo-1630953835613-207d58a8a923?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1630953835613-207d58a8a923?w=500',
        images: ['https://images.unsplash.com/photo-1630953835613-207d58a8a923?w=500'],
        stock: 100,
        fabric: 'Chiffon',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['niqab', 'modest', 'face-cover'],
        reviews: {
            average: 4.9,
            count: 35
        }
    },
    {
        id: '27',
        name: 'Patterned Kaftan',
        slug: 'patterned-kaftan',
        sku: 'AB-KAF-PAT-027',
        description: 'Free flowing patterned kaftan. Very comfortable.',
        shortDescription: 'Patterned kaftan',
        category: 'abayas',
        subcategory: 'kaftan',
        prices: {
            mvr: 1350,
            usd: 87
        },
        sizes: ['Free Size'],
        colors: [
            {
                name: 'Abstract',
                hexCode: '#800080',
                images: ['https://images.unsplash.com/photo-1549480396-8561d33cbdf8?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1549480396-8561d33cbdf8?w=500',
        images: ['https://images.unsplash.com/photo-1549480396-8561d33cbdf8?w=500'],
        stock: 30,
        fabric: 'Silk',
        featured: true,
        newArrival: false,
        bestseller: false,
        status: 'active',
        tags: ['kaftan', 'pattern', 'loose'],
        reviews: {
            average: 4.7,
            count: 9
        }
    },
    {
        id: '28',
        name: 'Classic White Hijab',
        slug: 'classic-white-hijab',
        sku: 'HJ-CLS-WHT-028',
        description: 'Pure white hijab, essential for many occasions.',
        shortDescription: 'White classic hijab',
        category: 'hijabs',
        subcategory: 'basic',
        prices: {
            mvr: 180,
            usd: 12
        },
        sizes: ['One Size'],
        colors: [
            {
                name: 'White',
                hexCode: '#FFFFFF',
                images: ['https://images.unsplash.com/photo-1605658661601-527a20c3a2a0?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1605658661601-527a20c3a2a0?w=500',
        images: ['https://images.unsplash.com/photo-1605658661601-527a20c3a2a0?w=500'],
        stock: 150,
        fabric: 'Georgette',
        featured: false,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['basic', 'white', 'essential'],
        reviews: {
            average: 4.8,
            count: 65
        }
    },
    {
        id: '29',
        name: 'Layered Abaya',
        slug: 'layered-abaya',
        sku: 'AB-LAY-GRY-029',
        description: 'Abaya with layered fabric design for a textured look.',
        shortDescription: 'Grey layered abaya',
        category: 'abayas',
        subcategory: 'modern',
        prices: {
            mvr: 1600,
            usd: 103
        },
        sizes: ['M', 'L'],
        colors: [
            {
                name: 'Dark Grey',
                hexCode: '#A9A9A9',
                images: ['https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500',
        images: ['https://images.unsplash.com/photo-1563814041005-01e40fb87b7a?w=500'],
        stock: 22,
        fabric: 'Chiffon',
        featured: false,
        newArrival: true,
        bestseller: false,
        status: 'active',
        tags: ['layer', 'modern', 'unique'],
        reviews: {
            average: 4.5,
            count: 7
        }
    },
    {
        id: '30',
        name: 'Gift Set Box',
        slug: 'gift-set-box',
        sku: 'AC-GFT-SET-030',
        description: 'Perfect gift set containing a hijab, pins, and underscarf.',
        shortDescription: 'Hijab gift set',
        category: 'accessories',
        subcategory: 'gifts',
        prices: {
            mvr: 750,
            usd: 48
        },
        sizes: ['Standard'],
        colors: [
            {
                name: 'Assorted',
                hexCode: '#FFD700',
                images: ['https://images.unsplash.com/photo-1602699252380-60636d1ba525?w=500']
            }
        ],
        mainImage: 'https://images.unsplash.com/photo-1602699252380-60636d1ba525?w=500',
        images: ['https://images.unsplash.com/photo-1602699252380-60636d1ba525?w=500'],
        stock: 15,
        fabric: 'Mixed',
        featured: true,
        newArrival: false,
        bestseller: true,
        status: 'active',
        tags: ['gift', 'set', 'special'],
        reviews: {
            average: 5.0,
            count: 20
        }
    }
];
