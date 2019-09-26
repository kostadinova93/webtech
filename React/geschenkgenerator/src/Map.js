import React from 'react'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import $ from 'jquery';
import Geo from './Helper/Geo'
import MapHelper from './Helper/Map'
import LC from "leaflet-control-custom"

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        
    }

    componentDidMount() {
        var mymap = L.map('map').setView([51.505, -0.09], 13);
        this.props.appState.mymap=mymap;

        L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',  {
            attribution: '',
            maxZoom: 18
        }).addTo(mymap);

        L.control.custom({
            position: 'bottomleft',
            content : '<button type="button" class="closemap">     X Close Map </button>',
            style   :
            {
                margin: '10px',
                padding: '0px 0 0 0',
                cursor: 'pointer',
            },
            events:
            {click: function(data){
                    MapHelper.closeMap(this.props.appState);
            }.bind(this)
            }
        })
        .addTo(mymap);

        var rm=L.Routing.control({
            waypoints: [],
            routeWhileDragging: true
        });
        rm.addTo(this.props.appState.mymap);
        this.props.appState.activeRoutingMachine=rm;


        $(document).ready(function() {
           // $("#map").height($(window).height()).width($(window).width());
           // mymap.invalidateSize();
        });
        
        mymap.on('click', function(e) {
            if($("#lat").length) {
                $("#lat").val(e.latlng.lat);
                $("#lon").val(e.latlng.lng);
                MapHelper.closeMap(this.props.appState);
            }
        }.bind(this));

        Geo.getAndRequestUserCoordinates(this.props.appState, function (geoobject) {
            
            this.forceUpdate();
        }.bind(this));

    }

    render() {
        return (
            <div>
                <div id="map" style={{display: "none", width: "100%"}}></div>
            </div>

        );
    }
}


export default Map; 