import React, { Component } from 'react'
import Cookies from "./Helper/Cookies";
import Geo from "./Helper/Geo";
import $ from 'jquery'

class StartMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.getLocationFromAddress = this.getLocationFromAddress.bind(this);

    }


    getLocationFromAddress() {
        Geo.getLocationFromAddress($("#useraddress").val(), this.props.appState, true,
            function () { this.forceUpdate() }.bind(this));
    }

    render() {
        let locationDisplay = Geo.getUserCoordinates() == null ? (
            <div>
                Damit wir dir wortwörtlich nahe liegende Ideen anzeigen können, gebe bitte (d)einen Standort ein:
                <br />
                
                <input onKeyDown={(e)=> {if (e.key === 'Enter') this.getLocationFromAddress();}} id="useraddress" type="text" placeholder="Dein Standort"></input>
                <button className="inline" onClick={this.getLocationFromAddress}>
                    Senden!
                </button>
                <button className="inline" onClick={() => {
                    Geo.getAndRequestUserCoordinates(this.props.appState, function () {

                        if (arguments[0] == "locationerror") alert("GPS Lokalisierung blockiert vom Browser")
                        this.forceUpdate()
                    }.bind(this))
                }}>
                    GPS nutzen
                </button>
            </div>
        ) : (
                <div>
                    <div>
                    Dir werden Ideen für folgenden Standort angezeigt:
                    </div>
                    <b className="paddingTop10px">
                    {Geo.getUserCoordinates().name}
                    </b>
                    <br />
                    <a href="#" onClick={() => { Geo.deleteUserCoordinates(); this.forceUpdate() }}>
                        (Entfernen)
                    </a>

                </div>
            );

        return (
            <div id="startmessage">
                <h2>
                    Willkommen auf naheGeschenkideen!
                 </h2>
                Finde passende persönliche Geschenkideen in deiner Nähe!
                <br/>
                <br/>
                Egal, ob Erlebnis oder kreative Tee-Sammlung - 
                <br/>
                mit Hilfe unsere Filter findest du das, was Freude verbreitet!
                <br />
                <br />
                {locationDisplay}
                <br />
                <br />
                Zum <b>Starten</b> füge oben einen Filter hinzu!
            </div>
        );
    }
}


export default StartMessage;