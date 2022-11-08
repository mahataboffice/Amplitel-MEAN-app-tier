const express = require('express');
const router = express.Router();
const userMod = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { sendPasswordResetMail } = require('../config/mail.service')

const JWT_SECRET = "123456"

router.post('/forgot-password',async(req,res) => {
    const emailID = req.body.email
    try{
        const userData = await userMod.aggregate([{ $match: { "email": emailID} }])
        if(userData.length > 0){
            const userID = userData[0]._id.toString()
            const secret = JWT_SECRET + userData[0].password
            const payload = { userID }
            const token = jwt.sign(payload,secret,{expiresIn: '60s'})
            const link = `http://localhost:9000/api/password/reset-password/${userID}/${token}`
            console.log(link)
            await sendPasswordResetMail(emailID,link,userData[0].displayName)
            res.status(200).send({"isError":false, body: "Reset link successfully send to gmail"})
        }
    }
    catch(e){
        res.status(500).send({"isError":true, message: "Reset link successfully send to gmail"})
    }
})

router.get('/reset-password/:id/:token',async(req,res) => {
    try{
        const userID = req.params.id
        const token = req.params.token
        const userData = await userMod.findById(userID)
        const secret = JWT_SECRET + userData.password
        const verify = jwt.verify(token,secret)
        if(verify){
            res.render("resetPassword",{success: false,expired: false})
        }
    }
    catch(e){
        console.log(e)
        res.render("resetPassword",{success: false,expired: true})
    }
})

router.post('/reset-password/:id/:token',async(req,res) => {
    try{
        const userID = req.params.id
        const token = req.params.token
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const userData = await userMod.findById(userID)
        const secret = JWT_SECRET + userData.password
        const verify = jwt.verify(token,secret)
        if(verify){
            if(password == confirmPassword){
                const update = { 'password': password, 'passwordHash': bcrypt.hashSync(password, 10)}
                const userPasswordUpdate = await userMod.findByIdAndUpdate(userID, update, { new: true });
                res.render("resetPassword",{success: true,expired: false})
                // res.send(userPasswordUpdate)
            }
        }
    }
    catch(e){
        console.log(e)
        res.render("resetPassword",{success: true,expired: true})
    }
})

module.exports = router