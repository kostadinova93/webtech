import React from 'react';
import './App.css';
import './styles/style.css';
import Header from './Header.js';
import Footer from './Footer.js';
import Searchfield from './Searchfield/Searchfield';
import Ideaview from './Ideaview';
import Userlogin from './Userlogin';
import Addidea from './AddEntry/Addidea';
import AddShop from './AddEntry/AddShop';
import Map from './Map';
import MapHelper from './Helper/Map';
import Contact from './Contact';
import Shop from './Shop';
import Wishview from './Wishview';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.ideaviewRef = React.createRef();
    this.addTagword = this.addTagword.bind(this);
    this.deleteTagword = this.deleteTagword.bind(this);
    this.updateIdeasView = this.updateIdeasView.bind(this);
    this.changeSiteview = this.changeSiteview.bind(this);
    this.getCurrentSiteFromUrl = this.getCurrentSiteFromUrl.bind(this);
    this.getCurrentTagsFromUrl = this.getCurrentTagsFromUrl.bind(this);
    this.getCurrentShopFromUrl = this.getCurrentShopFromUrl.bind(this);
    this.tagwords = this.getCurrentTagsFromUrl();
    this.currentShopName = this.getCurrentShopFromUrl();
    var startSite = this.getCurrentSiteFromUrl();


    this.state = { site: startSite, markers: [] };
    window.onpopstate = function (event) {
      var curSite = this.getCurrentSiteFromUrl();
      if (this.state.site != curSite || this.getCurrentTagsFromUrl().length != this.tagwords.length) {
        this.tagwords = this.getCurrentTagsFromUrl();
        this.currentShopName = this.getCurrentShopFromUrl();

        this.changeSiteview(curSite, false);
        if(this.ideaviewRef.current!=null) {
         this.ideaviewRef.current.loadWithFilter();
        }
      }
    }.bind(this);
  }


  getCurrentSiteFromUrl() {
    var curSite = "Start";
    if (window.location.href.includes("page=")) curSite = window.location.href.split("page=")[1].split("#")[0].split("&")[0];
    return curSite;
  }

  getCurrentTagsFromUrl() {
    var tags = [];
    if (window.location.href.includes("tags=")) tags = JSON.parse(decodeURI(window.location.href.split("tags=")[1].split("#")[0].split("&")[0]));
    return tags;
  }

  getCurrentShopFromUrl() {
    var shopName = "";
    if (window.location.href.includes("shop=")) shopName =  decodeURI(window.location.href.split("shop=")[1].split("#")[0].split("&")[0]);
    return shopName;
  }



  changeSiteview(newname, clearTags = true, addition="") {
    if (clearTags) this.tagwords = [];


    if (newname == "start") newname = "Start";

    var logUrl = "/";
    if (newname != "" && newname != "Start") {
      logUrl += "?page=" + newname;
    }
    logUrl+=addition;

    if (this.tagwords.length > 0) logUrl += "&tags=" + JSON.stringify(this.tagwords);
    window.history.pushState(newname, newname, logUrl);
        this.currentShopName = this.getCurrentShopFromUrl();


    this.state.site = newname;
    MapHelper.closeMap(this.state);
    this.forceUpdate();
  }

  addTagword(neword) {
    if (this.tagwords.includes(neword) == false) {
      if (neword.length > 2) {
        this.tagwords.push(neword);
        window.history.pushState(this.state.site, this.state.site, "/page=" + this.state.site + "&tags=" + JSON.stringify(this.tagwords));
      }
      this.updateIdeasView();
    }
  }

  deleteTagword(tag) {
    this.tagwords = this.tagwords.filter(x => x != tag);
    window.history.pushState(this.state.site, this.state.site, "/page=" + this.state.site + "&tags=" + JSON.stringify(this.tagwords));
    this.updateIdeasView();
  }

  updateIdeasView() {
    this.ideaviewRef.current.loadWithFilter();
    this.forceUpdate();
  }

  render() {
    var contentbox = {};
    if (this.state == null || this.state.site == "Start") {

      contentbox = (
        <div className="centerbox" >
          <Searchfield addTagword={this.addTagword} deleteTagword={this.deleteTagword} tagwords={this.tagwords} updateIdeasView={this.updateIdeasView} />
          <br />
          <Ideaview goneBack={this.goneBack} changeSiteview={this.changeSiteview} appState={this.state} addTagword={this.addTagword} ref={this.ideaviewRef} tagwords={this.tagwords} />
          <Map appState={this.state} />
        </div>
      );


    } else if (this.state.site == "Userlogin") {
      contentbox = (
        <div>
          <Userlogin changeSiteview={this.changeSiteview} />
        </div>
      );

    } else if (this.state.site == "Addidea") {
      contentbox = (
        <div>
          <Addidea appState={this.state} changeSiteview={this.changeSiteview} />
          <Map appState={this.state} />

        </div>
      );

    }else if (this.state.site == "AddShop") {
      contentbox = (
        <div>
          <AddShop appState={this.state} changeSiteview={this.changeSiteview} />
          <Map appState={this.state} />

        </div>
      );

    } else if (this.state.site == "Wishlist") {
      contentbox = (
        <div>
          <Wishview appState={this.state} changeSiteview={this.changeSiteview} />
          <Map appState={this.state} />

        </div>
      );

    }
    else if (this.state.site == "Impressum") {
      contentbox = (
        <div>
          <Contact changeSiteview={this.changeSiteview} />
        </div>
      );

    }
    else if (this.state.site == "Shop") {
      contentbox = (
        <div>
          <Shop appState={this.state}  shopName={this.currentShopName} changeSiteview={this.changeSiteview} />
          <Map appState={this.state} />

        </div>
      );

    }

    /*
  <div id="kopf">
          <a href="#" onClick={()=> {this.changeSiteview("start")}}>
            <img  src="logo.png" alt="logo" id="logo"></img>
          </a>
        </div>
    */

    return (
      <div>
        <Header appState={this.state} changeSiteview={this.changeSiteview} />

        {contentbox}

        <br />
        <Footer changeSiteview={this.changeSiteview} />
      </div>
    );
  }
}

export default App;
