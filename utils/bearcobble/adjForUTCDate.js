function adjustForUTC(timeToConvert) {
    let currentHours = timeToConvert.getUTCHours();
    //adjust for DST vs STD
    let intlDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'America/New_York'
    }).format(timeToConvert);
    let hourDiff = 5;
    if(intlDate.includes('EDT')){
        hourDiff = 4
    }
    console.log(hourDiff)
    timeToConvert.setUTCHours(currentHours - hourDiff);
    return timeToConvert;
}

module.exports = { adjustForUTC };