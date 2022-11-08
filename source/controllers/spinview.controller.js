var express = require('express')
var router = express.Router()
const towerView = require("../models/towerview.model")
const topDown = require("../models/topdown.model")
const los = require("../models/los.model")

router.get('/towerview', async(req,res) => {
    try{
        const towerID = req.query.towerID
        const towerViewObj = await towerView.aggregate([{ $match: { "towerID": towerID } }])
        res.json({ isError: false, body: towerViewObj})
    }
    catch(e){
        console.log(e.message)
        res.json({ isError: true, message: "Cannot fetch towerview data" })
    }
})

router.get('/topdown', async(req,res) => {
    try{
        const towerID = req.query.towerID
        const topDownObj = await topDown.aggregate([{ $match: { "towerID": towerID } }])
        res.json({ isError: false, body: topDownObj})
    }
    catch(e){
        console.log(e.message)
        res.json({ isError: true, message: "Cannot fetch topdown data" })
    }
})

router.get('/los', async(req,res) => {
    try{
        const towerID = req.query.towerID
        const losObj = await los.aggregate([{ $match: { "towerID": towerID } }])
        res.json({ isError: false, body: losObj})
    }
    catch(e){
        console.log(e.message)
        res.json({ isError: true, message: "Cannot fetch los data" })
    }
})

router.post('/towerview', async(req,res) => {
    try{
        const towerViewResponse = req.body
        const towerViewPayload = towerViewResponse['payload']
        const towerID = towerViewResponse['towerID']
        const towerViewObj = await towerView.aggregate([{ $match: { "towerID": towerID } }])
        if(!towerViewObj.length == 0){
            await towerView.deleteMany({"towerID": towerID})
        }
        for(let i = 0;i < towerViewPayload.length;i++){
            const towerViewObject = new towerView({'Description': towerViewPayload[i]['Description'],  'Directory': towerViewPayload[i]['Directory'], 'Payload': towerViewPayload[i]['Payload'], 'towerID': towerID})
            const towerViewObjectRes = await towerViewObject.save()
            res.json(towerViewObjectRes)
        }
        res.json(towerViewResponse)
    }
    catch(e){
        console.log(e.message)
    }
})

router.post('/topdown', async(req,res) => {
    try{
        const topDownResponse = req.body
        const topDownPayload = topDownResponse['payload']
        const towerID = topDownResponse['towerID']
        const topDownObj = await topDown.aggregate([{ $match: { "towerID": towerID } }])
        if(!topDownObj.length == 0){
            await topDown.deleteMany({"towerID": towerID})
        }
        for(let i = 0;i < topDownPayload.length;i++){
            const topDownObject = new topDown({'Description': topDownPayload[i]['Description'],  'Directory': topDownPayload[i]['Directory'], 'Payload': topDownPayload[i]['Payload'], 'towerID': towerID})
            const topDownObjectRes = await topDownObject.save()
            res.json(topDownObjectRes)
        }
        res.json(topDownResponse)
    }
    catch(e){
        console.log(e.message)
    }
})

router.post('/los', async(req,res) => {
    try{
        const losResponse = req.body
        const losPayload = losResponse['payload']
        const towerID = losResponse['towerID']
        const losObj = await los.aggregate([{ $match: { "towerID": towerID } }])
        if(!losObj.length == 0){
            await los.deleteMany({"towerID": towerID})
        }
        for(let i = 0;i < losPayload.length;i++){
            const losObject = new los({'Description': losPayload[i]['Description'],  'Directory': losPayload[i]['Directory'], 'Payload': losPayload[i]['Payload'], 'towerID': towerID})
            const losObjectRes = await losObject.save()
            res.json(losObjectRes)
        }
        res.json(losResponse)
    }
    catch(e){
        console.log(e.message)
    }
})

router.post('/editSpinDir', async(req,res) => { 
    try{
        const direcID = req.body.direcID
        const value = req.body.value
        const view = req.body.view
        switch(view){
            case 'topdown':
                const topDownResponse = await topDown.findByIdAndUpdate(direcID, { Directory: value }, { upsert: true });
                res.json({isError: false, body: topDownResponse})
                break;
            case 'los':
                const losResponse = await los.findByIdAndUpdate(direcID, { Directory: value }, { upsert: true });
                res.json({isError: false, body: losResponse})
                break;
            case 'towerview':
                const towerviewResponse = await towerView.findByIdAndUpdate(direcID, { Directory: value }, { upsert: true });
                res.json({isError: false, body: towerviewResponse})
                break;
            default:
                break;
        }
    }
    catch(e){
        console.log(e.message)
        res.json({isError: true, message: `${view} edit failed`})
    }
  })

module.exports = router