const Category = require('../models/CategoryProductModel');

const createNewCategoryService = async (categoryData) => {
    try {
        const category = new Category(categoryData);
        await category.save();
        return { status: 'OK', message: 'Category created successfully', data: category };
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateInfoCategoryService = async (categoryId, data) => {
    try {
        const category = await Category.findByIdAndUpdate(categoryId, data, { new: true });
        return { status: 'OK', message: 'Category updated successfully', data: category };
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteInfoCategoryService = async (categoryId) => {
    try {
        await Category.findByIdAndDelete(categoryId);
        return { status: 'OK', message: 'Category deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllInfoCategoryService = async () => {
    try {
        const categories = await Category.find().populate('parentCategory', 'nameCategory');
        return {
            status: 'OK',
            data: categories
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message
        };
    }
}

const deleteManyCategoryService = async (ids) => {
    try {
        await Category.deleteMany({ _id: { $in: ids } });
        return { status: 'OK', message: 'Categories deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCategoryWithParentNameService = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId).populate('parentCategory', 'nameCategory');
        if (!category) {
            return {
                status: 'ERR',
                message: 'Category not found'
            };
        }
        return {
            status: 'OK',
            data: category
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message
        };
    }
};

const getCategoryByNameService = async (nameCategory) => {
    try {
        const category = await Category.findOne({ nameCategory });
        if (!category) {
            return {
                status: 'ERR',
                message: 'Category not found'
            };
        }
        return {
            status: 'OK',
            data: category
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message
        };
    }
};

module.exports = {
    createNewCategoryService,
    updateInfoCategoryService,
    deleteInfoCategoryService,
    getAllInfoCategoryService,
    deleteManyCategoryService,
    getCategoryWithParentNameService,
    getCategoryByNameService
}