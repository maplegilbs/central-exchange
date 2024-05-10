const router = require('express').Router();

//Routers
const racesRouter = require('./creekvtraces/races.controller.js')
const usersRouter = require('./creekvtraces/users.controller.js')
const racersRouter = require('./creekvtraces/racers.controller.js')
const geoInfoRouter = require('./creekvtraces/geoInfo.controller.js')
const scheduleRouter = require('./creekvtraces/schedule.controller.js')
const resultsRouter = require('./creekvtraces/results.controller.js')
const faqRouter = require('./creekvtraces/faq.controller.js')
const registrationRouter = require('./creekvtraces/registration.controller.js')
const contactRouter = require('./creekvtraces/contact.controller.js')
const sponsorRouter = require('./creekvtraces/sponsors.controller.js')
const imagesRouter = require('./creekvtraces/images.controller.js')


router.use('/races', racesRouter)
router.use('/users', usersRouter)
router.use('/racers', racersRouter)
router.use('/geoInfo',geoInfoRouter)
router.use('/schedule', scheduleRouter)
router.use('/results', resultsRouter)
router.use('/faq', faqRouter)
router.use('/register', registrationRouter)
router.use('/contact', contactRouter)
router.use('/sponsors', sponsorRouter)
router.use('/images', imagesRouter)



module.exports = router;