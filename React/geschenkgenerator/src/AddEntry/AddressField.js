import React, { Component } from 'react'
import Map from '../Helper/Map'
import Geo from '../Helper/Geo'
import $ from 'jquery'

class AddressField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.setAddressFromCoords = this.setAddressFromCoords.bind(this);
        this.setCoordsFromAddress = this.setCoordsFromAddress.bind(this);
        this.showMap = this.showMap.bind(this);

    }

    showMap() {
        if ($("#lat").val().length > 3 && $("#lon").val().length > 3) {
            Map.addMarker(this.props.appState, $("#lat").val(), $("#lon").val(), "Lat/Lon");
        }
        Map.showMap(this.props.appState);
    }

    setAddressFromCoords() {
        var coordsAddress = $("#lat").val() + " " + $("#lon").val();
        Geo.getLocationFromAddress(coordsAddress, this.props.appState, false, function (geojson) {
            $("#address").val(geojson.name);
        })
    }
    setCoordsFromAddress() {
        var coordsAddress = $("#address").val();
        Geo.getLocationFromAddress(coordsAddress, this.props.appState, false, function (geojson) {
            $("#lat").val(geojson.lat);
            $("#lon").val(geojson.lon);
        })
    }

    render() {
        return (
            <div className="inline">
                <tr>
                    <td>
                        Address:
            <br />
                        <a className="small" href="#" onClick={this.setAddressFromCoords}>From coords</a>
                    </td>
                    <td>
                        <input className="formField" fieldType="address" placeholder="" id="address" />
                    </td>
                </tr>
                <tr>
                    <td>
                        Lat/Lon:
            <br />
                        <a className="small" href="#" onClick={this.showMap}>Show map</a>
                        <br />
                        <a className="small" href="#" onClick={this.setCoordsFromAddress}>From address</a>
                    </td>
                    <td>
                        <input className="formField" fieldType="double" style={{ width: "90px" }} placeholder="" id="lat" />
                        <input className="formField" fieldType="double" style={{ width: "90px" }} placeholder="" id="lon" />
                    </td>
                </tr>
            </div>
        );
    }
}


export default AddressField;