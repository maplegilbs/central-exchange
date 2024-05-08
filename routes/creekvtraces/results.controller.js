//Libraries
const router = require("express").Router()
const mysql = require("mysql2");
const path = require('path');
//Middleware
const { authenticateUser } = require(path.join(process.cwd(),'/middleware/creekvtraces/authenticate.js'));
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    database: process.env.DB_NAME_CREEKVTRACES,
    password: process.env.DB_ADMIN_PASSWORD
}).promise();


//GET - get the table format -- PROTECTED

//GET - get all results -- UNPROTECTED
router.get('/', async (req, res)=>{
    try {
        const queryStatement = `SELECT * FROM results ${req.query.raceName? `WHERE lower(replace(raceName, " ", "")) = "${req.query.raceName}"`:""} ORDER BY year desc, raceName asc, place asc`
        const returnedResults = await connection.query(queryStatement)
        res.json(returnedResults[0])
    } catch (error) {
        console.error(`There was an error fetching results data.  Error: ${error}`);
        res.status(500).json({ "message": `There was an error fetching the results for the race.` })
    }

})

//GET - get all available years grouped by race name -- UNPROTECTED
router.get('/resultYears', async (req, res) => {
    try {
        const queryStatement = `select DISTINCT raceName, year as raceYear, GROUP_CONCAT(distinct raceCategory SEPARATOR ", ") as raceCategory from results ${req.query.raceName? `WHERE lower(replace(raceName, " ", "")) = "${req.query.raceName}"`:""} group by raceName, raceYear `
        const returnedRaceYears = await connection.query(queryStatement)
        returnedRaceYears[0].forEach(dataRow => dataRow.raceCategory = dataRow.raceCategory.split(", "))
        res.json(returnedRaceYears[0])
    } catch (error) {
        console.error(`There was an error fetching result years data.  Error: ${error}`);
        res.status(500).json({ "message": `There was an error fetching the result years by race` })
    }
})

module.exports = router