const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        nameProduct: { type: String, required: true, unique: true },
        imageProduct: { type: String, required: true },
        categoryName: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number },
        featured: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;