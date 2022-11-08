var express = require('express')
var router = express.Router()
const docs = require("../models/docs.model")
const uploadFile = require("../middleware/upload.middleware");
const uploadFileS3 = require("../helpers/s3_upload_dir")

router.get('/', async(req,res) => { 
    try{
        const towerID = req.query.towerID
        const docsObj = await docs.aggregate([{ $match: { "towerID": towerID } }])
        res.status(200).send({isError: false, body: docsObj})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "Cannot fetch doc data!"})
    }
})


router.post('/upload',async(req,res) => {
  try {
    await uploadFile(req, res);
    const towerID = req.query.towerID
    const towerName = req.body.towerName
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const uploadObjUrl = await uploadFileS3(req.file.destination + req.file.filename, towerName + "/" + req.file.filename)
    const documentObj = new docs()
    documentObj['file'] = req.file.filename
    documentObj['link'] = uploadObjUrl
    documentObj['towerID'] = towerID
    const docResData = await documentObj.save()
    res.status(200).send({isError: false, body: docResData});
  } catch (err) {
    res.status(500).send({
      isError: true,
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
})

router.post('/editDoc', async(req,res) => { 
  try{
      const documentID = req.body.documentID
      const docName = req.body.value
      const documentEditResponse = await docs.findByIdAndUpdate(documentID, { file: docName }, { upsert: true });
      res.status(200).send({isError: false, body: documentEditResponse})
  }
  catch(e){
      console.log(e.message)
      res.status(500).send({isError: true, message: "Cannot edit doc data!"})
  }
})

router.post('/deleteDocument', async(req,res) => { 
    try{
        const documentArrID = req.body.documentArrID
        for(let i = 0; i < documentArrID.length; i++ ){
          const documentDeleteResponse = await docs.deleteOne({ _id: documentArrID[i].id});
        }
        res.status(200).send({isError: false, body: "Documents deleted successfully"})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({isError: true, message: "Cannot delete doc data!"})
    }
})

module.exports = router