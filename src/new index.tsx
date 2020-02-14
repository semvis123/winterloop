import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const App = class App extends React.Component {
  constructor(props) {
    super(props);
  }
}

ReactDOM.render(
  <App/>,
  $('div[data-type="main"]')[0]
)