const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, color, featured, search, sort } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (color) {
            query.colors = { $in: [new RegExp(color, 'i')] };
        }

        if (featured) {
            query.featured = featured === 'true';
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let productsQuery = Product.find(query);

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            productsQuery = productsQuery.sort(sortBy);
        } else {
            productsQuery = productsQuery.sort('-createdAt');
        }

        const products = await productsQuery;

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            images,
            colors,
            sizes,
            stock,
            featured
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.images = images || product.images;
            product.colors = colors || product.colors;
            product.sizes = sizes || product.sizes;
            product.stock = stock !== undefined ? stock : product.stock;
            product.featured = featured !== undefined ? featured : product.featured;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
