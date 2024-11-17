//Libraries
const router = require('express').Router()
const mysql = require('mysql2');
const path = require('path');
//Middleware
const { authenticateUser } = require(path.join(process.cwd(),'/middleware/creekvtraces/authenticate.js'));
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    database: process.env.DB_NAME_CREEKVTRACES,
    password: process.env.DB_ADMIN_PASSWORD
}).promise();

//GET -- Get all race details -- UNPROTECTED
router.get('/', async (req, res) => {
    const queryStatement = `select * from race_details`;
    try {
        const racesData = await connection.query(queryStatement)
        res.status(200).json(racesData[0])
    } catch (error) {
        console.error(`There was an error fetching race details. Error: ${error}`);
        res.status(500).json({ "message": `There was an error fetching the data ${error}` })
    }
})


//GET -- Get race data based on race name -- UNPROTECTED
router.get('/:raceName', async (req, res) => {
    const queryStatement = `select * from race_details where lower(replace(name, " ", "")) = "${req.params.raceName}"`;
    try {
        const raceData = await connection.query(queryStatement);
        res.status(200).json(raceData[0])
    } catch (error) {
        console.error(`There was an error fetching race details based on racename ${req.params.raceName}. Error: ${error}`);
        res.status(500).json({ "message": `There was an error fetching the data ${error}` })
    }
})

//PATCH -- update race data based on race name -- PROTECTED
router.patch('/:raceName', authenticateUser, async (req, res) => {
    try {
        let modifiedRaces = req.races.map(race => race.split(' ').join('').toLowerCase())
        if (!modifiedRaces.includes(req.params.raceName)) {
            res.status(403).json({ "message": "Permission to modify selected race denied" })
        }
        else {
            let fieldUpdatePreparedStatement = [];
            let fieldUpdateValues = [];
            for (let propertyName in req.body) {
                fieldUpdatePreparedStatement.push(`${propertyName} = ? `)
                fieldUpdateValues.push(req.body[propertyName])
            }
            const queryStatement = `update race_details set ${fieldUpdatePreparedStatement} where name = "${req.body.name}" `
            const updatedRace = await connection.query(queryStatement, fieldUpdateValues)
            res.status(200).json(updatedRace)
        }
    } catch (error) {
        console.error(`There was an error updating the race ${error}`);
        res.status(500).json({ "message": `There was an error updating the data ${error}` })
    }

})

module.exports = router;
