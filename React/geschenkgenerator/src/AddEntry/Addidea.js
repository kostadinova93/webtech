import React, { Component } from 'react'
import Cookies from '../Helper/Cookies'
import ValidateForm from '../Helper/ValidateForm'
import Map from '../Helper/Map';
import ShopSelection from './ShopSelection';
import $ from 'jquery'
import AddressField from './AddressField'


class Addidea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.addIdea = this.addIdea.bind(this);
        this.deleteIdea = this.deleteIdea.bind(this);
        this.loadIdea = this.loadIdea.bind(this);
        this.categories = [];
        this.tags = [];
        this.addError = "";
        this.allIdeas = [];
        this.selectedShops = [];
        this.modifyIdea = null;
    }

    loadIdea(name) {
        var selectedIdea = this.allIdeas.find(x => x.name == name);
        if (selectedIdea==null) {
            if(name == "[Create new]") {
                $("#name").val("");
                $("#description").val("");
                $("#price").val("");
                $("#link").val("");
                $("#image").val("");
                $("#lat").val("");
                $("#lon").val("");
                $("#tags").val("");
                $("#address").val("");
                this.selectedShops = [];
            }
            this.modifyIdea = null;
        } else {
            $("#name").val(selectedIdea.name);
            $("#description").val(selectedIdea.description);
            $("#price").val(selectedIdea.price);
            $("#link").val(selectedIdea.link);
            $("#image").val(selectedIdea.image);
            $("#lat").val(selectedIdea.lat);
            $("#lon").val(selectedIdea.lon);
            $("#address").val(selectedIdea.address);
            $("#tags").val(selectedIdea.tags.map(x => x.name).join(", ") + ", ");
            this.modifyIdea = selectedIdea;
            this.selectedShops = selectedIdea.shops.map(x => ({ id: x.id, name: x.name, price: x.ideaPrice, link: x.ideaLink }));
        }
        this.forceUpdate();

    }

    componentDidMount() {
        fetch('https://api.merik.now.sh/api/loadfilter', {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        var tagArray = [];
                        json.forEach(x => {
                            x.tags.forEach(y => {
                                tagArray.push(x.name + "|" + y.name);
                            });
                        });

                        this.categories = json;
                        this.forceUpdate();
                    });
                }
            });

        fetch('https://api.merik.now.sh/api/loadideas', {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        this.allIdeas = json;
                        this.forceUpdate();
                    });
                }
            });
    };


    deleteIdea() {
        var permissionSuffix = Cookies.getPermissionSuffix();
        var url = 'https://api.merik.now.sh/api/deleteidea?id=' + this.modifyIdea.id + permissionSuffix;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                window.location.reload(false); 
            });
    }

    addIdea() {
        if(($("#lat").val().length>0 && $("#address").val().length==0 ) || ($("#address").val().length>0 && $("#lat").val().length==0 )) {
            alert("Set coordinates AND adress or leave BOTH empty");
            return;
        }

        var permissionSuffix = Cookies.getPermissionSuffix();
        var formUrlCollect = ValidateForm.collectAndValidate("url");
        if (formUrlCollect.valid == false) {
            alert("Error in form: \n" + JSON.stringify(formUrlCollect.result));
            return;
        }
        var tags = document.getElementById("tags").value.split(",").map(x => x.trim());
        var mode=this.modifyIdea==null?"addidea":"updateidea";

        var url = 'https://api.merik.now.sh/api/'+mode+'?=' + permissionSuffix +
         formUrlCollect.result + "&tags=" +  escape(JSON.stringify(tags)) + "&shops=" + escape( JSON.stringify(this.selectedShops))
         +(this.modifyIdea==null? "":"&id="+this.modifyIdea.id);

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
        let categoriesComponents = this.categories.map(x => (
            <tr>
                <td>
                    {x.name}
                </td>
                <td>

                    {x.tags.map(y => (

                        <a onClick={() => {
                            var elem = document.getElementById('tags');
                            if (elem.value.includes(" " + y.name + ", ")) return;
                            var old = elem.value;
                            elem.value = old + " " + y.name + ", ";

                        }}> {y.name} </a>
                    ))
                    }


                </td>
            </tr>
        ));

        let removeButton = this.modifyIdea == null ? null : (<button onClick={this.deleteIdea}> Remove idea</button>);

        let seeIdeaLink =this.modifyIdea==null? null :(<a href="#" onClick={()=>{this.props.changeSiteview("Start", true, "&tags=[%22SingleEntry:"+this.modifyIdea.id+"%22]") }} >See Idea</a>);


        return (
            <div className="centerbox">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <b>
                                    Add idea
                                </b>
                            </td>
                            <td className="alignright">
                                <a href="#" onClick={() => { this.props.changeSiteview("AddShop") }}>
                                    Add shop
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Modify:
                    </td>
                            <td>
                                <select onChange={(e) => { this.loadIdea(e.target.value) }}>
                                    <option> [Create new]</option>
                                    <option> [Copy]</option>
                                    {this.allIdeas.map(x => (<option >{x.name}</option>))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td>
                            {seeIdeaLink}
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
                                <input className="formField" minLength="3" fieldType="text" allowEmpty="false" placeholder="" id="description" />
                            </td>
                        </tr>
                        <AddressField appState={this.props.appState}/>
                        <tr>
                            <td>
                                Price:
                    </td>
                            <td>
                                <input className="formField" fieldType="double" allowEmpty="false" placeholder="" id="price" />
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
                                <input className="formField" fieldType="link" allowEmpty="false" placeholder="" id="image" />
                            </td>
                        </tr>



                        <tr>
                            <td>
                                <h4>Tags:</h4>
                            </td>
                            <td />
                        </tr>
                        <tr>

                            <td>
                                Selected:
                            </td>
                            <td>
                                <input style={{ fontSize: "0.6rem", width: "80%" }} fieldType="text" placeholder="" id="tags" />
                            </td>
                        </tr>
                        {categoriesComponents}



                        <tr>
                            <td>
                                <h4>Shops:</h4>
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>

                <ShopSelection selectedShops={this.selectedShops} />


                <br />
                <br />
                <div className="center">

                    <button onClick={this.addIdea}>
                        Add idea!
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


export default Addidea;