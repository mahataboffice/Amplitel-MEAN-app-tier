const express = require("express")
const router = express.Router()
const digitaltwin = require("../models/digitaltwin.model")
const amplitelData = require("../models/amplitel_data.model")
const audit_general = require("../models/audit_general.model")
const logging = require('../config/logging');

const sectionsForSignedURL = ['Antenna','Head Frame - Mount','Transceiver - Junction Device','Aviation Light','Shelter']
const amplitelSectionsOrder = ['Site Details','Structure','Antenna','Head Frame - Mount','Transceiver - Junction Device','Aviation Light','Shelter']

async function updateAmplitelLinkToSigned(amplitel_data,site_name){
    let temp_arr = []
    for(let i = 0;i< amplitel_data.length;i++){
        if(sectionsForSignedURL.includes(amplitel_data[i].Name)){
            let details = amplitel_data[i].Details
            for(let j = 0;j < details.length; j++){
                let eq_name = details[j].Name
                //    Folder : vertikaliti_processed_data, 
                let imgPath = "vertikaliti_processed_data/"+ site_name + "/Images/" + eq_name + '.jpg'
                const proxyUrl = 'https://telstra-testing.s3.ap-south-1.amazonaws.com/' + imgPath
                amplitel_data[i].Details[j].Image = []
                amplitel_data[i].Details[j].Image.push(proxyUrl)
            }
        }
    }
    for(let i = 0;i < amplitelSectionsOrder.length;i++){
        for(let j = 0;j < amplitel_data.length;j++){
            if(amplitel_data[j]["Name"] == amplitelSectionsOrder[i]){
                temp_arr.push(amplitel_data[j])
            }
        }
    }
    return temp_arr
}


async function updateDigiLinkToSigned(digi_obj,site_name){
    if(digi_obj.hasOwnProperty("CAD")){
        let imgPath = "vertikaliti_processed_data/"+ site_name + "/scene.glb"
        const proxy_high_scene_url = 'https://telstra-testing.s3.ap-south-1.amazonaws.com/' + imgPath
        digi_obj["CAD"].Link = proxy_high_scene_url
        let imgPath_low = "vertikaliti_processed_data/"+ site_name + "/scene_low.glb"
        const proxy_low_scene_url = 'https://telstra-testing.s3.ap-south-1.amazonaws.com/' + imgPath_low
        digi_obj["CAD"].Link_low = proxy_low_scene_url
    }
    return digi_obj
}

router.get('/',async(req,res) => {
        const towerID = req.query.towerID
        const towerName = req.query.towerName
        try{
            const digiObj = await digitaltwin.aggregate([{ $match: { "towerID": towerID } }])
            console.log("REACHED LINE 88")
            if(digiObj.length > 0){
                const new_digiObj = await updateDigiLinkToSigned(digiObj[0],towerName)
                console.log("REACHED Line 90")
                logging.info(__filename, 'Fetching digiTwin Data success');
                const amplitel_data = await amplitelData.aggregate([{ $match: { "towerID": towerID } }])
                let new_amplitel_data = await updateAmplitelLinkToSigned(amplitel_data,towerName)
                const audit_site_obj = await audit_general.aggregate([{ $match: { "towerID": towerID, "Name": "SITE INFORMATION" } }])
                if(audit_site_obj.length > 0){
                    const date_of_site_visit = audit_site_obj[0].Details.filter((data) => data.Name == "Date of Site Visit")
                    let digi_img_index = new_amplitel_data[0].Details.findIndex((data) => data.Name == "Digital Twin Image Date")
                    if(digi_img_index != -1){
                        new_amplitel_data[0].Details[digi_img_index].Value = date_of_site_visit.length > 0 ? date_of_site_visit[0].Value : 'N/A'
                    }
                }
                console.log("REACHED Line 36")
                logging.info(__filename, 'Fetching amplitel Data success');
                res.status(200).send({ "DigitalTwin" : new_digiObj, "AmplitelData": new_amplitel_data , "status_description": "OK"})
            }
            else{
                res.status(400).send({"error_description" : "No Digi Data"})
            }
        }
        catch(error){
            logging.error(__filename, error.message, error);
            res.status(500).send({"error_description" : "Internal Server Error"})
        }
})

module.exports = router


