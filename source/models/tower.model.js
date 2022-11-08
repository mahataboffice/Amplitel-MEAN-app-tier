const mongoose = require('mongoose');

const tower_schema = new mongoose.Schema(
    {
        Tower: {
            type: String,
            required: false
        },
        SiteID: {
            type: String,
            required: false
        },
        Latitude: {
            type: String,
            required: false
        },
        Longitude: {
            type: String,
            required: false
        },
        Status: {
            type: String,
            required: false
        },
        processed: {
            type: String,
            required: false
        },
        Completed: {
            type: String,
            required: false
        },
        Type: {
            type: String,
            required: false
        },
        Monitor: {
            type: String,
            required: false
        },
        Planned: {
            type: String,
            required: false
        },
        Corrosion: {
            type: String,
            required: false
        },
        Emergency: {
            type: String,
            required: false
        },
        Region: {
            type: String,
            required: false
        },
        StructureType: {
            type: String,
            required: false
        },
        CanradVariation: {
            type: String,
            required: false
        },
        isActive : {
            type: Boolean,
            required: false
        },
        year: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TowerInfo', tower_schema , 'towers');