import React, { Component } from 'react'
import Idea from './Idea/Idea';
import Map from './Helper/Map'
import Geo from './Helper/Geo'

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.activeShop = null;
        this.activeIdeas = [];

        this.loadShopIdeas=this.loadShopIdeas.bind(this);
        this.showMap=this.showMap.bind(this);
    }

    componentDidMount() {
        var url = 'https://api.merik.now.sh/api/getshop?name=' + encodeURI(this.props.shopName);
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.activeShop = json;
                        this.loadShopIdeas();
                        
                    });
                }
            });
    }


    loadShopIdeas() {
        
        var url = 'https://api.merik.now.sh/api/getideas?';
        url += '&whitelist=' + JSON.stringify(this.activeShop.ideasIds);
        var location = Geo.getUserCoordinates();
        if (location != null) url += "&lat=" + location.lat + "&lon=" + location.lon;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.activeIdeas = json;
                        this.forceUpdate();
                    });
                }
            });
    }

    showMap() {

        Map.addMarker(this.props.appState, this.activeShop.lat, this.activeShop.lon, this.activeShop.name, "red", this.activeShop.address);
        Map.showMap(this.props.appState);
    }

    render() {

        if (this.activeShop == null) return null;

        let ideaComponent = this.activeIdeas.map((x, index) => (
            <div>
                <Idea changeSiteview={this.props.changeSiteview}  disableAdd={true} disableLike={true} loadWishedIdeas={this.loadWishedIdeas} appState={this.props.appState} idea={x} hidden={false} />
                <br />
                <br />
            </div>
        ));

        let link=this.activeShop.link==null? null : (<div> <a href={this.activeShop.link} target="_blank"> Webseite</a></div>);

        let mapLink=this.activeShop.address==null? null : (<div> {this.activeShop.address} <br/><a href="#" onClick={this.showMap} > (Karte)</a></div>);

        return (
            <div className="centerbox center">
                <h2>
                    {this.activeShop.name}
                </h2>
                <img id="ideaimage" src={this.activeShop.image} ></img>
                {this.activeShop.description}
                <br />
                {link}
                <br />
                {mapLink}
                <br />
                {/* Price level: {this.activeShop.pricelvl} */}
                <br />
                <br />
                <br />

                <h2>Zugeordnet ({this.activeIdeas.length}):</h2>

                {ideaComponent}
            </div>
        );
    }
}


export default Shop;