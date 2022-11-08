const admin = require('firebase-admin');

const serviceAccount = require('./telstra-staging-93e9a-firebase-adminsdk-1b2m5-cd545146be.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://telstra-staging-93e9a-default-rtdb.asia-southeast1.firebasedatabase.app'
});

module.exports = admin;