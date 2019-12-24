import React from "react";
import ReactDOM from "react-dom";
import { Toolbar } from '@material-ui/core';

class Header extends React.Component {
    render() {
        return <div>
            <div className="container">
                <h1>Hello {this.props.name}</h1>
            </div>
        </div>
    }
}


let App = document.getElementById("root");

ReactDOM.render(<Header text="Winterloop" />, App);
