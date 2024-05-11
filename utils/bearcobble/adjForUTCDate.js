function adjustForUTC(timeToConvert) {
    let currentHours = timeToConvert.getUTCHours();
    //adjust for DST vs STD
    let hourDiff = 5;
    let now = new Date()
    let std = new Date(now.getFullYear(), 0, 1);
    let dst = new Date(now.getFullYear(), 6, 7);
    let estString = std.toLocaleString('en-US', { timeZone: 'America/New_York' });
    let estDate = new Date(estString);
    console.log("Offset calc: ", std.getTimezoneOffset(), dst.getTimezoneOffset(), estDate.getTimezoneOffset())
    if (std.getTimezoneOffset() > now.getTimezoneOffset()) {
        hourDiff = 4;
    }
    console.log(hourDiff);
    timeToConvert.setUTCHours(currentHours - hourDiff);
    return timeToConvert;
}

module.exports = { adjustForUTC };