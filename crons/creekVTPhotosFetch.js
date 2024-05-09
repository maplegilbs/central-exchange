(async () => {//Functions
    // const { getPhotosFromSpypointByCameraIDs } = await import('../utils/creekvtcams/getPhotosFromSpypointAWS.js')
    const module = await import('../utils/creekvtcams/getPhotosFromSpypointAWS.js')
    const getPhotosFromSpypointByCameraIDs = await module.default;
    //Globals
    const { cameraListByOwner } = require('../utils/creekvtcams/cameraList.js');

    //CRON job (to be run by heroku scheduler)
    for (let owner of Object.keys(cameraListByOwner)) {
        console.log('cron running', getPhotosFromSpypointByCameraIDs, cameraListByOwner)
        let curOwnerUserName = cameraListByOwner[owner].username;
        let curOwnerPassword = cameraListByOwner[owner].password;
        let curOwnerCameraIDs = cameraListByOwner[owner].cameras;
        getPhotosFromSpypointByCameraIDs(curOwnerUserName, curOwnerPassword, curOwnerCameraIDs)
    }
})();