const mongoose = require('mongoose');

const user_schema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        passwordHash: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', user_schema);