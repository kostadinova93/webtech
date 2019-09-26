import React from 'react'
import Tagword from './Tagword'
import CategoryEntry from './CategoryEntry'
import DetailEntry from './DetailEntry'
//import Filterlist from './Filterlist'

class Searchfield extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.categories = [];
        this.tags = [];
        this.activeCategory = "";

        this.closeSearchfield = this.closeSearchfield.bind(this);
        this.openSearchfield = this.openSearchfield.bind(this);
        this.openCategory = this.openCategory.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.updateSearchview = this.updateSearchview.bind(this);
    }


    openSearchfield() {
        document.getElementById("kopflogo").style.display = "inline";
        document.getElementById("filterlist").style.display = "inline";
        document.getElementById("filterbox").style.display = "block";
        if (document.getElementById("kopf") != null) document.getElementById("kopf").remove();
    }

    closeSearchfield() {
        this.activeCategory = "";
        document.getElementById("filterlist").style.display = "none";
        document.getElementById("filterbox").style.display = "none";
    }
    openCategory(category) {
        this.activeCategory = category;
        this.forceUpdate();
    }

    addFilter(tag) {
        this.closeSearchfield();
        this.props.addTagword(tag);

        this.forceUpdate();
    }

    updateSearchview() {
        this.props.updateIdeasView();
        this.closeSearchfield();
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
    };

    render() {


        var tmptags = [];
        this.categories.forEach(x => {
            x.tags.forEach(y => {
                if (this.props.tagwords.includes(y.name)) return;
                tmptags.push({ category: x.name, name: y.name, type:x.type });
            });
        });
        var myFCategories = this.categories.filter(x => tmptags.find(y => y.category == x.name) != null);

        let categoriesComponents = myFCategories.map(x => (
            <CategoryEntry type={x.type} name={x.name} isSelected={this.activeCategory == x.name} openCategory={this.openCategory} />
        ));

        let tags = tmptags.map(x => (
            <DetailEntry type={x.type} name={x.name} addFilter={this.addFilter} category={x.category} isShown={this.activeCategory == x.category} />
        ));


        let tagwordsComp = this.props.tagwords.map(x => (
            <Tagword deleteTagword={this.props.deleteTagword} name={x} />
        ));

        return (
            <div>
                <div id="suchbox" className="centerbox">
                    <button type="search" id="suchfeld" className={this.props.tagwords.length>0 ? "":""} placeholder="Filter.." onClick={this.openSearchfield} >
                        + Filter{this.props.tagwords.length>0 ? ":":""}
                    </button>
                    {tagwordsComp}
                </div>

                <div id="filterbox" className="centerbox hidden">
                    <div id="filterlist" className="hidden">
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "30%", borderRight: "1px solid grey" }}>
                                        <div id="">
                                            {categoriesComponents}
                                        </div>
                                    </td>


                                    <td style={{ width: "60%" }}>
                                        <div id="filter_2nd">
                                            {tags}
                                        </div>

                                    </td>
                                    <td onClick={this.closeSearchfield} style={{ width: "10%", float: "right" }}>
                                        X
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}


export default Searchfield;