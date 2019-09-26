import React, { Component } from 'react'

class ShopLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  componentDidMount() {
  }

  render() {
    var idea = this.props.idea;
    var offerList = [];
    var shopAvaible = idea.nearestShop != null;

    if (shopAvaible == false) {
      offerList = (<div>Ab {idea.priceNice}€ <a href={idea.link} target="_blank">online</a></div>);
    } else {
      for (var i = 0; i < idea.shops.length; i++) {
        let curShop = idea.shops[i];
        var newOffer = null;

        if (curShop.distance == null) {
          if (curShop.link != null) {
            newOffer = (<div><a href="#" onClick={()=>{this.props.changeSiteview("Shop", true, "&shop="+curShop.name) }}> {curShop.name}</a><a href={curShop.link} target="_blank"> (Webseite)</a>: Ab {curShop.ideaPriceNice}€  <a href={curShop.ideaLink} target="_blank">online</a></div>);
          } else {
            newOffer = (<div><a href="#" onClick={()=>{this.props.changeSiteview("Shop", true, "&shop="+curShop.name) }}> {curShop.name}</a>: Ab {curShop.ideaPriceNice}€  <a href={curShop.ideaLink} target="_blank">online</a></div>);
          }
        } else {
          newOffer = (<div className="inline">
            <a href="#" onClick={()=>{this.props.changeSiteview("Shop", true, "&shop="+curShop.name) }}> {curShop.name}</a> <a href={curShop.ideaLink} target="_blank"> (Webseite)</a>: Ab {curShop.ideaPriceNice}€
            <div className="small padding-top7px">
              {curShop.distance.toFixed(0)}km entfernt
            <a href="#" onClick={() => {
                this.props.showLocationOnMap(curShop.lat, curShop.lon, "Shop: " + curShop.name, curShop.address)
              }}> (Karte)</a>
            </div>
            <br />
          </div>);
        }
        offerList.push(newOffer);
      }
    }

    return (
      <div>
        {offerList}
      </div>
    );
  }
}


export default ShopLinks;