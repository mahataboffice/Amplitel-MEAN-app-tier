const mongoose = require('mongoose');

const gallery_schema = new mongoose.Schema(
    {
        directory: {
            type: String,
            required: false
        },
        payload: {
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

module.exports = mongoose.model('GalleryInfo', gallery_schema, 'gallery');