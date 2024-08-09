//Libraries
const router = require('express').Router();
const mysql = require('mysql2');
const { handleError } = require('../../utils/handleError.js');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASSWORD,
    database: process.env.DB_NAME_CREEKVTFLOWS
}).promise();


//GET -- get a list of unique river names
router.get('/riverNames', async (req, res) => {
    try {
        let queryStatement = `select distinct riverName from riverData`;
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res);
    }
})


//GET -- list of all river data
router.get('/riverData', async (req, res) => {
    try {
        const queryStatement = `select * from riverData order by name asc`
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res);
    }
})

//GET -- list of all gauges
router.get('/gaugeData', async (req, res)=>{
    try {
        const queryStatement = `SELECT gauge1Id, gauge1Name, GROUP_CONCAT(name ORDER by name) as rivers FROM riverData group by gauge1ID`
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res)
    }
})

//GET -- list of all river data
router.get('/flowReports', async (req, res) => {
    try {
        const {riverName, limit} = req.query;
        const queryStatement = `select * from flowstable ${riverName ? `where LOWER(riverName) = '${riverName.toLowerCase()}'`: ''} order by tripDateTime desc ${limit ? `limit ${limit}`:''}`
        console.log(queryStatement)
        let results = await connection.query(queryStatement)
        res.status(200).json(results[0])
    } catch (error) {
        handleError(error, req, res);
    }
})

//POST -- post level report from user
router.post('/levelsubmit', async (req, res) => {
    console.log(`Submitted ${new Date().getMinutes()}`)
    let dataKeys = Object.keys(req.body);
    let columnNames = ['submissionDateTime'];
    let columnValues = [new Date()];
    let {levelType, level} = req.body;
    let translatedTextLevel;
    const levelLookup = {
        1: 'Too Low',
        2: 'Minimum',
        3: 'Low',
        4: 'Medium Low',
        5: 'Medium',
        6: 'Medium High',
        7: 'High',
        8: 'Too High'
    }
    if(levelType.toLowerCase().includes('subjective')){
        translatedTextLevel = levelLookup[level]
        columnNames.push('translatedTextLevel')
        columnValues.push(translatedTextLevel)
    }
    for (let key of dataKeys) {
        if (key !== 'gaugeReadings') {
            columnNames.push(key)
            columnValues.push(req.body[key])
        }
        else {
            for (let gaugeKey of Object.keys(req.body.gaugeReadings)) {
                columnNames.push(gaugeKey)
                columnValues.push(req.body.gaugeReadings[gaugeKey])
            }
        }
    }
    try {
        const queryStatement = `insert into flowstable (${columnNames.join(", ")}) values (${columnValues.map(value => '?').join(", ")}) `
        const insertedLevelReport = await connection.query(queryStatement, columnValues);
        res.status(201).json(insertedLevelReport);
    } catch (error) {
        handleError(error, req, res);
    }
})


module.exports = router;