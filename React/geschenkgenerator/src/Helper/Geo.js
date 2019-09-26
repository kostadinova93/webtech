import Cookies from './Cookies'
import $ from 'jquery'
import MapHelper from './Map'



let Geo = {};


Geo.distance = function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

Geo.getAndRequestUserCoordinates = function (appState, callback) {

    if (Cookies.getCookie("userlocation") != null) {
        var geojson = JSON.parse(Cookies.getCookie("userlocation"));
        Geo.foundLocation(appState, geojson);
        callback(geojson);
    } else {

        appState.mymap.locate();
        appState.mymap.on('locationerror', function () {
            console.log("Error: Allow position location at your browser to automatically get the nearest city to you");
            callback("locationerror");
        });
        appState.mymap.on('locationfound', function (e) {

            Geo.getLocationFromAddress(e.latlng.lat + "," + e.latlng.lng, appState, true, callback);
            return;
        });
    }
}
Geo.foundLocation = function (appState, geojson) {
    appState.mymap.setView([geojson.lat, geojson.lon], 11);
    MapHelper.addHomeMarker(appState, geojson);
}

Geo.getUserCoordinates = function () {
    if (Cookies.getCookie("userlocation") != null) {

        return JSON.parse(Cookies.getCookie("userlocation"));
    }
    return null;
}

Geo.deleteUserCoordinates = function () {
    Cookies.setCookie("userlocation", "");
}

Geo.getLocationFromAddress = function (address, appState, setUserLocation = true, callback) {
    if (address.length < 3) {
        alert("Wrong address. Too short");
        return;
    }
    var url = 'https://api.merik.now.sh/api/getcoordinates?address=' + address;
    fetch(url, {
        method: 'GET',
    })
        .then(response => {

            if (response.ok) {
                response.json().then(json => {
                    if (JSON.stringify(json).includes("error") && JSON.stringify(json).length < 10) {
                        alert("Wrong address. Not found.");
                        return;
                    }
                    var geojson = { name: json.name, lat: json.lat, lon: json.lon };
                    if (setUserLocation) {
                        Cookies.setCookie("userlocation", JSON.stringify(geojson));
                        Geo.foundLocation(appState, geojson);
                    }
                    if (callback != null) callback(geojson);
                }).catch(e => {
                    alert("Wrong address. Error2");
                    return;
                });
            } else {
                alert("Wrong address. Error3");
                return;
            }
        });
}

export default Geo;