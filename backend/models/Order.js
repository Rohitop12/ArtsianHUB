const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            title: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            artisan: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            status: {
                type: String,
                required: true,
                enum: ['Pending', 'Shipped', 'Delivered'],
                default: 'Pending'
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'UPI', 'Cash on Delivery'],
        required: true,
        default: 'Card'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
