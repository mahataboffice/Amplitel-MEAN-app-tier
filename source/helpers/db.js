const config = require('../config.json');
const mongoose = require('mongoose');
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    RefreshToken: require('../models/refresh_token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}