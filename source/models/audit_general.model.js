const mongoose = require('mongoose');

const audit_general_schema = new mongoose.Schema(
    {
        Name: {
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

module.exports = mongoose.model('AuditGeneral', audit_general_schema, 'audit_general');