const mongoose = require('mongoose');

const amplitel_data_schema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: false
        },
        section: {
            type: String,
            required: false
        },
        Image: {
            type: Array,
            required: false
        },
        Details: {
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

module.exports = mongoose.model('AmplitelData', amplitel_data_schema, 'amplitel_data');