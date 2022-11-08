const mongoose = require('mongoose');

const orthomap_schema = new mongoose.Schema(
    {
        latitude1: {
            type: String,
            required: false
        },
        latitude2: {
            type: String,
            required: false
        },
        longitude1: {
            type: String,
            required: false
        },
        longitude2: {
            type: String,
            required: false
        },
        zoom: {
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

module.exports = mongoose.model('OrthoMapInfo', orthomap_schema, 'orthomap');