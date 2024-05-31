const FeedbackService = require('../services/FeedbackService');

const createNewFeedback = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }

        const response = await FeedbackService.createNewFeedbackService({ name, email, phone, message });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const response = await FeedbackService.getAllFeedbackService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

module.exports = {
    createNewFeedback,
    getAllFeedback
};