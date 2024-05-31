const express = require("express");
const router = express.Router()
const FeedbackController = require('../controller/FeedbackController');

router.post('/create-feedback', FeedbackController.createNewFeedback)
router.get('/get-allorder', FeedbackController.getAllFeedback)

module.exports = router