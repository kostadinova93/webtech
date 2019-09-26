import React, { Component } from 'react'

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
      <div className="footer centerbox " id="footer">
        <a onClick={() => { this.props.changeSiteview("Impressum") }} href="#">Impressum</a>
      </div>
    );
  }
}


export default Footer;