if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const cameraListByOwner = {
    justin_crannell: {
        username: process.env.JCRANNELL_USERNAME,
        password: process.env.JCRANNELL_PASSWORD,
        cameras: {
            "6462ad02595bb6c784b586ae": "bigbranch",
        }
    },
    scott_gilbert: {
        username: process.env.SGILBERT_USERNAME,
        password: process.env.SGILBERT_PASSWORD,
        cameras: {
            "6021de4b1f1eb500145ec808": "middlebury",
            "61947db5577bfb1f5943ff55": "newhaven",
            "6137e5f6691b2500141b00b9": "northbranchlamoille"
        }
    }
}

module.exports = {cameraListByOwner}