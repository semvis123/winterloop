import React = require('react');
import $ from 'jquery';
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
import { IconButton, Typography, Fab, Zoom, TextField } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import theme from './theme';
import { withSnackbar } from 'notistack';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

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
  betaald: number;
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
  rendered?: React.ReactNode;
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
  paymentDialogOpen: any;
}

// Static vars
// Deze worden niet verwijdert als het component herlaad
let _hasLoaded: boolean = false;
let _hasFailed: boolean = false;
let renderedData: React.ReactNode;
let localState: any;
let search: string = "";
let unfilteredPersons: any;
let itemData: any;
let style: any = {
  fab: {
    position: 'fixed',
    bottom: 16,
    right: 26,
    zIndex: 100,
  },
  editButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
};


// Dit is de lijst voor de rondes
export default withSnackbar(class CountingList extends React.Component<CountingListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: CountingListStateInterface;

  props: {
    classes: any; // It works
    search: string;
    enqueueSnackbar: any;
    closeSnackbar: any;
    shouldload: boolean;
    loaded: any;
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
      personEdit: "",
      paymentDialogOpen: false
    };

    if (_hasLoaded && !_hasFailed) {
      this.state = {
        ...this.state,
        rendered: renderedData,
      }
    }
  }
  renderItem({ index, style }) {
    return (
      <ListItem style={style} divider button key={index} onClick={() => !localState.state.listClickDisabled ? localState.setState({ dialogOpen: true, currentPerson: itemData[index] }) : null}>
        <ListItemText primary={itemData[index].naam} secondary={itemData[index].code} />
        <ListItemText primary={
          <Typography align="right">{itemData[index].rondes}</Typography>
        } />
      </ListItem>
    )
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
      .then(data => {
        localState.setState({ persons: data, listClickDisabled: false });
        unfilteredPersons = data;
        itemData = data
        renderedData = <div className="list">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList height={height} width={width} itemSize={73} overscanCount={10} itemCount={data.length}>
                {this.renderItem}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>

        localState.setState({ rendered: renderedData });

      }
      )
      .catch(() => {
        this.props.enqueueSnackbar('Kan niet verbinden met database', {
          variant: 'error',
          autoHideDuration: 5000,
        });
        let data = [
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
            "betaald": 0
          }
        ]
        itemData = data
        renderedData = <div className="list">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList height={height} width={width} itemSize={73} overscanCount={10} itemCount={data.length}>
                {this.renderItem}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
        localState.setState({ rendered: renderedData, listClickDisabled: true });
        _hasFailed = true;
      });
  }

  componentDidMount() {
    this._isMounted = true;
    localState = this;
    if ((!_hasLoaded && !_hasFailed) || !this.props.shouldload) {
      renderedData = null;
      this.props.loaded();
      _hasLoaded = true;
      setTimeout(() => { this.getData() }, 0);
    }

    // searching persons
    if (search != this.props.search && _hasLoaded) {
      search = this.props.search;
      const persons = unfilteredPersons.filter((person: PersonObjectInterface) => {
        return ((person.naam.toLocaleLowerCase().indexOf(this.props.search.toLocaleLowerCase()) !== -1) || (String(person.code).indexOf(this.props.search) !== -1));
      });
      itemData = persons;
      renderedData = <div className="list">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} width={width} itemSize={73} overscanCount={10} itemCount={persons.length}>
              {this.renderItem}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      this.setState({ rendered: renderedData });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <div>
        <Zoom
          in={true}
        >
          <Fab color="secondary" style={style.fab} onClick={() => {
            this.setState({ changeRoundOpen: true });
            let codes = new Array();
            this.state.persons.forEach((person: PersonObjectInterface) => {
              codes.push(person.code);
            });
            this.setState({ codes: codes });
          }}>
            <PersonIcon />
          </Fab>
        </Zoom>
        {this.state.rendered ? (this.state.rendered) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}

        {/* dialog for person information */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              <IconButton aria-label="edit" style={style.editButton} disabled={(this.state.currentPerson.betaald!=0)} onClick={() => {
                this.setState({
                  personEdit: this.state.currentPerson.code,
                  changeRoundOpen: true,
                  codeError: false,
                  currentNameSetRound: this.state.currentPerson.naam,
                  setRoundButtonDisabled: false
                });
              }}>
                <EditIcon />
              </IconButton>
              {this.state.currentPerson.naam}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Vast bedrag: €{
                this.state.currentPerson.vastBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag: €{
                this.state.currentPerson.rondeBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                this.setState({
                  personEdit: this.state.currentPerson.code,
                  changeRoundOpen: true,
                  codeError: false,
                  currentNameSetRound: this.state.currentPerson.naam,
                  setRoundButtonDisabled: false
                });
              }} disabled={(this.state.currentPerson.betaald!=0)} color="secondary">
                Rondes invullen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {/* dialog for round edits */}
        {this.state.changeRoundOpen ? (
          <Dialog open={this.state.changeRoundOpen} onClose={() => this.setState({ changeRoundOpen: false, currentNameSetRound: '', personEdit: '' })} aria-labelledby="form-dialog-title">
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
                  "&rondes=" + $("#setRoundForm [name='rondes']").val()
              }).then((e) => {
                if (e.status !== 200) {
                  console.log(e);
                } else {
                  if (e.status !== 200) {
                    throw "error server code: " + e.status;
                  }
                  // update the list values
                  let persons = this.state.persons;
                  var index = persons.findIndex((person: PersonObjectInterface) => {
                    return person.code == $("#setRoundForm [name='code']").val();
                  });
                  persons[index].rondes = Number($("#setRoundForm [name='rondes']").val());
                  this.props.enqueueSnackbar('Rondes toegevoegd', {
                    variant: 'success',
                    autoHideDuration: 5000,
                  });
                  // remove error and name
                  this.setState({ persons: persons, codeError: false, currentNameSetRound: name });

                  renderedData = (
                    <List>
                      {persons.map((person: PersonObjectInterface, i: number) =>
                        <ListItem divider button key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialogOpen: true, currentPerson: persons[i] }) : null}>
                          <ListItemText primary={person.naam} secondary={person.code} />
                          <ListItemText primary={
                            <Typography align="right">{person.rondes}</Typography>
                          } />
                        </ListItem>
                      )}
                    </List>)

                  this.setState({ rendered: renderedData });

                  // set focus back and empty fields
                  $("#setRoundForm [name='code']").focus();
                  $("#setRoundForm [name='code']").val("");
                  $("#setRoundForm [name='rondes']").val("");
                  this.state.personEdit != '' ? this.setState({ paymentDialogOpen: true, changeRoundOpen: false, currentNameSetRound: '', personEdit: '' }) : null;
                }
              }
              ).catch(() => {
                this.props.enqueueSnackbar('Rondes toevoegen mislukt', {
                  variant: 'error',
                  autoHideDuration: 5000,
                });
              })
            }}>
              <DialogContent>
                <DialogContentText>Hier kunt u de rondes invullen.</DialogContentText>
                <TextField
                  autoFocus={this.state.personEdit ? true : false}
                  error={this.state.codeError}
                  margin="dense"
                  label="Code"
                  type="text"
                  name="code"
                  defaultValue={this.state.personEdit}
                  helperText={this.state.codeError ? "Loper niet gevonden." : this.state.currentNameSetRound}
                  onChange={(e) => {
                    if (this.state.persons.some((person: PersonObjectInterface) => person.code == e.target.value)) {
                      // grab name of user to display it
                      let name: string = this.state.persons.find(
                        (person: PersonObjectInterface) => {
                          return person.code == e.target.value
                        }).naam;
                      // remove error and enable button
                      this.setState({ codeError: false, currentNameSetRound: name, setRoundButtonDisabled: false });

                    } else {
                      // set the field to error state
                      this.setState({ codeError: true, setRoundButtonDisabled: true });
                    }
                  }}
                  fullWidth
                />
                <TextField
                  autoFocus={this.state.personEdit == '' ? false : true}
                  margin="dense"
                  label="Rondes"
                  type="number"
                  name="rondes"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.setState({ changeRoundOpen: false, currentNameSetRound: '', personEdit: '' })} color="primary">
                  Annuleren
                </Button>
                <Button type="submit" color="secondary" disabled={this.state.setRoundButtonDisabled}>
                  Verander rondes
                </Button>
              </DialogActions>
            </form>
          </Dialog>

        ) : null}

        {/* dialog for payment suggestion */}
        {this.state.paymentDialogOpen ? (
          <Dialog open={this.state.paymentDialogOpen} onClose={() => this.setState({ paymentDialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Afrekenen</DialogTitle>
            <DialogContent>
              <DialogContentText>Wilt u direct afrekenen?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ paymentDialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {

                const action = (key: any) => (
                  <React.Fragment>
                    <Button onClick={() => {
                      this.props.closeSnackbar(key);
                      this.props.enqueueSnackbar('Betalen mislukt', {
                        variant: 'error',
                        autoHideDuration: 5000,
                      });
                    }}>
                      Annuleren
                    </Button>
                    <Button onClick={() => {
                      fetch(serverUrl + '/api/setPayed/', {
                        method: 'post',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                          'Access-Control-Allow-Origin': '*'
                        },
                        body: "code=" + this.state.currentPerson.code + "&payed=1"
                      }).then((e) => {
                        if (e.status !== 200) {
                          throw e.status;
                        } else {
                          let persons = this.state.persons;
                          persons[persons.indexOf(this.state.currentPerson)].betaald = 1;
                          this.setState({ paymentDialogOpen: false });
                        }
                        this.props.enqueueSnackbar('Betalen gelukt', {
                          variant: 'success',
                          autoHideDuration: 5000,
                        });
                      }
                      ).catch(() => {
                        this.props.enqueueSnackbar('Betaal status zetten mislukt', {
                          variant: 'error',
                          autoHideDuration: 5000,
                        });
                      });
                      this.props.closeSnackbar(key);
                    }}>
                      Gelukt
                    </Button>
                  </React.Fragment>
                );
                let person = this.state.currentPerson;
                let amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                this.props.enqueueSnackbar('Te betalen: € ' + amount, {
                  variant: 'info',
                  persist: true,
                  action,
                });
              }} color="secondary">
                Contant
                </Button>
              <Button onClick={() => {
                fetch(serverUrl + '/api/setPayed/', {
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                  },
                  body: "code=" + this.state.currentPerson.code + "&payed=2"
                }).then((e) => {
                  if (e.status !== 200) {
                    throw e.status;
                  } else {
                    let persons = this.state.persons;
                    persons[persons.indexOf(this.state.currentPerson)].betaald = 2;
                    this.setState({ paymentDialogOpen: false });
                  }
                }
                ).catch(() => {
                  this.props.enqueueSnackbar('Betalen zetten mislukt', {
                    variant: 'error',
                    autoHideDuration: 5000,
                  });
                });
                let person = this.state.currentPerson;
                let amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2);
                window.location.href = 'sumupmerchant://pay/1.0?amount=' + amount
                  + '&affiliate-key=' + Config.sumup.affiliateKey + 'currency=' + Config.sumup.currency + '&title=' + Config.sumup.title;
                this.props.enqueueSnackbar('Betalen gelukt', {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
              }} color="secondary">
                Sumup
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>);

  }
});
