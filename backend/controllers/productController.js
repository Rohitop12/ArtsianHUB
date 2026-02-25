const Product = require('../models/Product');



// @desc    Get all products (with sort & category filter)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    const { sort, category, keyword } = req.query;

    let query = {};
    if (category) {
        query.category = category;
    }

    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }

    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const products = await Product.find(query).sort(sortOption).populate('artisan', 'name');
    res.json(products);
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('artisan', 'name');
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    const { title, description, price, category, image, gallery } = req.body;

    if (!title || !description || !price || !category || !image) {
        return res.status(400).json({ message: 'Please provide all fields including a main image' });
    }

    const product = await Product.create({
        title,
        description,
        price,
        category,
        image,
        gallery: gallery || [],
        artisan: req.user._id, // NEW: tie to user
    });

    res.status(201).json(product);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    const { title, description, price, category, image, gallery } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artisan?.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    if (image) product.image = image;
    if (gallery) product.gallery = gallery;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.artisan?.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
};

// @desc    Get products by logged in artisan
// @route   GET /api/products/artisan/me
// @access  Private
const getArtisanProducts = async (req, res) => {
    const products = await Product.find({ artisan: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
};

// @desc    Get new arrivals (top 6 newest)
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const products = await Product.find({ createdAt: { $gte: sevenDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('artisan', 'name');
    res.json(products);
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getArtisanProducts, getNewArrivals };
