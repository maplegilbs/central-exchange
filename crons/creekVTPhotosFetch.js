//Libraries
const path = require('path')
//Functions
const { getPhotosFromSpypointByCameraIDs } = require(path.join(process.cwd(),'/utils/creekvtcams/getPhotosFromSpypointAWS.js'))
//Globals
const { cameraListByOwner } = require (path.join(process.cwd(), '/utils/creekvtcams/cameraList.js'));

//CRON job (to be run by heroku scheduler)
for (let owner of Object.keys(cameraListByOwner)){
    console.log('cron running')
    let curOwnerUserName = cameraListByOwner[owner].username;
    let curOwnerPassword = cameraListByOwner[owner].password;
    let curOwnerCameraIDs = cameraListByOwner[owner].cameras;
    getPhotosFromSpypointByCameraIDs(curOwnerUserName, curOwnerPassword, curOwnerCameraIDs )
}