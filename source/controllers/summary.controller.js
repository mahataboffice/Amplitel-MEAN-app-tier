var express = require('express')
var router = express.Router()
const summary = require("../models/summary.model")
const auditGeneral = require("../models/audit_general.model")
const auditEquipment = require("../models/audit_equipment.model")

router.get('/', async(req,res) => {
    try{
        const towerID = req.query.towerID
        const summaryObj = await summary.aggregate([{ $match: { "towerID": towerID } }])
        const audit_general = await auditGeneral.aggregate([{ $match: { "towerID": towerID } }])
        const audit_equipment = await auditEquipment.aggregate([{ $match: { "towerID": towerID } }])
        res.json({ isError: false, body: { 'summary': summaryObj,"Audit" : { "General": audit_general, "Equipment": audit_equipment}}})
    }
    catch(e){
        console.log(e.message)
        res.json({isError:true, message: "Cannot fetch summmary data"})
    }
})

module.exports = router