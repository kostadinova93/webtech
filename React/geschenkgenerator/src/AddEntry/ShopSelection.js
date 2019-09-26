import React, { Component } from 'react'
import ShopEntry from './ShopEntry';

class ShopSelection extends React.Component {
    constructor(props) {
        super(props);
        this.allshops = [];
        
        this.deleteShopEntry=this.deleteShopEntry.bind(this);
        this.changeValue=this.changeValue.bind(this);
    }

    addShop(name) {
        
        var selShop=this.allshops.find(x=>x.name==name);
        if(selShop==null || this.props.selectedShops.find(x=>x.name==name)!=null) return;
        this.props.selectedShops.push(selShop);
        this.forceUpdate();
    }

    deleteShopEntry(name) {
        var allowedEntries=this.props.selectedShops.map(x=>x);
        allowedEntries=allowedEntries.filter(x=>x.name!=name);
        this.props.selectedShops.splice(0,this.props.selectedShops.length);
        allowedEntries.forEach((x)=> {
            this.props.selectedShops.push(x);
        });
        this.forceUpdate();
    }
    
    changeValue(name, key, value) {
        var sel=this.props.selectedShops.find(x=>x.name==name);
        sel[key]=value;
    }


    componentDidMount() {
        fetch('https://api.merik.now.sh/api/loadshops', {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(json => {

                        this.allshops = json.map(x=>({name: x.name}));
                        this.forceUpdate();
                    });
                }
            });
    };

    render() {
        let selectShop = (
            <tr>
                <td>
                    Add Shop
                </td>
                <td>
                    <select name="addshop" onChange={(e)=> {this.addShop(e.target.value)}}>
                        <option> Select shop..</option>
                        {this.allshops.map(x=>(<option >{x.name}</option>))}
                    </select>
                </td>
            </tr>

        );

        let selectedShopsElement=this.props.selectedShops.map(x=>(<ShopEntry changeValue={this.changeValue} deleteShopEntry={this.deleteShopEntry} data={x}/>));

        return (
            <table>
                <tbody>
                {selectShop}
                {selectedShopsElement}
                </tbody>
            </table>
        );
    }
}


export default ShopSelection;