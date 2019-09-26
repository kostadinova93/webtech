import React, { Component } from 'react'

class Filterlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        
    }

    render() {
        return (
            <table style={{width:"100%"}}>
                <tr>
                    <td style={{width:"20%"}}>
                        <div id="filter_1st">
                            <div class="filterentry" id="f1_geschlecht">
                                <a href="#" onclick="OpenSubFilter('geschlecht');"> Geschlecht</a>
                            </div>
                            <div class="filterentry" id="f1_hobbys">
                                <a href="#" onclick="OpenSubFilter('hobbys');"> Hobbys</a>
                            </div>
                            <div class="filterentry" id="f1_anlass">
                                <a href="#" onclick="OpenSubFilter('anlass');"> Anlass</a>
                            </div>


                        </div>

                    </td>

                    <td style={{width:"40%"}}>
                        <div id="filter_2nd">
                            <div id="f2_geschlecht" class="filterentry hidden">
                                <a href="#" onclick="AddFilter('geschlecht', 'männlich');"> Männlich</a>
                                <br/>
                                <br/>
                                <a href="#" onclick="AddFilter('geschlecht', 'weiblich');"> Weiblich</a>
                            </div>
                            <div id="f2_hobbys" class="filterentry hidden">
                                Tischtennis
                                <br/>
                                Schalke
                                <br/>
                                Freund
                            </div>
                            <div id="f2_anlass" class="filterentry hidden">
                                Geburt
                                <br/>
                                Geburtstag
                                <br/>
                                Namenstag
                                <br/>
                                Tod
                            </div>

                        </div>

                    </td>

                </tr>
            </table>
        );
    }
}


export default Filterlist;