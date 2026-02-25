const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getArtisanOrders, updateOrderItemStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/artisan', protect, getArtisanOrders);
router.put('/:id/item/:itemId/status', protect, updateOrderItemStatus);

module.exports = router;
