import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { ThemeProvider, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import BedumerTheme from './theme';
import MenuIcon from '@material-ui/icons/Menu';

const App = class App extends React.Component {
  // Define states
  state: {

  }

  // Global vars
  _isMounted = false;
  classes = {
    
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return <ThemeProvider theme={BedumerTheme}>
      <SnackbarProvider
        maxSnack={3}
        classes={{

        }}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">

            </Typography>
          </Toolbar>
        </AppBar>
      </SnackbarProvider>
    </ThemeProvider>
  }
}

ReactDOM.render(
  <App/>,
  $('div[data-type="main"]')[0]
)