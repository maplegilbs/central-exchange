if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Start at by river
const startAt = {
    "middlebury": "middlebury/PICT7305_2025-11-29.jpg",
    "bigbranch": "bigbranch/PICT3345_2026-03-28.jpg",
    "patterson": "patterson/PICT3125_2026-03-28.jpg",
    // "newhaven": "newhaven/PICT0021_2026-03-10.jpg",
    "newhaven": "",
    "northbranchlamoille": "northbranchlamoille/PICT2123_2025-12-04.jpg"
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