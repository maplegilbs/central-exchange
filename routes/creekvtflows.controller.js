//Libraries
const router = require('express').Router();

const levelsRouter = require('./creekvtflows/levelReports.controller.js');
const rainRouter = require('./creekvtflows/rainInfo.controller.js');
const gaugesRouter = require('./creekvtflows/gauges.controller.js');

router.use('/levels', levelsRouter);
router.use('/rain', rainRouter);
router.use('/gauges', gaugesRouter)

module.exports = router;