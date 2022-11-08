const bcrypt = require('bcryptjs');
const db = require('./db');
const Role = require('./role');

module.exports = createTestUser;

async function createTestUser() {
    // create test user if the db is empty
    if ((await db.User.countDocuments({})) === 0) {
        const user = new db.User({
            displayname: 'Asiq',
            email: 'code2@gmail.com',
            password: '123456',
            passwordHash: bcrypt.hashSync('123456', 10),
            role: Role.superAdmin
        });
        await user.save();
    }
}