import React from "react";
import ReactDOM from "react-dom";
import { Toolbar } from '@material-ui/core';
import TextAppBar from './Appbar';
import './style.scss';
let App = document.getElementById("root");

ReactDOM.render(<TextAppBar text="Winterloop"/>, App);
