const mongoose = require('mongoose');

const topdown_schema = new mongoose.Schema(
    {
        Directory: {
            type: String,
            required: false
        },
        Description: {
            type: String,
            required: false
        },
        Payload: {
            type: Array,
            required: false
        },
        towerID: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TopDownInfo', topdown_schema, 'topdown');