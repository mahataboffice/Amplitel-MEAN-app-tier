var express = require('express')
var router = express.Router()
const gallery = require("../models/gallery.model")

router.get('/', async(req,res) => { 
    try{
        const towerID = req.query.towerID
        const galleryDoc = await gallery.aggregate([{ $match: { "towerID": towerID } }])
        res.status(200).send({ isError: false, body: galleryDoc})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({ isError: true, message: "Cannot fetch gallery data"})
    }
})


router.post('/', async(req,res) => { 
    try{
        const towerID = req.query.towerID
        const galleryDocData = req.body.galleryDocData
        galleryDocData['towerID'] = towerID
        const galleryObj = new gallery(galleryDocData)
        const savedGalleryResponse = await galleryObj.save()
        res.status(200).send({ isError: false, body: savedGalleryResponse})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({ isError: true, message: "Cannot add gallery data"})
    }
})

router.post('/editDirec', async(req,res) => { 
    try{
        const galleryID = req.body.galleryID
        const directory = req.body.directory
        const galleryEditResponse = await gallery.findByIdAndUpdate(galleryID, { directory: directory }, { upsert: true });
        res.status(200).send({ isError: false, body: galleryEditResponse})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({ isError: true, message: "Cannot edit gallery data"})
    }
})

router.post('/deleteDirec', async(req,res) => { 
    try{
        const galleryArrID = req.body.galleryArrID
        for(let i = 0;i < galleryArrID.length; i++){
            const galleryDeleteResponse = await gallery.deleteOne({ _id: galleryArrID[i].id});
        }
        res.status(200).send({ isError: false, body: "Gallery direc deleted Successfully"})
    }
    catch(e){
        console.log(e.message)
        res.status(500).send({ isError: true, message: "Cannot delete gallery data"})
    }
})

module.exports = router