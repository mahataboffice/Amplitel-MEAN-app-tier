const mongoose = require('mongoose');

const summary_schema = new mongoose.Schema(
    {
        SiteVerification: {
            type: Object,
            required: false
        },
        SiteApproval: {
            type: Object,
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

module.exports = mongoose.model('SummaryInfo', summary_schema, 'summary');