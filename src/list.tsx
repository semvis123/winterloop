import React = require('react');
import { createStyles, makeStyles, Theme, withStyles, withTheme, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ThemeProvider } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import BedumerTheme from './theme';
import { Props } from 'react';

const serverUrl = 'http://localhost:4322'; // Change this to your server url

/*
Dit is de lijst voor alle personen
*/
export const PersonList = withStyles({

})(class extends React.Component {
  // Define interfaces
  // To keep TypeScript happy
  state: {
    persons: {
      [index: number]: any;
      map: any;
    };
    dialog: boolean;
    currentPerson: any;
    listClickDisabled: boolean;
  }

  props: {
    classes: any; // It works
  }

  // Global vars
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      persons: null,
      dialog: false,
      currentPerson: null,
      listClickDisabled: false
    };
  }

  getData() {
    // Haal de data op van de database
    const that = this;
    fetch(serverUrl + '/api/getUsers/') // change this to yourip:4322
      .then(response => { var a = response.json(); return a })
      .then(data => { this._isMounted ? that.setState({ persons: data, listClickDisabled: false }) : null })
      .catch(() => {
        this._isMounted ? that.setState({
          persons: [
            {
              "id": 1,
              "naam": "Kan niet verbinden met database.",
              "huisnummer": "0",
              "postcode": "0000AA",
              "telefoonnummer": "0000000000",
              "vastBedrag": 0,
              "rondeBedrag": 0,
              "rondes": 0,
              "code": '00000',
              "create_time": "2019-12-27T15:16:48.000Z"
            }
          ],
          listClickDisabled: true
        }) : null;
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.getData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    const { persons } = this.state;
    return (
      <div>
        {this.state.persons ? (<List className={classes.root}>
          {persons.map((person, i) =>
            <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialog: true, currentPerson: persons[i] }) : null}>
              <ListItemText id={person.id} primary={person.naam} secondary={person.code} />
            </ListItem>

          )}
        </List>) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}
        {this.state.dialog ? (<Dialog fullScreen={useMediaQuery('@media (max-width:959.95px)')} open={this.state.dialog} onClose={() => this.setState({ dialog: false })} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{this.state.currentPerson.naam}</DialogTitle>
          <DialogContent>
            <DialogContentText>id: {this.state.currentPerson.id}</DialogContentText>
            <DialogContentText>huisnummer: {this.state.currentPerson.huisnummer}</DialogContentText>
            <DialogContentText>postcode: {this.state.currentPerson.postcode}</DialogContentText>
            <DialogContentText>telefoonnummer: {this.state.currentPerson.telefoonnummer}</DialogContentText>
            <DialogContentText>vast bedrag: €{this.state.currentPerson.vastBedrag}</DialogContentText>
            <DialogContentText>ronde bedrag: €{this.state.currentPerson.rondeBedrag}</DialogContentText>
            <DialogContentText>aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
            <DialogContentText>aanmaak datum: {this.state.currentPerson.create_time}</DialogContentText>
            <DialogContentText>code: {this.state.currentPerson.code}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ dialog: false })} color="primary">
              Annuleren
              </Button>
            <Button onClick={() => {
              fetch(serverUrl + '/api/removeUser/', {
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
                body: "code=" + this.state.currentPerson.code
              })
                .then(async () => {
                  await this.getData();
                  this.setState({ dialog: false })
                })
            }} color="secondary">
              Verwijderen
              </Button>
          </DialogActions>
        </Dialog>) : null}
      </div>);

  }
});

/*
  Dit is de lijst voor de stempels
*/
export const CountingList = withStyles({

})(class extends React.Component {
  // Define interfaces
  // To keep TypeScript happy
  state: {
    persons: {
      [index: number]: any;
      map: any;
    };
    dialog: boolean;
    currentPerson: any;
    listClickDisabled: boolean;
  }

  props: {
    classes: any; // It works
  }

  // Global vars
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      persons: [],
      dialog: false,
      currentPerson: null,
      listClickDisabled: false
    };

  }

  getData() {
    // Haal de data op van de database
    const that = this;
    this._isMounted ? fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
      .then(data => { that.setState({ persons: data, listClickDisabled: false })})
      .catch(() => {
        this._isMounted ? that.setState(
          {
            persons: [
              {
                "id": 1,
                "naam": "Kan niet verbinden met database.",
                "huisnummer": "0",
                "postcode": "0000AA",
                "telefoonnummer": "0000000000",
                "vastBedrag": 0,
                "rondeBedrag": 0,
                "rondes": 0,
                "code": '00000',
                "create_time": "2019-12-27T15:16:48.000Z"
              }
            ], listClickDisabled: true
          }) : null
      }) : null;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    const { persons } = this.state;
    return (
      <div>
        {this.state.persons ? (<List className={classes.root}>
          {persons.map((person, i) =>
            <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialog: true, currentPerson: persons[i] }) : null}>
              <ListItemText id={person.id} primary={person.naam} secondary={person.code} />
            </ListItem>

          )}
        </List>) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}
        {this.state.dialog ? (<Dialog fullScreen={useMediaQuery('@media (max-width:959.95px)')} open={this.state.dialog} onClose={() => this.setState({ dialog: false })} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{this.state.currentPerson.naam}</DialogTitle>
          <DialogContent>
            <DialogContentText>id: {this.state.currentPerson.id}</DialogContentText>
            <DialogContentText>huisnummer: {this.state.currentPerson.huisnummer}</DialogContentText>
            <DialogContentText>postcode: {this.state.currentPerson.postcode}</DialogContentText>
            <DialogContentText>telefoonnummer: {this.state.currentPerson.telefoonnummer}</DialogContentText>
            <DialogContentText>vast bedrag: €{this.state.currentPerson.vastBedrag}</DialogContentText>
            <DialogContentText>ronde bedrag: €{this.state.currentPerson.rondeBedrag}</DialogContentText>
            <DialogContentText>aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
            <DialogContentText>aanmaak datum: {this.state.currentPerson.create_time}</DialogContentText>
            <DialogContentText>code: {this.state.currentPerson.code}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ dialog: false })} color="primary">
              Annuleren
              </Button>
            <Button onClick={() => {
              fetch(serverUrl + '/api/removeUser/', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'Access-Control-Allow-Origin': '*'
                },
                body: "code=" + this.state.currentPerson.code
              })
                .then(async () => {
                  await this.getData();
                  this.setState({ dialog: false });
                })
            }} color="secondary">
              Verwijderen
              </Button>
          </DialogActions>
        </Dialog>) : null}
      </div>);

  }
});
