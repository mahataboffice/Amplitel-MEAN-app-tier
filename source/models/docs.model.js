const mongoose = require('mongoose');

const docs_schema = new mongoose.Schema(
    {
        file: {
            type: String,
            required: false
        },
        link: {
            type: String,
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

module.exports = mongoose.model('DocsInfo', docs_schema, 'docs');