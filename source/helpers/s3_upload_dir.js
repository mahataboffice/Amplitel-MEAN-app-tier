const fs = require("fs")
const path = require("path")
const AWS = require('aws-sdk');
const mime = require('mime-types')
AWS.config = new AWS.Config();
AWS.config.loadFromPath("./source/helpers/aws_config.json")
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const s3Folder = "vertikaliti_docs_data/"

const uploadToS3 = (fileName,s3Path) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    const contentType = mime.contentType(fileName.split('/').slice(-1)[0])

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'telstra-testing',
        Key: s3Folder + s3Path, // File name you want to save as in S3
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
    };

    // Uploading files to the bucket
    return s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

const uploadFileS3 = async (filename,s3Path) => {
    const uploadObj = await uploadToS3(filename,s3Path)
    const uploadRes = await uploadObj.on('httpUploadProgress', async function(progress) {
        let progressPercentage = Math.round(progress.loaded / progress.total * 100);
        console.log(progressPercentage)
    }).promise()
    return uploadRes.Location
}



module.exports = uploadFileS3