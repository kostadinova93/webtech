import React, { Component } from 'react'

class PreviewLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  componentDidMount() {
  }
  
  render() {
    var idea=this.props.idea;
    var price;
    let whereToBuy=null;
    var shopAvaible=idea.nearestShop!=null;
    var realShopAvaible=idea.nearestShop!=null && idea.nearestShop.distance!=null;
    
    if(shopAvaible==false) {
        price=idea.priceNice;
        whereToBuy=(<a href={idea.link} target="_blank">online</a>);
    } else if(realShopAvaible==false) {
        price=idea.nearestShop.ideaPriceNice;
        whereToBuy=(<a href={idea.nearestShop.ideaLink} target="_blank">online</a>);
    } else {
        price=idea.nearestShop.ideaPriceNice;
        whereToBuy=(<div className="inline"> u.a. <a href="#" onClick={()=>{this.props.changeSiteview("Shop", true, "&shop="+idea.nearestShop.name) }}>{idea.nearestShop.distance.toFixed(0)}km entfernt </a></div>);
    }

    return (
      <div onClick={this.props.switchPreview}>
        Ab
        <b>{" "+price+"€ "}</b>
        {whereToBuy}{" "}
        
        <br/>
        <br/>
        <a href="#">Mehr..</a>
        
      </div>
    );
  }
}


export default PreviewLink;