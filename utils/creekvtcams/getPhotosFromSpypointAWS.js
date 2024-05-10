async function initialize() {
    return new Promise(async (res, rej) => {
        //Libraries
        const SpypointClientModule = await import('spypoint-api-wrapper')
        const SpypointClient = SpypointClientModule.default
        //Functions
        const { getPhotoURLs } = require('./getPhotoURLsFromAWS.js');
        const { sendPhotoToAWS } = require('./sendPhotosToAWS.js');

        //for each user, log in -- then get photos from each camera in list (id list) belonging to individual users - get most recent 2 photos - see if they already exist in aws, if not add to aws 
        module.exports.getPhotosFromSpypointByCameraIDs = async function getPhotosFromSpypointByCameraIDs(userName, password, cameraIDs) {
            const Spypoint = new SpypointClient();
            try {
                await Spypoint.login(userName, password)
                for (let cameraID of Object.keys(cameraIDs)) {
                    try {
                        let photos = await Spypoint.photosByCamera(cameraID, { limit: 3 })
                        for (let photo of photos.photos) {
                            const photoName = `${photo.originName.slice(0, -4)}_${photo.originDate.slice(0, 10)}`;
                            let myPhotoURL = `https://${photo.large.host}/${photo.large.path}`;
                            let response = await fetch(myPhotoURL);
                            let blob = await response.blob();
                            let arrayBuffer = await blob.arrayBuffer();
                            let buffer = Buffer.from(arrayBuffer);
                            const directoryName = cameraIDs[cameraID]
                            const existingImages = await getPhotoURLs({ riverName: directoryName, quantity: 1000 });
                            if (!existingImages.includes(`https://creekvtrivercams.s3.amazonaws.com/${directoryName}/${photoName}.jpg`)) {
                                await sendPhotoToAWS(`${directoryName}/${photoName}.jpg`, buffer)
                                console.log('The following image was added to AWS')
                                console.log(`https://creekvtrivercams.s3.amazonaws.com/${directoryName}/${photoName}.jpg`)
                            }
                            else {
                                console.log("The following image already exists in AWS")
                                console.log(`https://creekvtrivercams.s3.amazonaws.com/${directoryName}/${photoName}.jpg`)
                            }
                        }
                    }
                    catch (error) {
                        console.error(`There was an error in fetching and saving photos from camera ${cameraID}.  Error: ${error}.`);
                    }
                }
            } catch (error) {
                console.error(`There was an error in logging in for user ${userName}.  Error: ${error}.`);
            }
        }
        res(module.exports.getPhotosFromSpypointByCameraIDs)
    })
}

module.exports = initialize();
