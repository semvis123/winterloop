import React = require('react');
import $ from 'jquery';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import * as Config from '../configuration.json';
import { IconButton, Typography, Fab, Zoom, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import theme from './theme';
import { withSnackbar } from 'notistack';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import type { CountingListInterface, CountingListStateInterface, PersonObjectInterface } from './index.d';

// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

// Static vars
// Deze worden niet verwijdert als het component herlaad
let _hasLoaded: boolean = false;
let _hasFailed: boolean = false;
let renderedData: React.ReactNode;
let localState: any;
let search: string = "";
let unfilteredPersons: any;
let itemData: any;
const style: any = {
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
      <ListItemButton style={style} divider key={index} onClick={() => !localState.state.listClickDisabled ? localState.setState({ dialogOpen: true, currentPerson: itemData[index] }) : null}>
        <ListItemText primary={itemData[index].naam} secondary={itemData[index].code} />
        <ListItemText primary={
          <Typography align="right">{itemData[index].rondes}</Typography>
        } />
      </ListItemButton>
    )
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => response.json())
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
        const data = [
          {
            "id": 1,
            "naam": "Kan niet verbinden met database.",
            "huisnummer": "0",
            "postcode": "0000AA",
            "telefoonnummer": "0000000000",
            "vastBedrag": 0,
            "rondeBedrag": 0,
            "vastBedragQR": 0,
            "rondeBedragQR": 0,
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
            const codes = new Array();
            this.state.persons.forEach((person: PersonObjectInterface) => {
              codes.push(person.code);
            });
            this.setState({ codes: codes });
          }}>
            <PersonIcon />
          </Fab>
        </Zoom>
        {this.state.rendered ? (this.state.rendered) : <LinearProgress/>} {/*loader moet nog gecenterd worden */}

        {/* dialog for person information */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              <IconButton
                aria-label="edit"
                style={style.editButton}
                disabled={(this.state.currentPerson.betaald!=0)}
                onClick={() => {
                  this.setState({
                    personEdit: this.state.currentPerson.code,
                    changeRoundOpen: true,
                    codeError: false,
                    currentNameSetRound: this.state.currentPerson.naam,
                    setRoundButtonDisabled: false
                  });
                }}
                size="large">
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
              <DialogContentText>Vast bedrag (QR): €{
                this.state.currentPerson.vastBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag (QR): €{
                this.state.currentPerson.rondeBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
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
              }} disabled={(this.state.currentPerson.betaald!=0)} color="secondary" variant="contained">
                Rondes invullen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {/* dialog for round edits */}
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
                  const persons = itemData;
                  console.log(persons);
                  const index = persons.findIndex((person: PersonObjectInterface) => {
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
                        <ListItemButton divider key={i} onClick={() => !this.state.listClickDisabled ? this.setState({ dialogOpen: true, currentPerson: persons[i] }) : null}>
                          <ListItemText primary={person.naam} secondary={person.code} />
                          <ListItemText primary={
                            <Typography align="right">{person.rondes}</Typography>
                          } />
                        </ListItemButton>
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
            ).catch((e) => {
                console.log(e);
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
                      const name: string = this.state.persons.find(
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
                <Button type="submit" color="secondary" variant='contained' disabled={this.state.setRoundButtonDisabled}>
                  Verander rondes
                </Button>
              </DialogActions>
            </form>
          </Dialog>


        {/* dialog for payment suggestion */}
        {this.state.paymentDialogOpen ? (
          <Dialog open={this.state.paymentDialogOpen} onClose={() => this.setState({ paymentDialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Afrekenen</DialogTitle>
            <DialogContent>
            <DialogContentText>Totaalbedrag van: € {
              (this.state.currentPerson.rondeBedrag * this.state.currentPerson.rondes
               + this.state.currentPerson.vastBedrag).toFixed(2)
              .replace('.', ',')
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }</DialogContentText>
              <DialogContentText>Wilt u direct afrekenen?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ paymentDialogOpen: false })} color="primary">
                Later
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
                    }} color="error">
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
                          const persons = this.state.persons;
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
                    }} color="secondary" variant='contained'>
                      Gelukt
                    </Button>
                  </React.Fragment>
                );
                const person = this.state.currentPerson;
                const amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                this.props.enqueueSnackbar('Te betalen: € ' + amount, {
                  variant: 'info',
                  persist: true,
                  action,
                });
              }} color="secondary" variant='contained'>
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
                    const persons = this.state.persons;
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
                const person = this.state.currentPerson;
                const amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2);
                window.location.href = 'sumupmerchant://pay/1.0?amount=' + amount
                + '&total=' + amount
                + '&affiliate-key=' + Config.sumup.affiliateKey
                + '&currency=' + Config.sumup.currency
                + '&title=' + Config.sumup.title
                + '&callback=' + Config.server.url + '/#Rondes';
                this.props.enqueueSnackbar('Betalen gelukt', {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
              }} color="secondary" variant='contained'>
                Sumup
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>
    );

  }
});
