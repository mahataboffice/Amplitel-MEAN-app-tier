var express = require('express')
var router = express.Router()
const ortho = require('../models/orthomap.model')

router.get('/', async(req,res) => {
    try{
        const towerID = req.query.towerID
        const orthoObj = await ortho.aggregate([{ $match: { "towerID": towerID } }])
        res.status(200).send({isError: false,body: orthoObj[0]})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true,message: "Cannot fetch ortho data!"})
    }
})

router.post('/', async(req,res) => {
    try{
        const orthoRes = req.body
        const towerID = orthoRes['towerID']
        const orthomapDoc = orthoRes['orthomap']
        orthomapDoc['zoom'] = orthoRes['zoom']
        orthomapDoc['towerID'] = towerID
        const orthoObj = await ortho.aggregate([{ $match: { "towerID": towerID } }])
        if(orthoObj.length == 0){
            const orthoObj = new ortho(orthomapDoc)
            const savedOrthoResponse = await orthoObj.save()
            res.status(200).send(savedOrthoResponse)
        }
        else{
            const orthoObj = await ortho.replaceOne({towerID: towerID},orthomapDoc,{ upsert: true })
            res.status(500).send(orthoObj)
        }
    }
    catch(e){
        console.log(e.message)
    }
})

module.exports = router