const Product = require('../models/Product');

// @desc    Fetch all products with filtering (Category, Price, Search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // 1. Destructure query params from the frontend request
        const { keyword, category, sort } = req.query;

        // 2. Build the database query dynamically
        let query = {};

        // Search functionality (matches name or description)
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } }, // 'i' = case insensitive
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Filter by category if provided
        if (category) {
            query.category = category;
        }

        // 3. Sorting Logic
        let sortOption = {};
        if (sort === 'lowest') sortOption = { price: 1 };
        if (sort === 'highest') sortOption = { price: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        // 4. Execute Query
        const products = await Product.find(query).sort(sortOption);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            image,
            images,
            brand,
            category,
            fabric,
            stock,
            sizes,
            colors,
            isFeatured
        } = req.body;

        const product = new Product({
            name,
            price,
            user: req.user._id,
            image,
            images: images || [],
            brand,
            category,
            fabric,
            stock: stock || 0,
            sizes: sizes || [],
            colors: colors || [],
            isFeatured: isFeatured || false,
            description,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        images,
        brand,
        category,
        fabric,
        stock,
        sizes,
        colors,
        isFeatured
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.fabric = fabric || product.fabric;
        product.stock = stock !== undefined ? stock : product.stock;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};