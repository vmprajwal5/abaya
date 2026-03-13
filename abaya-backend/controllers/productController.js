const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { keyword, category, sort } = req.query;

        let query = {};

        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'lowest') sortOption = { price: 1 };
        if (sort === 'highest') sortOption = { price: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const products = await Product.find(query).sort(sortOption);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

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

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

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