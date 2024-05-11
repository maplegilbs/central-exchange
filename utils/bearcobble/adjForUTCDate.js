function adjustForUTC(timeToConvert) {
    let currentHours = timeToConvert.getUTCHours();
    //adjust for DST vs STD
    let hourDiff = 5;
    let now = new Date()
    let std = new Date(now.getFullYear(), 0, 1);
    let dst = new Date(now.getFullYear(), 6, 7);
    console.log("Offset calc: ", std.getTimezoneOffset(), dst.getTimezoneOffset(), now.getTimezoneOffset())
    if (std.getTimezoneOffset() > now.getTimezoneOffset()) {
        hourDiff = 4;
    }
    console.log(hourDiff);
    timeToConvert.setUTCHours(currentHours - hourDiff);
    return timeToConvert;
}

module.exports = { adjustForUTC };