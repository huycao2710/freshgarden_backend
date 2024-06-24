const ProductAllService = require('../services/ProductAllService')

const createNewProduct = async (req, res) => {
    try {
        const { nameProduct, imageProduct, categoryName, countInStock, price, rating, description, discount, featured, available } = req.body;
        if (!nameProduct || !imageProduct || !categoryName || !countInStock || !price || !rating || !description || !discount) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        const response = await ProductAllService.createNewProductService({
            nameProduct,
            imageProduct,
            categoryName,
            countInStock,
            price,
            rating,
            description,
            discount,
            featured,
            available
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
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }

        const response = await ProductAllService.updateInfoProductService(productId, data);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};


const deleteInfoProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductAllService.deleteInfoProductService(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllInfoProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductAllService.getAllInfoProductService(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsInfoProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductAllService.getDetailsInfoProductService(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyProduct = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await ProductAllService.deleteManyProductService(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const response = await ProductAllService.getAllCategoryService()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { limit, page, sort, filter } = req.query
        if (!categoryName) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Category name is required'
            });
        }

        const response = await ProductAllService.getProductsByCategoryService(categoryName, Number(limit) || null, Number(page) || 0);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await ProductAllService.getFeaturedProductsService();
        return res.status(200).json(featuredProducts);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

module.exports = {
    createNewProduct,
    updateInfoProduct,
    deleteInfoProduct,
    getAllInfoProduct,
    getDetailsInfoProduct,
    deleteManyProduct,
    getAllCategory,
    getProductsByCategory,
    getFeaturedProducts
}