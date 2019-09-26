import React, { Component } from 'react'
import $ from 'jquery'

class ShopEntry extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        $("#"+this.props.data.id).find("#link").val(this.props.data.link);
        $("#"+this.props.data.id).find("#price").val(this.props.data.price);
    }


    render() {
        return (
            <tr className="shopEntry" id={this.props.data.id}>
                <td>
                    {this.props.data.name}
                </td>
                <td>
                    <input ignoreForCollect="true" className="formField" fieldType="link" placeholder="Link to product" id="link" 
                        onChange={(e)=> {this.props.changeValue(this.props.data.name, "link", e.target.value)}} />
                </td>
                <td>
                    <input ignoreForCollect="true" className="formField" fieldType="double" placeholder="Price" id="price" 
                        onChange={(e)=> {this.props.changeValue(this.props.data.name, "price", e.target.value)}} />
                </td>
                <td>
                    <button onClick={()=> { this.props.deleteShopEntry(this.props.data.name)}}>
                        X
                    </button>
                </td>
            </tr>
        );
    }
}


export default ShopEntry;