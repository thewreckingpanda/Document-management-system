import React, { Component } from "react";
import "./defaultBody.css";

class DefaultBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="containerDefaultBody">
        <div className="defaultBodyBox">
          <div className="mainInfo">
            <h1>Welcome to DMS</h1>
          </div>
          <div className="intro">
            <img
              src="http://www.clipartroo.com/images/103/document-clipart-103948.png"
              alt="dvs"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DefaultBody;
