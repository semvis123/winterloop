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
}

// Dit is de lijst voor de stempels
export default withStyles({
fab: {
  position: 'fixed',
  bottom: 16,
  right: 26,
},
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
      listClickDisabled: false,
      changeRoundOpen: false,
      codeError: false,
      codes: [],
      currentNameSetRound: "",
      setRoundButtonDisabled: true
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
        <Zoom
          in={true}
        >
          <Fab color="secondary" className={classes.fab} onClick={() => {
            this.setState({ changeRoundOpen: true });
            let codes = new Array();
            this.state.persons.forEach((person: PersonObjectInterface)=> {
              codes.push(person.code);
            });
            this.setState({codes:codes});
          }}>
            <PersonIcon />
          </Fab>
        </Zoom>
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
              <DialogContentText>Vast bedrag: €{this.state.currentPerson.vastBedrag}</DialogContentText>
              <DialogContentText>Ronde bedrag: €{this.state.currentPerson.rondeBedrag}</DialogContentText>
              <DialogContentText>Aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>Opbrengst: €{this.state.currentPerson.vastBedrag + (this.state.currentPerson.rondeBedrag * this.state.currentPerson.rondes)}</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                persons[this.state.persons.indexOf(this.state.currentPerson)].rondes--;
                this.setState({persons: persons});

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
                    } else{
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

        {this.state.changeRoundOpen ? (
          <Dialog open={this.state.changeRoundOpen} onClose={() => this.setState({ changeRoundOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Rondes invullen</DialogTitle>
            <form autoComplete="off" id="setRoundForm" action="#" method="POST" onSubmit={e => {
              e.preventDefault(); // remove the redirect
              fetch(serverUrl + '/api/setRound/', {
              method: 'post',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
              },
              body: "code=" + $("#setRoundForm [name='code']").val() +
              "&rondes=" +$("#setRoundForm [name='rondes']").val()
            }).then((e)=>{
              if (e.status !== 200){
                console.log(e);
              } else{

                // update the list values
                let persons = this.state.persons;
                var index = persons.findIndex((person:PersonObjectInterface) =>{
                  return person.code == $("#setRoundForm [name='code']").val();
                });
                persons[index].rondes = $("#setRoundForm [name='rondes']").val();

                // remove error and name
                this.setState({persons: persons, codeError: false, currentNameSetRound: name});

                // set focus back and empty fields
                $("#setRoundForm [name='code']").focus();
                $("#setRoundForm [name='code']").val("");
                $("#setRoundForm [name='rondes']").val("");
              }}
            )
          }}>
            <DialogContent>
              <DialogContentText>Hier kunt u de rondes invullen.</DialogContentText>
              <TextField
                autoFocus
                error={this.state.codeError}
                margin="dense"
                label="Code"
                type="text"
                name="code"
                helperText={this.state.codeError?"Loper niet gevonden.":this.state.currentNameSetRound}
                onChange={(e)=>{
                  if(this.state.persons.some((person:PersonObjectInterface)=>person.code==e.target.value)){
                    // grab name of user to display it
                    let name: string = this.state.persons.find(
                      (person:PersonObjectInterface) => {
                        return person.code == e.target.value
                      }).naam;
                    // remove error and enable button
                    this.setState({codeError: false, currentNameSetRound: name, setRoundButtonDisabled: false});

                  }else{
                    // set the field to error state
                    this.setState({codeError: true, setRoundButtonDisabled: true});
                  }
                }}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Rondes"
                type="number"
                name="rondes"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ changeRoundOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button type="submit" color="secondary" disabled={this.state.setRoundButtonDisabled}>
                Verander rondes
                </Button>
            </DialogActions>
          </form>
          </Dialog>
        ) : null}

      </div>);

  }
});
