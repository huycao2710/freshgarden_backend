const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200
        },
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1024
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        phone: { type: Number },
        address: { type: String },
        avatar: { type: String },
        city: { type: String },
        isVerified: {
            type: Boolean,
            default: false
        },
        emailToken: { type: String },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
