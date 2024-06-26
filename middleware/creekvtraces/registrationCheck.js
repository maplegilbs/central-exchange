//Libraries
const mysql = require('mysql2')
//Middleware
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    database: process.env.DB_NAME_CREEKVTRACES,
    password: process.env.DB_ADMIN_PASSWORD
}).promise();

//Determines if registration is currently open and if not rejects the with status 500 and error message
async function checkRegStatus (req, res, next) {
    try {
        let curRace = req.body.raceName.split(" ").join("").toLowerCase();
        let queryStatement = `select date, isRegOpen from race_details where lower(replace(name, " ", "")) = "${curRace}"`
        let selectedRace = await connection.query(queryStatement)
        if(!selectedRace[0][0].isRegOpen || new Date(selectedRace[0][0].date) < new Date()) {throw new Error(`Registration is not currently open for the ${req.body.raceName}`)}
        next();
    } catch (error) {
        console.error('Error in checking race registration status:', error)
        res.status(500).json({ "message": "Error in confirming race registration status" + error })
    }
}

module.exports = {checkRegStatus}