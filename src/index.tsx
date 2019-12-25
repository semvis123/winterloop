import ReactDOM from 'react-dom';
import './style.scss';
import React = require('react');

import Button from '@material-ui/core/Button';

function App() {
  return (
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));

// https://material-ui.com/getting-started/usage/