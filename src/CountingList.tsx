import React = require('react');
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Config from '../configuration.json';
import { ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

// Define interfaces
interface CountingListInterface {
  search: string;
}

interface PersonObjectInterface {
  id: number;
  naam: string;
  huisnummer: string;
  postcode: string;
  telefoonnummer: string;
  vastBedrag: number;
  rondeBedrag: number;
  rondes: number;
  create_time: string;
  code: string;
}

interface CountingListStateInterface {
  persons?: {
    [index: number]: PersonObjectInterface;
    map: any;
    filter: any;
    length: number;
    indexOf: any;
  }

  dialogOpen: boolean;
  currentPerson: PersonObjectInterface;
  listClickDisabled: boolean;
}

// Dit is de lijst voor de stempels
export default withStyles({

})(class CountingList extends React.Component<CountingListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: CountingListStateInterface;

  props: {
    classes: any; // It works
    search: string;
  }

  // Global vars
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      persons: [],
      dialogOpen: false,
      currentPerson: null,
      listClickDisabled: false
    };

  }

  getData() {
    // Haal de data op van de database
    const that = this;
    this._isMounted ? fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
      .then(data => { this._isMounted ? that.setState({ persons: data, listClickDisabled: false }): null})
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
                "code": '000000',
                "create_time": "2019-12-27T15:16:48.000Z"
              }
            ], listClickDisabled: true
          }) : null
      }) : null;
  }

  componentDidMount() {
    this._isMounted = true;
    (this.state.persons.length == 0 || this.state.persons[0].code == '000000')? this.getData() : null;
  }
  UNSAFE_componentWillReceiveProps(newProps){
    this.props = newProps;
    (this.state.persons.length == 0 || this.state.persons[0].code == '000000')? this.getData() : null;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    const that = this;
    const persons = this.state.persons.filter(function (person:PersonObjectInterface) {
      return ((person.naam.toLocaleLowerCase().indexOf(that.props.search.toLocaleLowerCase()) !== -1)||(String(person.code).indexOf(that.props.search) !== -1));
    });

    return (
      <div>
        {persons ? (
          <List className={classes.root}>
            {persons.map((person:PersonObjectInterface, i:number) =>
              <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialogOpen: true, currentPerson: persons[i] }) : null}>
                <ListItemText primary={person.naam} secondary={person.code} />
                <ListItemText primary={
                  <Typography align="right" className={classes.root}>{person.rondes}</Typography>
                }/>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="add" onClick={() => {
                    const that = this;
                    persons[i].rondes++;
                    fetch(serverUrl + '/api/addRound/', {
                      method: 'post',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
                      body: "code=" + persons[i].code }).then((e) => {
                        if (e.status !== 200){
                           console.log(e);
                         }
                        else{
                          that.setState({ persons: that.state.persons });
                        }
                      });
                  }}>
                      <AddIcon />
                    </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        ) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
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
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                this.state.persons[this.state.persons.indexOf(this.state.currentPerson)].rondes--;
                fetch(serverUrl + '/api/removeRound/', {
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                  },
                  body: "code=" + this.state.currentPerson.code
                })
                  .then((e)=>{
                    if (e.status !== 200){
                       console.log(e);
                     }
                    else{
                      this.setState({ persons: this.state.persons });
                      this.setState({ dialogOpen: false});
                    }}
                  )
              }} color="secondary">
                Verwijder ronde
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>);

  }
});
