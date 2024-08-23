//Libraries
const router = require('express').Router();
const mysql = require('mysql2')
const { handleError } = require('../../utils/handleError.js')
const { createGaugeGeoJson } = require('../../utils/createGaugeGeoJson.js')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASSWORD,
    database: process.env.DB_NAME_CREEKVTFLOWS
}).promise();


//GET -- get a list of all gauges
router.get("/", async (req, res) => {
    try {
        let queryStatement = `select * from gauges where isActive`;
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res)
    }
})

//GET -- a list of all gauges and the rivers associated with them
router.get("/gaugesInclRivers", async (req, res) => {
    try {
        let queryStatement = `
        SELECT gauges.usgsID, gauges.usgsName, gauges.lat, gauges.lon, riversList.rivers 
        FROM gauges 
        left join (select gauge1ID, GROUP_CONCAT(name order by name) as rivers from riverData group by gauge1ID) as riversList 
        on riversList.gauge1ID = gauges.usgsID;`;
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res)
    }
})

//GET -- a geoJSON file for point features of every river gauge
router.get("/geoJSON", async (req, res) => {
    try {
        let queryStatement = `select * from gauges where isActive`;
        let results = await connection.query(queryStatement)
        let geoJSONData = createGaugeGeoJson(results[0])
        res.status(200).json(geoJSONData)
    } catch (error) {
        handleError(error, req, res)
    }
})

module.exports = router