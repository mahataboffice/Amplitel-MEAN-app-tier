const admin = require('../config/firebase-config');
class Middleware {
	async decodeToken(req, res, next) {
		const token = req.headers.authorization;
		try {
			const tokenObj = JSON.parse(token)
			const decodeValue = await admin.auth().verifyIdToken(tokenObj.token);
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.json({ message: 'Un authorize' });
		} catch (e) {
			return res.json({ message: 'Internal Error' });
		}
	}
}

module.exports = new Middleware();