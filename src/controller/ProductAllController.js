const ProductAllService = require('../services/ProductAllService')
const CategoryAllService = require('../services/CategoryAllService')

const createNewProduct = async (req, res) => {
    try {
        const { nameProduct, imageProduct, categoryName, countInStock, price, rating, description, discount } = req.body;
        if (!nameProduct || !imageProduct || !categoryName || !countInStock || !price || !rating || !discount) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        const categoryResponse = await CategoryAllService.getCategoryByNameService(categoryName);
        if (categoryResponse.status === 'ERR') {
            return res.status(400).json({
                status: 'ERR',
                message: 'Category not found'
            });
        }

        const categoryId = categoryResponse.data._id;

        const response = await ProductAllService.createNewProductService({
            nameProduct,
            imageProduct,
            categoryId,
            categoryName,
            countInStock,
            price,
            rating,
            description,
            discount
        });

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const updateInfoProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { nameProduct, imageProduct, categoryName, countInStock, price, rating, description, discount } = req.body;

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            });
        }

        let categoryId;
        if (categoryName) {
            const category = await Category.findOne({ nameCategory: categoryName });
            if (!category) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Category not found'
                });
            }
            categoryId = category._id;
        }

        const response = await ProductAllService.updateInfoProductService(productId, {
            nameProduct,
            imageProduct,
            categoryId,
            categoryName,
            countInStock,
            price,
            rating,
            description,
            discount
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};


const deleteInfoProduct = async (req, res) => {

}

const getAllInfoProduct = async (req, res) => {

}

const getDetailsInfoProduct = async (req, res) => {

}

const deleteManyProduct = async (req, res) => {

}

module.exports = {
    createNewProduct,
    updateInfoProduct,
    deleteInfoProduct,
    getAllInfoProduct,
    getDetailsInfoProduct,
    deleteManyProduct
}