const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getArtisanProducts, getNewArrivals } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// IMPORTANT: /new-arrivals and /artisan/me must come BEFORE /:id routes
router.get('/new-arrivals', getNewArrivals);
router.get('/artisan/me', protect, getArtisanProducts);

router.route('/')
    .get(getAllProducts)
    .post(protect, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
