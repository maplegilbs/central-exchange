function createGaugeGeoJson(gaugesData){
    let geoJSONData = {
        "type": "FeatureCollection",
        "ID": "USGS streamgages",
        "crs": {
            "type": "name",
            "properties": {
                "ID": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": []
    }
    geoJSONData.features = gaugesData.map(gaugeData => {
        return {
            "type": "Feature",
            "properties": {
                "ID": gaugeData.usgsID, 
                "name": gaugeData.usgsName
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    Number(gaugeData.lon),
                    Number(gaugeData.lat)
                ]
            }
        }
    })
    return geoJSONData;
}

module.exports = {createGaugeGeoJson}