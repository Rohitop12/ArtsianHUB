const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Pottery', 'Jewelry', 'Textiles', 'Woodwork', 'Glasswork', 'Leather'],
        },
        image: {
            type: String,
            default: '',
        },
        gallery: [
            {
                type: String,
            }
        ],
        artisan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // false so existing seed products don't break
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
