//Libraries
// const SpypointClient = require('spypoint-api-wrapper')
import SpypointClient from 'spypoint-api-wrapper';
//Functions
const {getPhotoURLs} = require('./getPhotoURLsFromAWS.js');
const {sendPhotoToAWS} = require('./sendPhotosToAWS.js');

async function getPhotosFromSpypointByCameraIDs(userName, password, cameraIDs) {
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
                    }
                    console.log(`https://creekvtrivercams.s3.amazonaws.com/${directoryName}/${photoName}.jpg`)
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

module.exports = {getPhotosFromSpypointByCameraIDs}