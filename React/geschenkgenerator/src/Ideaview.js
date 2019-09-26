import React from 'react'
import Idea from './Idea/Idea';
import Map from './Map';
import Wishlist from './Wishlist';
import StartMessage from './StartMessage';
import Geo from './Helper/Geo'
import MapHelper from './Helper/Map'
import { bounce } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import $ from 'jquery'
import Wishlistmanager from './Helper/Wishlistmanager';
import Cookies from './Helper/Cookies';

class Ideaview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.gotDatas = false;
        this.ideas = [];
        this.nextIdea = this.nextIdea.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.loadWithFilter = this.loadWithFilter.bind(this);
    }

    nextIdea(slice = true, animation = null) {
        if (this.ideas.length == 0) return;

        if (animation != null) {
            $("#" + "idea_" + this.ideas[0].id).animate({ "left": ((animation == "right" ? 1 : 0) * $(document).width()), "opacity": "0" },
                {
                    duration: 500, complete: function () {
                        $(this).css("left", "0")
                    }
                });

        } else {
            //   $("#" + "idea_" + this.ideas[0].id).fadeOut("fast");
        }
        if (slice) this.ideas = this.ideas.slice(1, this.ideas.length);
        if (this.ideas.length == 0) {
            this.forceUpdate();
        } else {
            $("#" + "idea_" + this.ideas[0].id).fadeIn("slow", function () {

            });
        }
        MapHelper.closeMap(this.props.appState);

        //document.getElementById("idea_"+this.ideas[0].id).style.display = "block";
    }


    componentDidMount() {

        this.loadWithFilter();
    };



    loadWithFilter() {
        this.gotDatas = false;
        var url = 'https://api.merik.now.sh/api/getideas?';
        if (this.props.tagwords && this.props.tagwords.length > 0) {
            url += '&filter=' + JSON.stringify(this.props.tagwords);
        }
        var location = Geo.getUserCoordinates();
        if (location != null) url += "&lat=" + location.lat + "&lon=" + location.lon;

        if (Cookies.getSeenIds() != null) {
            url += '&blacklist=' + JSON.stringify(Cookies.getSeenIds());
        }
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.ideas = json;
                        this.nextIdea(false);
                        this.gotDatas = true;
                        this.forceUpdate();

                    });
                }
            });
    }

    handleClick() {

    }

    render() {
        if (this.gotDatas == false) {
            return null;
        }

        if (this.props.tagwords.length > 0) {
            if (this.ideas.length > 0) {
                let ideaComponent = this.ideas.map((x, index) => (
                    <Idea changeSiteview={this.props.changeSiteview} addTagword={this.props.addTagword} appState={this.props.appState} idea={x} hidden={(index != 0 && 2 == 2)} nextIdea={this.nextIdea} />
                ));
                return (
                    <div className="centerbox center" style={{ minHeight: "600px" }} >
                        {ideaComponent}
                    </div>
                );

            } else {

                let wishlistMessage = Wishlistmanager.getWishesCount() == null ? null : (
                    <div>
                        <br />
                        Schau dir deine gelikten Ideen an: {" "}
                        <a href="#" onClick={() => { this.props.changeSiteview("Wishlist") }}>
                            Wunschliste
                        </a>
                        <br />
                    </div>
                );

                let clearSeenMessage = Cookies.getSeenIds() == null ? null : (
                    <div>
                        <br />
                        Oder lösche deine History:  {" "}
                        <a href="#" onClick={() => { Cookies.clearSeenIds(); this.props.addTagword(""); this.props.changeSiteview("start", false) }}>
                            Neustart
                        </a>
                        <br />
                    </div>
                );

                return (
                    <div className="centerbox center" >

                        <h3>
                            Och, jetzt habe ich auch keine Idee mehr
                    </h3>
                        {wishlistMessage}
                        {clearSeenMessage}
                        <br />
                        Versuche doch einen anderen Filter!
                    </div>
                );
            }

        } else {

            return (
                <div className="centerbox center">
                    <StartMessage appState={this.props.appState} />
                </div>
                // 
            );
        }

    }
}


export default Ideaview;