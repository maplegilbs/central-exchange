//Libraries
const router = require("express").Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

//Utility functions
const { handleError } = require("../utils/handleError.js");
const { captchaCheck } = require("../middleware/captchaCheck.js");
const {sendEmail} = require("../utils/emails.js")

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN_USER,
    database: process.env.DB_NAME_PORTFOLIO,
    password: process.env.DB_ADMIN_PASSWORD
}).promise();


router.post('/login', async (req, res) => {
    try {
        let inputpasscode = req.body.password;
        let queryStatement = `select * from passcode where passcode = '${inputpasscode}' `
        let matches = await pool.query(queryStatement);
        let wasMatch = matches[0].length > 0;
        if (wasMatch) {
            let token = jwt.sign({ isAuth: true }, process.env.PORTFOLIO_SECRET)
            res.status(200).send({ message: 'Login success', body: token })
        }
        else {
            res.status(403).send({ message: 'Login failure', body: null })
        }
    } catch (error) {
        handleError(error, req, res)
    }
})

router.get('/resume', async (req, res) => {
    try {
        if (req.headers.authorization) { //check if request has included a token
            let token = req.headers.authorization.split(' ')[1];
            //if the token is verified & the isAuth property is true then serve the file
            let verifiedToken = await jwt.verify(token, process.env.PORTFOLIO_SECRET);
            if (verifiedToken.isAuth) {
                //get the file and stats from the file
                const filePath = path.join(__dirname, '../public/Portfolio_2024_Resume.pdf');
                const fileStats = fs.statSync(filePath);
                //write to the response header
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Content-Length': fileStats.size
                });
                //read the file as a stream and send it in the response
                const readStream = fs.createReadStream(filePath);
                readStream.pipe(res)
            }
            else {
                res.status(403).send({ message: 'Unauthorized access to this file.', body: null })
            }
        }
    } catch (error) {
        handleError(error, req, res)
    }
})

router.post('/contact', captchaCheck, async(req, res)=> {
    try {
        const message = `<p>Message from ${req.body.contactName}.</p><p>Contact email ${req.body.contactEmail}</p><p>Message: ${req.body.contactMessage}</p>`
        const sentEmail = await sendEmail('portfolio', 'sapmappers', 'scott@sapmappers.com', 'Portfolio Contact', message)
        console.log(sentEmail)
        res.status(200).json({message: 'Success'})
    } catch (error) {
        handleError(error, req, res)
    }
})


module.exports = router;