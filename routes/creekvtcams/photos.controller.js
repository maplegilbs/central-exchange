//Librarires
const router = require('express').Router();
const path = require('path');
//Functions
const { getPhotoURLs } = require(path.join(process.cwd(),'/utils/creekvtcams/getPhotoURLsFromAWS.js'));


router.get('/', async (req, res)=>{
    let {riverName, quantity} = req.query;
    let photoURLs = await getPhotoURLs({riverName, quantity})
    res.json(photoURLs)
})

module.exports = router;