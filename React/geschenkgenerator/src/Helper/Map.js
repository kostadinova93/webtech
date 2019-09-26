import Cookies from './Cookies'
import $ from 'jquery'
import L from 'leaflet'
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import LC from "leaflet-control-custom"

import LR from 'leaflet-routing-machine'
import { whileStatement } from '@babel/types';

let Map = {};

Map.showMap = function (appState) {
    //if(appState.mapVisible) Map.closeMap(appState);
    $("#map").css("display", "block");
    $("#map").css("height", $(window).height() - 50);
    appState.mymap.invalidateSize();
    $("html, body").animate({ scrollTop: $(document).height() }, 100);

    

    if (appState.homeMarker != null && appState.markers.length>1) {  
        // Create boundary box
        var boundaryBox = null;
        var coords = [];
        for (var i = 0; i < appState.markers.length; i++) {
            var corner = L.latLng(appState.markers[i].getLatLng().lat, appState.markers[i].getLatLng().lng);
            coords.push(corner);
            if (boundaryBox == null) {
                boundaryBox = L.latLngBounds(corner, corner)
            } else {
                boundaryBox.extend(corner);
            }
        }
     //   appState.mymap.fitBounds(boundaryBox);
        appState.activeRoutingMachine.setWaypoints(coords);
        appState.mymap.setView(appState.markers[1].getLatLng(), 15);
    } else if(appState.markers.length>0) {
        appState.mymap.setView(appState.markers[0].getLatLng(), 15);
    }
    appState.mapVisible=true;
}

Map.closeMap =function(appState) {
    $("#map").css("display", "none");
    $("#map").css("height",  50);

    if(appState.activeRoutingMachine!=null) appState.mymap.removeLayer(appState.activeRoutingMachine);

    for(var i=0; i<appState.markers.length; i++) {
        if(appState.markers[i]==appState.homeMarker) continue;
        appState.mymap.removeLayer(appState.markers[i]);
        appState.markers[i]=null;
    }
    appState.markers=appState.markers.filter(x=>x!=null);
}

Map.addMarker = function (appState, lat, lon, text, color="red", address) {
    var circMarker = L.circleMarker([lat, lon],
        {
            color:color,
            radius: 15,
            fillOpacity:0.65,
            opacity: 1
        }, 55).bindTooltip(text,
            {
                permanent: true,
                direction: 'right'
            });
    circMarker.addTo(appState.mymap);

    if (appState.markers == null) appState.markers = [];
    appState.markers.push(circMarker);
    Map.addAddress(appState, address);
    return circMarker;
}

Map.addHomeMarker = function (appState, geojson) {
    if(appState.homeMarker!=null) appState.mymap.removeLayer(appState.homeMarker);
    appState.homeMarker = Map.addMarker(appState, geojson.lat, geojson.lon, "You", "blue");
}

Map.clearMarkers = function (appState) {
    appState.markers = appState.markers.filter(x => x == appState.homeMarker);
}

Map.addAddress=function(appState, addressTxt) {
    if(appState.addressField!=null) {
        appState.mymap.removeControl(appState.addressField);
    }
    if(addressTxt==null) return;
    var beautiAddressTxt=addressTxt.replace(",","<br/>").replace(",","<br/>").replace(",","<br/>");
    appState.addressField=L.control.custom({
        position: 'bottomright',
        content : '<div class="mapAdressBox"> <a href="https://www.google.com/maps/place/'+encodeURI(addressTxt)+'" target="_blank">'+beautiAddressTxt+'</a> </div>',
        style   :
        {
        }
    });
    appState.addressField.addTo(appState.mymap);
}


export default Map;