import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';

import Header from './header';

// TEST
import FabBtn from './fab';
// TEST END

ReactDOM.render(
  <Header title="Winterloop"/>,
  $('div[data-type="header"]')[0]
);

// TEST
ReactDOM.render(
  <FabBtn />,
  $('div[data-type="fab"]')[0]
);
// TEST END

// https://material-ui.com/getting-started/usage/