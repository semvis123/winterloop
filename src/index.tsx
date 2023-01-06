/* eslint-disable no-unused-vars */
import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import BedumerTheme from './theme';
import Main from './Main';

function AppReact() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={BedumerTheme}>
        <Main />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ReactDOM.render(
  <AppReact />,
  $('div[data-type="main"]')[0]
);
