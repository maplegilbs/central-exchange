//Libraries
const express = require('express')
const app = express();
const cors = require('cors');

//DEV ONLY
require('dotenv').config();

//Constants
const PORT = process.env.PORT;

//Import Routers
const portfolioRouter = require('./routes/portfolio.controller.js');

//Middleware
app.use(cors())
app.use(express.json())

//Use routers
app.use('/portfolio', portfolioRouter);

//Start 
app.listen(PORT, console.log(`Listening on port ${PORT}`))