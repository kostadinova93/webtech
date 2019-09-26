import React, { Component } from 'react'
import Cookies from '../Helper/Cookies'
import ValidateForm from '../Helper/ValidateForm'
import Map from '../Helper/Map';
import $ from 'jquery'
import AddressField from './AddressField'

class AddShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.addShop = this.addShop.bind(this);
        this.loadShop = this.loadShop.bind(this);
        this.deleteShop = this.deleteShop.bind(this);
        this.allShops = [];
        this.modifyShop = null;

        this.addError = "";

    }


    loadShop(name) {
        var selectedShop = this.allShops.find(x => x.name == name);
        if (selectedShop == null) {
            if (name == "[Create new]") {
                $("#name").val("");
                $("#description").val("");
                $("#pricelvl").val("");
                $("#link").val("");
                $("#image").val("");
                $("#lat").val("");
                $("#lon").val("");
                $("#address").val("");
            }
            this.modifyIdea = null;
        } else {
            $("#name").val(selectedShop.name);
            $("#description").val(selectedShop.description);
            $("#pricelvl").val(selectedShop.pricelvl);
            $("#link").val(selectedShop.link);
            $("#image").val(selectedShop.image);
            $("#lat").val(selectedShop.lat);
            $("#lon").val(selectedShop.lon);
            $("#address").val(selectedShop.address);
            this.modifyShop = selectedShop;
        }
        this.forceUpdate();

    }


    deleteShop() {
        var permissionSuffix = Cookies.getPermissionSuffix();
        var url = 'https://api.merik.now.sh/api/deleteshop?id=' + this.modifyShop.id + permissionSuffix;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                window.location.reload(false);
            });
    }

    componentDidMount() {
        fetch('https://api.merik.now.sh/api/loadshops', {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.allShops = json;
                        this.forceUpdate();
                    });
                }
            });
    };


    addShop() {
        if (($("#lat").val().length > 0 && $("#address").val().length == 0) || ($("#address").val().length > 0 && $("#lat").val().length == 0)) {
            alert("Set coordinates AND adress or leave BOTH empty");
            return;
        }

        var permissionSuffix = Cookies.getPermissionSuffix();
        var formUrlCollect = ValidateForm.collectAndValidate("url");
        if (formUrlCollect.valid == false) {
            alert("Error in form: \n" + JSON.stringify(formUrlCollect.result));
            return;
        }

        var mode = this.modifyShop == null ? "addshop" : "updateshop";
        var url = 'https://api.merik.now.sh/api/' + mode + '?=' + permissionSuffix + formUrlCollect.result + (this.modifyShop == null ? "" : "&id=" + this.modifyShop.id);

        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.text().then(x => {
                        if (x == "success") {

                            window.location.reload(false);

                        } else {
                            this.addError = x;
                            Cookies.setCookie()
                            this.forceUpdate()
                        }
                    });
                }
            });

    }

    render() {
        let removeButton = this.modifyShop == null ? null : (<button onClick={this.deleteShop}> Remove shop</button>);

        let seeShopLink =this.modifyShop==null? null :(<a href="#" onClick={()=>{this.props.changeSiteview("Shop", true, "&shop="+this.modifyShop.name) }} >See Shop</a>);

        return (
            <div className="centerbox">


                <table>
                    <tbody>
                        <tr>
                            <td>
                                <b>
                                    Add shop
                                </b>
                            </td>
                            <td className="alignright">
                                <a href="#" onClick={() => { this.props.changeSiteview("Addidea") }}>
                                    Add idea
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Mode
                    </td>
                            <td>
                                <select onChange={(e) => { this.loadShop(e.target.value) }}>
                                    <option> [Create new]</option>
                                    <option> [Copy]</option>
                                    {this.allShops.map(x => (<option >{x.name}</option>))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td>
                            {seeShopLink}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Name:
                    </td>
                            <td>
                                <input className="formField" fieldType="text" allowEmpty="false" placeholder="" id="name" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description:
                    </td>
                            <td>
                                <input className="formField" minLength="3" fieldType="text" placeholder="" id="description" />
                            </td>
                        </tr>
                        <AddressField appState={this.props.appState} />

                        <tr>
                            <td>
                                Price Level (0-3):
                    </td>
                            <td>
                                <input className="formField" fieldType="double" placeholder="" id="pricelvl" />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Link:
                    </td>
                            <td>
                                <input className="formField" fieldType="link" placeholder="" id="link" />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Image:
                    </td>
                            <td>
                                <input className="formField" fieldType="link" placeholder="" id="image" />
                            </td>
                        </tr>

                    </tbody>
                </table>

                <br />
                <br />
                <div className="center">
                    <button onClick={this.addShop}>
                        Add shop!
                                </button>

                    <br />
                    <br />
                    {removeButton}
                </div>

                <div className="center">
                    {this.addError}
                </div>

            </div>
        );
    }
}


export default AddShop;