import React, { Component } from 'react'

class CategoryEntry extends React.Component {
  constructor(props) {
    super(props);

  }


  render() {
      
    return (
        <div onClick={() => this.props.openCategory(this.props.name)}
         className={"filterentry "+(this.props.isSelected ? " filterEntrySelected" : "")}>{this.props.name}</div>
    );
  }
}


export default CategoryEntry;