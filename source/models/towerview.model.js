const mongoose = require('mongoose');

const towerview_schema = new mongoose.Schema(
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

module.exports = mongoose.model('TowerViewInfo', towerview_schema, 'towerview');