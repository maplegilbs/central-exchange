/*--Development only
import 'dotenv/config'
--*/

//Libraries
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function sendPhotoToAWS(photoFileName, photo){
    try {
        const addedPhoto = await s3.putObject({
            Bucket: 'creekvtrivercams',
            Key: photoFileName,
            Body: photo,
            ContentType: 'image/jpeg'
        }).promise()
    } catch (error) {
        console.error(`There was an error adding photo to the bucket.  Error: ${error}`);
    }
}

module.exports = {sendPhotoToAWS}