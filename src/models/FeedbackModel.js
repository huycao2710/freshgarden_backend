const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200
        },
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200
        },
        phone: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true,
            minlength: 1
        }
    },
    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;