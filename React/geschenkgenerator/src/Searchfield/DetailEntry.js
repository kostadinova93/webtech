import React, { Component } from 'react'
import $ from 'jquery'

class DetailEntry extends React.Component {
    constructor(props) {
        super(props);

        this.freeSearch = this.freeSearch.bind(this);
        this.addDistance = this.addDistance.bind(this);
    }

    freeSearch() {
        this.props.addFilter($("#filterSearchfield").val());
    }

    addDistance() {
        this.props.addFilter("Distance:"+$("#distanceFilter").val());
    }

    render() {
        let currentClass = "detailentry " + (this.props.isShown ? "" : "hidden");
        let classEntry="";
        let entry = (<div onClick={() => this.props.addFilter(this.props.name)} >{this.props.name}</div>);
        if (this.props.type == "FREESEARCH") {
            entry = (<div>
                <input onKeyDown={(e) => { if (e.key === 'Enter') this.freeSearch(); }} placeholder=".." type="text" id="filterSearchfield"></input>
                <button onClick={() => this.freeSearch()}>
                    Suche
                </button>
            </div>);
        } 
        else if (this.props.type == "DISTANCE") {
            entry = (<div>
                Maximale Distanz (km): 
                <input type="number" id="distanceFilter" min="1"  max="1500" />
                <button onClick={() => this.addDistance()}>
                    Hinzufügen
                </button>
            </div>);
        } else {
            classEntry="detailEntryList";
        }

        return (
            <div className={currentClass+" "+classEntry}>
                {entry}
            </div>
        );
    }
}


export default DetailEntry;