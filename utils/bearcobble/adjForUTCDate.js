function adjustForUTC(timeToConvert) {
    let currentHours = timeToConvert.getUTCHours();
    //adjust for DST vs STD
    let hourDiff = new Date().getTimezoneOffset() / 60;
    console.log(hourDiff);
    timeToConvert.setUTCHours(currentHours - hourDiff);
    return timeToConvert;
}

module.exports = {adjustForUTC};