import React from 'react'
import Cookies from './Helper/Cookies'
import Wishlistmanager from './Helper/Wishlistmanager'

class Header extends React.Component {
    constructor(props) {
        super(props);

    }


    componentDidMount() {

    }

    render() {
        let loginlink = (<li><a  className="whitelink" href="#" onClick={() => { this.props.changeSiteview("Userlogin") }}>Login</a></li>);
        if (Cookies.getCookie("username") != "null" && Cookies.getCookie("username") != null) {
            loginlink = (<li className="inline-block">
                <a  className="whitelink" href="#" onClick={() => { this.props.changeSiteview("Addidea") }}> Hinzufügen</a> {" / "}
                <a  className="whitelink" href="#" onClick={() => { Cookies.setCookie("username", null, 0); this.props.changeSiteview("start"); }}>Logout {"("+Cookies.getCookie("username")+")"}</a>
            </li>
            );
        }

        let wishlink=null;
        wishlink=(<li><a  className="whitelink" href="#" onClick={() => { this.props.changeSiteview("Wishlist") }}>Wunschliste (<div className="inline" id="wishlist_counter">{Wishlistmanager.getWishesCount()}</div>)</a></li>);
        

        return (
            <ul id="steuerung">
                <li><a className="whitelink" onClick={() => { this.props.changeSiteview("start") }} id="kopflogo" href="#" style={{ display: "" }}>
                    <img id="headerlogo" src="logo_small.png" alt="logo"></img></a></li>
                <div style={{ float: "right", display: "inline", paddingTop: "4px" }}>
                    {wishlink}
                    {loginlink}
                </div>
            </ul>
        );
    }
}


export default Header;