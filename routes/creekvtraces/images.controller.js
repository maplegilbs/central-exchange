//Libraries
const router = require("express").Router();
const mysql = require("mysql2");
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    database: process.env.DB_NAME_CREEKVTRACES,
    password: process.env.DB_ADMIN_PASSWORD
}).promise();


router.get('/photographers', async (req, res) => {
    let photographers = req.query.names.split(", ").map(photographer => `"${photographer}"`).join(", ")
    try {
        const queryStatement = `select * from photographers where name IN (${photographers})`
        const photographerDetails = await connection.query(queryStatement);
        res.status(200).json(photographerDetails[0])
    } catch (error) {
        console.error(`There was an error fetching the photographers.  ${error}`);
        res.status(500).json({ "message": `There was an error fetching the photographers` })

    }
})

module.exports = router;