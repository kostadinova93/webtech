import React from 'react'
import Idea from './Idea/Idea';
import Map from './Map';
import Wishlist from './Wishlist';
import Wishlistmanager from './Helper/Wishlistmanager';
import Geo from './Helper/Geo'

class Wishview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};


        this.ideas = [];
        this.nextIdea = this.nextIdea.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.loadWishedIdeas = this.loadWishedIdeas.bind(this);
    }

    nextIdea(slice = true) {
        if (this.ideas.length == 0) return;
        if (slice) this.ideas = this.ideas.slice(1, this.ideas.length);
        this.forceUpdate();
        //document.getElementById("idea_"+this.ideas[0].id).style.display = "block";
    }

    componentDidUpdate() {

    }

    componentDidMount() {
        this.loadWishedIdeas();
    };



    loadWishedIdeas(tagwords) {
        if (Wishlistmanager.getWishes() == null) {
            this.ideas = [];
            this.forceUpdate();
            return;
        }
        var url = 'https://api.merik.now.sh/api/getideas?';
        url += '&whitelist=' + JSON.stringify(Wishlistmanager.getWishes());
        var location = Geo.getUserCoordinates();
        if (location != null) url += "&lat=" + location.lat + "&lon=" + location.lon;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.ideas = json;
                        this.forceUpdate();
                    });
                }
            });
    }

    handleClick() {

    }

    render() {
        var c = 0;
        let ideaComponent = this.ideas.map((x, index) => (
            <div>
            <Idea changeSiteview={this.props.changeSiteview}  disableAdd={true} disableLike={true} loadWishedIdeas={this.loadWishedIdeas} appState={this.props.appState} idea={x} hidden={false} />
            <br/>
            <br/>
            </div>
        ));
        if (this.ideas.length == 0) {
            ideaComponent = (<div>
                Hier wirst du alle Geschenkideen finden, die du dir gemerkt hast
                    <br />
                <br />
                <b>
                    <a href="/">Starte die Suche!</a>
                </b>
            </div>);
        }
        return (
            <div className="centerbox center">
                <h2>
                    Deine Wunschliste
                </h2>
                {ideaComponent}
                
            </div>
            // 
        );
    }
}


export default Wishview;