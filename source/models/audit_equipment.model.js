const mongoose = require('mongoose');

const audit_equipment_schema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: false
        },
        Leg: {
            type: String,
            required: false
        },
        section: {
            type: String,
            required: false
        },
        sectionIndex: {
            type: String,
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

module.exports = mongoose.model('AuditEquipment', audit_equipment_schema, 'audit_equipment');