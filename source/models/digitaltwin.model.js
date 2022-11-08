const mongoose = require('mongoose');

const digitaltwin_schema = new mongoose.Schema(
    {
        CAD: {
            type: Map,
            required: false
        },
        Camera: {
            type: Map,
            required: false
        },
        Equipment: {
            type: Array,
            required: false
        },
        OutDoorEquipment: {
            type: Array,
            required: false
        },
        towerid: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('DigitalTwinInfo', digitaltwin_schema, 'digitaltwin');