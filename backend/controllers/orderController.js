const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        buyer: req.user._id,
        orderItems: orderItems.map((item) => ({
            ...item,
            product: item._id,
            status: 'Pending' // Explicitly set starting status
        })),
        shippingAddress,
        totalPrice,
        paymentMethod: paymentMethod || 'Card'
    });

    const createdOrder = await order.save();

    // Notify Artisans
    try {
        const artisanIds = [...new Set(orderItems.map(item => {
            return typeof item.artisan === 'object' ? item.artisan._id.toString() : item.artisan.toString();
        }))];

        const notifications = artisanIds.map(artisanId => ({
            user: artisanId,
            message: `You have received a new order with ${orderItems.filter(i => (typeof i.artisan === 'object' ? i.artisan._id.toString() : i.artisan.toString()) === artisanId.toString()).length} items.`,
            type: 'new_order',
            relatedOrder: createdOrder._id
        }));

        await Notification.insertMany(notifications);
    } catch (err) {
        console.error('Failed to send artisan notifications:', err);
    }

    res.status(201).json(createdOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get orders containing items by logged-in artisan
// @route   GET /api/orders/artisan
// @access  Private (Artisan only)
const getArtisanOrders = async (req, res) => {
    // We only want to return orders where the orderItems array has at least one item belonging to this artisan
    const orders = await Order.find({ 'orderItems.artisan': req.user._id })
        .populate('buyer', 'name email')
        .sort({ createdAt: -1 });

    // For privacy, we could filter out other artisans' items here, 
    // but the frontend can just filter them out for display
    res.json(orders);
};

// @desc    Update order item status
// @route   PUT /api/orders/:id/item/:itemId/status
// @access  Private (Artisan only)
const updateOrderItemStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    // Find the specific item inside the order
    const item = order.orderItems.id(req.params.itemId);

    if (!item) {
        return res.status(404).json({ message: 'Item not found in order' });
    }

    // Ensure the logged in user is actually the artisan of this item
    if (item.artisan.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this item' });
    }

    const { status } = req.body;
    if (['Pending', 'Shipped', 'Delivered'].includes(status)) {
        item.status = status;
        await order.save();

        // Notify Buyer
        try {
            await Notification.create({
                user: order.buyer,
                message: `The status of your item "${item.title}" has been updated to ${status}.`,
                type: 'order_status_update',
                relatedOrder: order._id
            });
        } catch (err) {
            console.error('Failed to notify buyer:', err);
        }

        res.json({ message: 'Status updated', order });
    } else {
        res.status(400).json({ message: 'Invalid status' });
    }
};

module.exports = { createOrder, getMyOrders, getArtisanOrders, updateOrderItemStatus };
