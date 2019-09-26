import React, { Component } from 'react'

class Tagword extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        let tagclose = this.props.noRemove == true ? null : (<div className="tagclose">
            X
            </div>);

        return (
            <button className={"tagchip " + (this.props.noRemove ? " noRemove" : "")} onClick={() => {
                if (this.props.noRemove) {
                    if(this.props.disableAdd!=true) this.props.addTagword(this.props.name);
                } else  {

                    this.props.deleteTagword(this.props.name);
                }
            }}>
                <div className="tagname">
                    {this.props.name}
                </div>
                {tagclose}

            </button>
        );
    }
}


export default Tagword;