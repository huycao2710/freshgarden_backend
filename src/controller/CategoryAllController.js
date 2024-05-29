const CategoryAllService = require('../services/CategoryAllService');

const createNewCategory = async (req, res) => {
    try {
        const { nameCategory, parentCategory } = req.body;
        if (!nameCategory) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        const response = await CategoryAllService.createNewCategoryService({ nameCategory, parentCategory });
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const updateInfoCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = req.body;
        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The categoryId is required'
            });
        }

        const response = await CategoryAllService.updateInfoCategoryService(categoryId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const deleteInfoCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The categoryId is required'
            });
        }

        const response = await CategoryAllService.deleteInfoCategoryService(categoryId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const getAllInfoCategory = async (req, res) => {
    try {
        const response = await CategoryAllService.getAllInfoCategoryService();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const deleteManyCategory = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The ids are required'
            });
        }

        const response = await CategoryAllService.deleteManyCategoryService(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

const getCategoryDetails = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The categoryId is required'
            });
        }

        const response = await CategoryAllService.getCategoryWithParentNameService(categoryId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}



module.exports = {
    createNewCategory,
    updateInfoCategory,
    deleteInfoCategory,
    getAllInfoCategory,
    deleteManyCategory,
    getCategoryDetails
}