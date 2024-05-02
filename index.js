//Libraries
const express = require('express')
const app = express();
const cors = require('cors');

//DEV ONLY
require('dotenv').config();

//Constants
const PORT = process.env.PORT;
//Routers


//Middleware
app.use(cors())
app.use(express.json())


app.listen(PORT, console.log(`Listening on port ${PORT}`))