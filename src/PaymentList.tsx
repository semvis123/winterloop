import React = require('react');
import $ from 'jquery';
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
import { ListItemSecondaryAction, IconButton, Typography, Fab, Zoom, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import theme from './theme';
import { withSnackbar } from 'notistack';

// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

// Define interfaces
interface PaymentListInterface {
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
  betaald: number;
}

interface PaymentListStateInterface {
  codeError: any;
  persons?: {
    [index: number]: PersonObjectInterface;
    map: any;
    filter: any;
    length: number;
    indexOf: any;
    forEach: any;
    some: any;
    findIndex: any;
    find: any;
  }

  dialogOpen: boolean;
  currentPerson: PersonObjectInterface;
  listClickDisabled: boolean;
  changeRoundOpen: boolean;
  codes: {
    [index: number]: number;
  }
  currentNameSetRound: string;
  setRoundButtonDisabled: boolean;
  personEdit: string;
}

// Dit is de lijst voor de stempels
export default withStyles({
  betaald: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})(withSnackbar(class PaymentList extends React.Component<PaymentListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: PaymentListStateInterface;

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
      listClickDisabled: false,
      changeRoundOpen: false,
      codeError: false,
      codes: [],
      currentNameSetRound: "",
      setRoundButtonDisabled: true,
      personEdit: ""
    };
  }

  getData() {
    // Haal de data op van de database
    const that = this;
    this._isMounted ? fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
      .then(data => { this._isMounted ? that.setState({ persons: data, listClickDisabled: false }) : null })
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
                "create_time": "2019-12-27T15:16:48.000Z",
                "betaald": -1
              }
            ], listClickDisabled: true
          }) : null
      }) : null;
  }

  componentDidMount() {
    this._isMounted = true;
    (this.state.persons.length == 0 || this.state.persons[0].code == '000000') ? this.getData() : null;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.props = newProps;
    (this.state.persons.length == 0 || this.state.persons[0].code == '000000') ? this.getData() : null;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    const that = this;
    const persons = this.state.persons.filter(function(person: PersonObjectInterface) {
      return ((person.naam.toLocaleLowerCase().indexOf(that.props.search.toLocaleLowerCase()) !== -1) || (String(person.code).indexOf(that.props.search) !== -1));
    });

    return (
      <div>
        {persons ? (
          <List className={classes.root}>
            {persons.map((person: PersonObjectInterface, i: number) =>
              <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialogOpen: true, currentPerson: persons[i] }) : null}>
                <ListItemText primary={person.naam} secondary={person.code} />
                <ListItemText primary={
                  <Typography align="center" className={classes.betaald}>{(person.betaald!==-1)? 'BETAALD': ''}</Typography>
                } />
                <ListItemText primary={
                  <Typography align="right" className={classes.root}>€ {
                    (person.rondes*person.rondeBedrag + person.vastBedrag)
                    .toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
                  }</Typography>
                } />
              </ListItem>
            )}
          </List>
        ) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.currentPerson.naam}</DialogTitle>
            <DialogContent>
              <DialogContentText>Vast bedrag: €{
                this.state.currentPerson.vastBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag: €{
                this.state.currentPerson.rondeBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                </DialogContentText>
              <DialogContentText>Aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>Opbrengst: €{
                (this.state.currentPerson.vastBedrag + (this.state.currentPerson.rondeBedrag * this.state.currentPerson.rondes))
                .toFixed(2)
                .replace('.', ',')
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
              <DialogContentText>Betaald: {(this.state.currentPerson.betaald!==-1)? 'ja': 'nee'}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                this.setState({ changeRoundOpen: true, currentNameSetRound: '', personEdit: '' })
              }} color="secondary" disabled={this.state.currentPerson.betaald!==-1}>
                Betalen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {this.state.changeRoundOpen ? (
          <Dialog open={this.state.changeRoundOpen} onClose={() => this.setState({ changeRoundOpen: false, currentNameSetRound: '', personEdit: '' })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Betalen</DialogTitle>
            <form autoComplete="off" id="payForm" action="#" method="POST" onSubmit={e => {
              e.preventDefault(); // remove the redirect


              $("#payForm [name='email']").val();


              fetch(serverUrl + '/api/setPayed/', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'Access-Control-Allow-Origin': '*'
                },
                body: "code=" +this.state.currentPerson.code + "&payed=1"
              }).then((e) => {
                if (e.status !== 200) {
                  console.log(e);
                } else {

                  persons[persons.indexOf(this.state.currentPerson)].betaald = true;
                  // remove error and name
                  this.setState({ persons: persons, codeError: false, currentNameSetRound: name });

                  this.state.personEdit != '' ? this.setState({ changeRoundOpen: false, currentNameSetRound: '', personEdit: '' }) : null;
                }
              }
              )
            }}>
              <DialogContent>
                <DialogContentText>Hier kunt u eventueel een email-adres invullen.</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="email"
                  type="text"
                  name="email"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.setState({ changeRoundOpen: false, currentNameSetRound: '', personEdit: '' })} color="primary">
                  Annuleren
                </Button>
                <Button type="submit" color="secondary">
                  Betalen
                </Button>
              </DialogActions>
            </form>
          </Dialog>

        ) : null}

      </div>);

  }
}));
