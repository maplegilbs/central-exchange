//Libraries
const router = require('express').Router();
//Routers
const photosRouter = require('./creekvtcams/photos.controller.js');


//Use Routers
router.use('/photos', photosRouter)

//Blank Response
router.get('/', (req, res)=>{
    res.send('Please provide details regarding camera and image quantity')
})


module.exports = router;