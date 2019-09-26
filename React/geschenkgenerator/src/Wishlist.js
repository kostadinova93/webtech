import React, { Component } from 'react'
import Wishlistmanager from './Helper/Wishlistmanager'

class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.deleteWishlistEntry = this.deleteWishlistEntry.bind(this);
    }
    deleteWishlistEntry(id) {
        Wishlistmanager.removeWish(id);
        this.forceUpdate();
    }
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        let wishlistEntries = Wishlistmanager.getWishes().map(x => (
            <tr>
                <td>
                    <button onClick={() => { this.deleteWishlistEntry(x.id) }}>
                        X
                    </button>
                </td>
                <td>
                    <a href={x.link}>
                        {x.name}
                    </a>
                </td>
                <td>
                    {x.price}€
                </td>
            </tr>
        ));
        return (
            <table>
                <tbody>
                    {wishlistEntries}
                </tbody>
            </table>
        );
    }
}


export default Wishlist;