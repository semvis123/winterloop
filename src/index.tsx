import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';

import Header from './header';

ReactDOM.render(
  <Header title="Winterloop"/>,
  $('#root')[0]
);

// https://material-ui.com/getting-started/usage/