function handleError(error, req, res) {
    console.error(`Error at ${req.originalUrl}.  Error: ${error}`);
    if(req.params){ console.log('Params provided: ', req.params)}
    if(req.query){console.log('Query provided: ', req.query)}
    if(req.body){console.log('Body provided: ', req.body)}
    res.status(500).json({message: `There was an error accessing ${req.originalUrl}.`})
}

module.exports = {handleError};