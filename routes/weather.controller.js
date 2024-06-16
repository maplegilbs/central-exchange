const { handleError } = require('../utils/handleError');
const router = require('express').Router();

function createURL(source, lat, long) {
    if (source === 'openWeather') {
        return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&appid=${process.env.OW_APIKEY}`
    }
}

router.get('/forecast', async (req, res) => {
    try {
        const { source, lat, long } = req.query;
        console.log(source, lat, long)
        let forecastResponse = await fetch(createURL(source, lat, long))
        if (forecastResponse.status < 199 || forecastResponse.status > 300) {
            throw new error(`Fetch to ${createURL(source, lat, long)} failed.`)
        }
        else {
            let forecastData = await forecastResponse.json()
            res.status(200).json(forecastData)
        }
    } catch (error) {
        handleError(error)
    }
})

module.exports = router;