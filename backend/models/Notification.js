const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: ['new_order', 'order_status_update', 'system'],
        default: 'system',
    },
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
