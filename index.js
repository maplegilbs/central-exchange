//Libraries
const express = require('express')
const app = express();
const cors = require('cors');

//DEV ONLY
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Constants
const PORT = process.env.PORT;

//Import Routers
const portfolioRouter = require('./routes/portfolio.controller.js');
const creekVTRacesRouter = require('./routes/creekvtraces.controller.js')
const creekVTCamsRouter = require('./routes/creekvtcams.controller.js')
//Middleware
app.use(cors())
app.use(express.json())

//Use routers
app.use('/portfolio', portfolioRouter);
app.use('/creekvt_racing', creekVTRacesRouter);
app.use('/creekvt_cams', creekVTCamsRouter)

//Start 
app.listen(PORT, console.log(`Listening on port ${PORT}`))