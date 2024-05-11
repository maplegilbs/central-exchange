//Calculate the volume in the tank based on the height
function calcVolFromHeight(height) {

    const radius = 45;
    const volPerInHeight = 111.5;

    if (height < 1) {
        let volume = 0;
        return volume;
    }

    else if (height < 45) {
        let x = (radius - height) / radius;
        let y = (2 * radius * height - Math.pow(height, 2));
        let volume = (Math.pow(radius, 2) * Math.acos(x) - (radius - height) * Math.sqrt(y)) * 286 / 231;
        return Math.round(volume);

    }

    else {
        let volume = 3827 + (height - 44) * volPerInHeight;
        return Math.round(volume);
    }

}

module.exports = {calcVolFromHeight}