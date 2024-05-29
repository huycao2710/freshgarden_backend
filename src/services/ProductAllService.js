const Product = require("../models/ProductModel")
const Category = require("../models/CategoryProductModel")

const createNewProductService = async (productData) => {
    try {
        const { nameProduct, categoryId } = productData;

        const existingProduct = await Product.findOne({ nameProduct });
        if (existingProduct) {
            return {
                status: 'ERR',
                message: 'The name of the product is already taken'
            };
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return {
                status: 'ERR',
                message: 'Category not found'
            };
        }

        const newProduct = new Product({
            ...productData,
            categoryName: category.nameCategory
        });
        await newProduct.save();

        return {
            status: 'OK',
            message: 'Product created successfully',
            data: newProduct
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message
        };
    }
};

const updateInfoProductService = async (id, newData) => {
    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return {
                status: 'ERR',
                message: 'The product is not defined'
            };
        }

        existingProduct.set(newData);
        await existingProduct.save();

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: existingProduct
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteInfoProductService = () => {

}

const getAllInfoProduct = () => {

}

const getDetailsInfoProduct = () => {

}

const deleteManyProduct = () => {

}

module.exports = {
    createNewProductService,
    updateInfoProductService,
    deleteInfoProductService,
    getAllInfoProduct,
    getDetailsInfoProduct,
    deleteManyProduct
}