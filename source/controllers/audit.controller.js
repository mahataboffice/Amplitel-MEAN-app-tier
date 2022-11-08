var express = require('express')
var router = express.Router()
const auditGeneral = require("../models/audit_general.model")
const auditEquipment = require("../models/audit_equipment.model")
const authorize = require('../middleware/authorize.middleware')

router.get('/general', async(req, res) => {
    try{
        const towerID = req.query.towerID
        const audit_general = await auditGeneral.aggregate([{ $match: { "towerID": towerID } }])
        res.json( {isError: false, body: audit_general})
    }
    catch(e){
        console.log(e.message)
        res.json( {isError: true, body: "Cannot fetch towers general data"})
    }
})

router.get('/equipment', async(req, res) => {
    try{
        const towerID = req.query.towerID
        const audit_equipment = await auditEquipment.aggregate([{ $match: { "towerID": towerID } }])
        res.json( {isError: false, body: audit_equipment})
    }
    catch(e){
        console.log(e.message)
        res.json( {isError: true, body: "Cannot fetch towers equipment data"})
    }
})

router.post('/auditCategory', async(req, res) => { 
    try{
        const towerID = req.query.towerID
        const sectionType = req.body.sectionType
        const auditAction = req.body.auditAction
        var auditDataObj = ''
        var response = ''
        if(auditAction == "Add")
        {
            const auditData = req.body.auditData
            auditDataObj = sectionType == 'General' ? new auditGeneral(auditData) : (sectionType == 'Equipment' ? new auditEquipment(auditData) : '')
            if(auditDataObj != '')
            {
                auditDataObj["towerID"] = towerID
                response = await auditDataObj.save()
                res.json({isError: false,body: response})
            }
            else{
                res.json({isError: true,message: 'Operation Failed'})
            }
        }
        else if(auditAction == "Delete")
        {
            const categoryID = req.body.categoryID
            let auditCategoryObj = sectionType == 'General' ? await auditGeneral.findByIdAndDelete(categoryID) : (sectionType == 'Equipment' ? await auditEquipment.findByIdAndDelete(categoryID) : '')
            res.json({isError: false,body: 'Category Deleted Successfully'})
        }
    }
    catch(e){
        console.log(e.message)
        res.json( {isError: true, message: `${auditAction} category failed!`})
    }
})

router.post('/auditDetails', async(req,res) => {
    try{
        const auditDetailAction = req.body.auditDetailAction
        if(auditDetailAction == 'Delete'){
            const auditCategoryID = req.body.auditDetailArr[0].id
            const auditSection = req.body.auditDetailArr[0].section
            let auditCategoryObj = auditSection == 'General' ? await auditGeneral.findById(auditCategoryID) : (auditSection == 'Equipment' ? await auditEquipment.findById(auditCategoryID) : '')
            let auditDetailsArray = auditCategoryObj["Details"]
            let deleteIndexes = req.body.auditDetailArr.map((data) => data.detailIndex)
            deleteIndexes.sort()
            for(let i = 0; i< deleteIndexes.length;i++){
                auditDetailsArray.splice(deleteIndexes[i] - i,1)
            }
            auditCategoryObj["Details"] = auditDetailsArray
            const auditCategoryResponse = await auditCategoryObj.save()
            res.json({isError: false,body: { section: auditSection,sectionIndex: req.body.auditDetailArr[0].sectionIndex,payload: auditCategoryResponse['Details']}})
        }
        else{
            const auditCategoryID = req.body.auditCategoryID
            const auditSection = req.body.auditSection
            let auditCategoryObj = auditSection == 'General' ? await auditGeneral.findById(auditCategoryID) : (auditSection == 'Equipment' ? await auditEquipment.findById(auditCategoryID) : '')
            let auditDetailsArray = auditCategoryObj["Details"]
            if(auditDetailAction == 'Edit'){
             const auditDetailData = req.body.auditDetailData
             const auditDetailDataIndex = req.body.auditDetailDataIndex
             auditDetailsArray[auditDetailDataIndex] = auditDetailData
             auditCategoryObj["Details"] = auditDetailsArray
             const updatedAuditDetailData = await auditCategoryObj.save()
             res.json({isError: false,body: auditDetailData})
            }
            else if(auditDetailAction == 'Add'){
                const auditDetailData = req.body.auditDetailData
                auditDetailsArray.push(auditDetailData)
                auditCategoryObj["Details"] = auditDetailsArray
                const updatedAuditDetailData = await auditCategoryObj.save()
                res.json({isError: false,body: auditDetailData})
            }
        }
    }
    catch(e){
        console.log(e.message)
        res.json( {isError: true, message: `${auditDetailAction} audit detail failed!`})
    }
})

module.exports = router