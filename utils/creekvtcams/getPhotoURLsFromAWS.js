if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Start at by river
const startAt = {
    "middlebury": "middlebury/PICT7613_2026-08-26.jpg",
    "bigbranch": "bigbranch/PICT4478_2026-08-26.jpg",
    "patterson": "patterson/PICT4338_2026-08-26.jpg",
    // "newhaven": "newhaven/PICT0021_2026-03-10.jpg",
    "newhaven": "newhaven/PICT0992_2026-08-18.jpg",
    "northbranchlamoille": "northbranchlamoille/PICT3098_2026-08-04.jpg"
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