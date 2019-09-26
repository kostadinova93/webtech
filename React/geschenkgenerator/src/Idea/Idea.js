import $ from 'jquery'
import React from 'react'
import Cookies from '../Helper/Cookies'
import Wishlistmanager from '../Helper/Wishlistmanager'
import Map from '../Helper/Map';
import ReactDOM from 'react-dom';
import Swipe from 'react-easy-swipe';
import PreviewLink from './PreviewLink';
import ShopLinks from './ShopLinks';
import Tagword from '../Searchfield/Tagword';

class Idea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.showPreviewBuy=true;
        // This binding is necessary to make `this` work in the callback
        this.submitVote = this.submitVote.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.clickLike = this.clickLike.bind(this);
        this.clickDislike = this.clickDislike.bind(this);
        this.switchPreview = this.switchPreview.bind(this);

        this.showLocationOnMap = this.showLocationOnMap.bind(this);
        this.clickSubmitEdit = this.clickSubmitEdit.bind(this);
    }
    submitVote(id, like) {
        var url = 'https://api.merik.now.sh/api/addvote?like=' + like + "&id=" + id;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    if (response == "success") {

                    }
                }
            });
    }

    showLocationOnMap(lat, lon, text, address) {
        Map.addMarker(this.props.appState, lat, lon, text, "red", address);
        Map.showMap(this.props.appState);
    }

  

    submitEdit(id, like) {
        var permissionSuffix = Cookies.getPermissionSuffix();
        var name = document.getElementById("edit_name").value || this.props.idea.name;
        var description = document.getElementById("edit_description").value || this.props.idea.description;
        var image = document.getElementById("edit_image").value || this.props.idea.image;
        var link = document.getElementById("edit_link").value || this.props.idea.link;
        var price = document.getElementById("edit_price").value || this.props.idea.price;

        var url = 'https://api.merik.now.sh/api/updateidea?id=' +
            this.props.idea.id + "&name=" + name + "&description=" + description + "&image=" + image + "&link=" + link + "&price=" + price + permissionSuffix;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    if (response == "success") {

                    }
                }
            });
    }

  

    clickSubmitEdit() {
        this.submitEdit();
        alert("Applied modification");
        this.props.nextIdea();
    }

    clickLike() {
        if (this.props.disableLike) return;
        Wishlistmanager.addWish(this.props.idea.id);
        Cookies.rememberSeenIds(this.props.idea.id);
        this.submitVote(this.props.idea.id, 1);
        this.props.nextIdea(true, "right");

    }
    clickDislike() {
        if (this.props.disableLike) return;
        Wishlistmanager.removeWish(this.props.idea.id);
        Cookies.rememberSeenIds(this.props.idea.id);
        this.submitVote(this.props.idea.id, 0);
        this.props.nextIdea(true, "left");
    }
    handleClick() {

    }
    switchPreview() {
        if(this.showPreviewBuy==false) return;

        this.showPreviewBuy=false;
        this.forceUpdate();
    }

    componentDidMount() {
       // window.scrollTo(0, 0)
      }

    render() {
        let buyBox = this.showPreviewBuy && this.props.disableLike!=true ? (<PreviewLink changeSiteview={this.props.changeSiteview}  switchPreview={this.switchPreview} idea={this.props.idea} />) :
         (<ShopLinks changeSiteview={this.props.changeSiteview} showLocationOnMap={this.showLocationOnMap} idea={this.props.idea} />);

        let showIdeaOnMap = this.props.idea.distance == null ? null : (
            <div className="small">
                ({this.props.idea.distance.toFixed(0)}km entfernt -  {" "}
                <a href="#" onClick={() => { this.showLocationOnMap(this.props.idea.lat, this.props.idea.lon, this.props.idea.name, this.props.idea.address) }}>
                    Karte
                </a>
                )
            </div>
        );

        let likeButtons = this.props.disableLike ? (
            <div className="center">
                <button onClick={() => { Wishlistmanager.removeWish(this.props.idea.id); this.props.loadWishedIdeas() }}>
                    Vergessen
                </button>
            </div>
        ) :
            (
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: "20%" }}>
                                <button onClick={() => { this.clickDislike() }}>
                                    {"< "} Dislike
                                </button>
                            </td>
                            <td style={{ width: "20%" }}>
                                <button onClick={() => { this.clickLike() }}>
                                    Like {" >"}
                                </button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            );
        
        if(this.props.disableLike && this.props.loadWishedIdeas==null) likeButtons=null;

        let tagcollection = this.showPreviewBuy ==true ? null:(<div>Tags: { this.props.idea.tags.map((x, index) => (
            <a href="#" className="" onClick={() => {if(this.props.addTagword!=null) this.props.addTagword(x.name) }} className="small inline">{(index == 0 ? "" : " | ") + x.name}</a>
        ))}</div>) ;


        return (
            <Swipe
                onSwipeLeft={this.clickDislike}
                onSwipeRight={this.clickLike}
                onClick={this.switchPreview}
            >

                <div id={"idea_" + this.props.idea.id} onClick={this.handleClick} className={(this.props.disableLike ? "" : "ideacard") + " center  " + (this.props.hidden == true ? "hidden " : "")} >
                    <div className={this.props.disableLike ? "" : "innerIdeacard"}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="normal">
                                        <h3 >
                                            {this.props.idea.name}
                                        </h3>
                                        {showIdeaOnMap}
                                    </td>
                                 
                                </tr>
                                <tr >
                                    <td className="normal">
                                        <img id="ideaimage" src={this.props.idea.image} ></img>
                                    </td>
                                   
                                </tr>
                                <tr >
                                    <td className="normal">
                                        {this.props.idea.description}
                                    </td>
                                    
                                </tr>
                                <br />
                                <tr className="">
                                    <td className="normal">
                                        {buyBox}
                                    </td>
                                  
                                </tr>
                               
                            </tbody>
                        </table>
                        <br/>
                        <div className="paddingTop7px">
                            
                            {tagcollection}
                        </div>
                        <br />
                        {likeButtons}
                    </div>
                </div>
            </Swipe>
        );
    }
}


export default Idea;