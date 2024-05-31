const Feedback = require('../models/FeedbackModel');

const createNewFeedbackService = async (feedbackData) => {
    try {
        const newFeedback = await Feedback.create(feedbackData);
        return {
            status: 'OK',
            message: 'Feedback created successfully',
            data: newFeedback
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllFeedbackService = async () => {
    try {
        const allFeedback = await Feedback.find();
        return {
            status: 'OK',
            message: 'Feedback retrieved successfully',
            data: allFeedback
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createNewFeedbackService,
    getAllFeedbackService
};