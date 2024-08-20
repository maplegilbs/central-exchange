//Libraries
const router = require('express').Router();
const mysql = require('mysql2')
const { handleError } = require('../../utils/handleError.js')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASSWORD,
    database: process.env.DB_NAME_CREEKVTFLOWS
}).promise();


//GET -- get a list of all gauges
router.get("/", async (req, res) => {
    try {
        let queryStatement = `select * from gauges`;
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res)
    }
})

module.exports = router