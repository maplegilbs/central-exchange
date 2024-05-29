//Librarires
const router = require('express').Router();
const path = require('path');
const mysql = require('mysql2');
//Functions
const { getPhotoURLs } = require(path.join(process.cwd(), '/utils/creekvtcams/getPhotoURLsFromAWS.js'));
const { handleError } = require('../../utils/handleError.js');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASSWORD,
    database: process.env.DB_NAME_CREEKVTFLOWS
}).promise();

//GET -- pass in a rivername and quantity to get image urls from AWS 
router.get('/', async (req, res) => {
    let { riverName, quantity } = req.query;
    let photoURLs = await getPhotoURLs({ riverName, quantity })
    res.json(photoURLs)
})

router.get('/camInfo', async (req, res) => {
    try {
        const queryStatement = 'select * from camsInfo'
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])

    } catch (error) {
        handleError(error)
    }
})

module.exports = router;