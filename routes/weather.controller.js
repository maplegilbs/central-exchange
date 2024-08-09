const { handleError } = require('../utils/handleError');
const router = require('express').Router();

async function createURL(source, lat, long) {
    if (source === 'openWeather') {
        return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${process.env.OW_APIKEY}`
    }
    if (source === 'noaa') {
        try {
            let pointResponse = await fetch(`https://api.weather.gov/points/${lat},${long}`)
            let pointJSON = await pointResponse.json()
            return (pointJSON.properties.forecast)
        } catch (error) {
            return new Error(`There was an error creating the forecast URL: ${error}`)
        }
    }
}

router.get('/forecast', async (req, res) => {
    try {
        const { source, lat, long } = req.query;
        console.log(source, lat, long)
        let forecastURL = await createURL(source, lat, long)
        let forecastResponse = await fetch(forecastURL)
        if (forecastResponse.status < 199 || forecastResponse.status > 300) {
            throw new Error(`Fetch to ${createURL(source, lat, long)} failed.`)
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