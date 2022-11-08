const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userService = require('../service/user.service');
const authorize = require('../middleware/authorize.middleware')
const Role = require('../helpers/role');
const validateRequest = require('../middleware/validate-request.middleware');
const bcrypt = require('bcryptjs');
const userMod = require("../models/user.model")

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.get('/', authorize(Role.superAdmin), getAll);
router.get('/:id', authorize(), getById);
router.get('/:id/refresh-tokens', authorize(), getRefreshTokens);


router.post('/',async(req,res) => {
    const action = req.body.action
    try{
        if(action == 'add'){
            const userObj = new userMod(req.body.userObj)
            userObj['passwordHash'] = bcrypt.hashSync(userObj['password'], 10)
            const userObjRes = await userObj.save()
            res.json({ isError: false, body: userObjRes})
        }
        else if(action == 'edit'){
            const uid = req.body.uid
            const field = req.body.field
            const fieldValue = req.body.fieldValue
            const update = { [field]: fieldValue}
            const userEditResponse = await userMod.findByIdAndUpdate(uid, update, { new: true });
            res.json({ isError: false, body: userEditResponse})
        }
        else if(action == 'delete'){
            const uid = req.body.uid
            const userDeleteResponse  = await userMod.deleteOne({ _id: uid});
            res.json({ isError: false, body: userDeleteResponse})
        }
    }
    catch(e){
        res.json({ isError: true, message: `${action} failed!`})
    }
})

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    userService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.superAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json({ isError: false, body: users}))
        .catch(next);
}

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== Role.superAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

function getRefreshTokens(req, res, next) {
    // users can get their own refresh tokens and admins can get any user's refresh tokens
    if (req.params.id !== req.user.id && req.user.role !== Role.superAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getRefreshTokens(req.params.id)
        .then(tokens => tokens ? res.json(tokens) : res.sendStatus(404))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}

module.exports = router