var express = require('express')
var router = express.Router()
const towers = require("../models/tower.model")
const auditGeneral = require("../models/audit_general.model")
const ortho = require('../models/orthomap.model')
const towerView = require("../models/towerview.model")
const topDown = require("../models/topdown.model")
const los = require("../models/los.model")
const digitaltwin = require("../models/digitaltwin.model")
const authorize = require('../middleware/authorize.middleware')

router.get('/:year', async(req,res) => {
    try{
        const year = req.params.year
        const towerList = await towers.aggregate([{ $match: { "year": year , "isActive": true} }])
        res.status(200).send({isError: false, body: towerList})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "Cannot fetch towers data"})
    }
})

router.post('/editTower', async(req,res) => {
    try{
        const towerID = req.body.towerID
        const field = req.body.field
        const fieldValue = req.body.fieldValue
        const update = { [field]: fieldValue}
        const towerEditResponse = await towers.findByIdAndUpdate(towerID, update, { new: true });
        res.status(200).send({isError: false, body: towerEditResponse})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "tower edit failed!"})
    }
})

router.post('/deleteTower', async(req,res) => {
    try{
        const towerID = req.body.towerID
        const update = { 'isActive': false}
        const towerDeleteResponse = await towers.findByIdAndUpdate(towerID, update, { new: true });
        res.status(200).send({isError: false, body: towerDeleteResponse})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "tower delete failed!"})
    }
})

router.post('/', async(req,res) => {
    try{    
        const ptowerObj = req.body.towerObj
        const year = req.body.year
        const siteData = req.body.siteData
        const auditGeneralObj = siteData['Audit']['General']
        let towerObj = new towers(ptowerObj)
        towerObj['year'] = year
        towerObj['isActive'] = true
        const towerObjRes = await towerObj.save()
        for(let i = 0;i < auditGeneralObj.length;i++){
            const genObj = auditGeneralObj[i]
            genObj['towerID'] = towerObjRes._id.toString()
            const generalObj = new auditGeneral(genObj)
            await generalObj.save()
        }
        res.status(200).send({isError: false, body: towerObjRes})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "tower add failed!"})
    }
})

router.post('/processedData', async(req,res) => {
    try{
        const towerID = req.body.towerID
        let processedStatus = ""
        const towerViewResponse = await towerView.aggregate([{ $match: { "towerID": towerID } }])
        const topDownResponse = await topDown.aggregate([{ $match: { "towerID": towerID } }])
        const losResponse = await los.aggregate([{ $match: { "towerID": towerID } }])
        if(towerViewResponse.length > 0 || topDownResponse.length > 0 || losResponse.length > 0){
            processedStatus = processedStatus + "T"
        }
        const digitaltwinResponse = await digitaltwin.aggregate([{ $match: { "towerID": towerID } }])
        if(digitaltwinResponse.length > 0 && digitaltwinResponse[0].hasOwnProperty("link")){
            processedStatus = processedStatus + "D"
        }
        const orthoResponse = await ortho.aggregate([{ $match: { "towerID": towerID } }])
        if(orthoResponse.length > 0){
            processedStatus = processedStatus + "O"
        }
        const update = { 'processed': (processedStatus == "") ? "-" : processedStatus}
        const towerEditResponse = await towers.findByIdAndUpdate(towerID, update, { new: true });
        res.status(200).send({isError: false, body: processedStatus})
    }
    catch(e){
        console.log(e.message)  
        res.status(500).send({isError: true, message: "processing status failed!"})
    }
})

module.exports = router