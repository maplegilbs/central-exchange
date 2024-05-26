//Libraries
const router = require('express').Router();

const levelsRouter = require('./creekvtflows/levelReports.controller.js');

router.use('/', levelsRouter);

module.exports = router;