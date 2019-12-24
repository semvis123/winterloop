import React from "react";
import ReactDOM from "react-dom";
import { Toolbar } from '@material-ui/core';
import ButtonAppBar from './Appbar';
@import './src/style.scss'
let App = document.getElementById("root");

ReactDOM.render(<ButtonAppBar text="Winterloop"/>, App);
