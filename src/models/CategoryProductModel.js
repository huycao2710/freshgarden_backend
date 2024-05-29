const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    nameCategory: { type: String, required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;