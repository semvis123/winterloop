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

const serverUrl = 'http://localhost:4322'; // Change this to your server url

// Define interfaces
interface PersonListInterface {

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

interface PersonListStateInterface {
  persons?: {
    [index: number]: PersonObjectInterface;
    map: any;
  }

  dialogOpen: boolean;
  currentPerson: PersonObjectInterface;
  listClickDisabled: boolean;
}

// Dit is de lijst voor alle personen
export default withStyles({

})(class PersonList extends React.Component<PersonListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: PersonListStateInterface;

  props: {
    classes: any; // It works
  }

  // Global vars
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      persons: null,
      dialogOpen: false,
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
        {this.state.persons ? (
        <List className={classes.root}>
          {persons.map((person, i) =>
            <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialogOpen: true, currentPerson: persons[i] }) : null}>
              <ListItemText id={person.id} primary={person.naam} secondary={person.code} />
            </ListItem>
          )}
        </List>) : <CircularProgress color="secondary" />} {/* Moet een skelleton worden */}
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
                fetch(serverUrl + '/api/removeUser/', {
                  method: 'post',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
                  body: "code=" + this.state.currentPerson.code
                })
                  .then(async () => {
                    this.getData();
                    this.setState({ dialogOpen: false })
                  })
              }} color="secondary">
                Verwijderen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>);

  }
});