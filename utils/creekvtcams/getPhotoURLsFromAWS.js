if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Start at by river
const startAt = {
    "middlebury": "middlebury/PICT5527_2024-01-13.jpg",
    "bigbranch": "",
    "newhaven": "newhaven/PICT1012_2024-03-15.jpg"
}
//Libraries
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function getPhotoURLs({ riverName, quantity=1000 }) {
    try {
        const data = await s3.listObjectsV2({
            Bucket: `creekvtrivercams`,
            Prefix: `${riverName}/PICT`,
            MaxKeys: quantity,
            StartAfter: startAt[riverName]
        }).promise();
        let pictureURLs = data.Contents.map(pictureData => {
            return `https://creekvtrivercams.s3.amazonaws.com/${pictureData.Key}`;
        })
        return pictureURLs;
    } catch (error) {
        console.error(`There was an error fetching images from AWS for ${riverName}`)
        return [];
    }
    
}

module.exports = {getPhotoURLs}