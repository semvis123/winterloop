import React = require('react');
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import $ from 'jquery';
import { withSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Zoom, Fab, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import LinearProgress from '@mui/material/LinearProgress';

import * as Config from '../configuration.json';
import theme from './theme';
import type { PersonListInterface, PersonListStateInterface, PersonObjectInterface } from './index.d';

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
  },
}


// Dit is de lijst voor alle personen
export default withSnackbar(class PersonList extends React.Component<PersonListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: PersonListStateInterface;

  props: {
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
      addDialogOpen: false,
      editDialogOpen: false,
      paymentDialogOpen: false,
      personEdit: "",
      rendered: null,
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
        <ListItemText id={itemData[index].id.toString()} primary={itemData[index].naam} secondary={itemData[index].code} />
      </ListItemButton>
    )
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => {
        if (response.status !== 200) {
          throw "error server code: " + response.status;
        }
        return response.json();
      }).then(data => {
        itemData = data
        unfilteredPersons = data;
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
        </div>;

        // Update component when it is mounted
        localState.setState({
          persons: data,
          rendered: renderedData,
          listClickDisabled: false
        });

      }).catch((e) => {
        console.log(e);
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
            "code": '00000',
            "create_time": "2019-12-27T15:16:48.000Z"
          }
        ];

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

        localState._isMounted ? localState.setState({
          rendered: renderedData,
          listClickDisabled: true
        }) : null;

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
    if (search != this.props.search && _hasLoaded && unfilteredPersons != undefined) {
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
      </div>;
      this.setState({ rendered: renderedData });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {

    return (
      <div>
        <Zoom in={true}>
          <Fab color="secondary" style={style.fab} onClick={() => this.setState({ addDialogOpen: true })}>
            <AddIcon />
          </Fab>
        </Zoom>

        {this.state.rendered || <LinearProgress/>} {/* Moet een skeleton worden */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              <IconButton
                aria-label="edit"
                style={style.editButton}
                onClick={() => {
                  this.setState({
                    editDialogOpen: true
                  });
                }}
                size="large">
                <EditIcon />
              </IconButton>
              {this.state.currentPerson.naam}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Id: {this.state.currentPerson.id}</DialogContentText>
              <DialogContentText>Postcode: {this.state.currentPerson.postcode}</DialogContentText>
              <DialogContentText>Huisnummer: {this.state.currentPerson.huisnummer}</DialogContentText>
              <DialogContentText>Telefoonnummer: {this.state.currentPerson.telefoonnummer}</DialogContentText>
              <DialogContentText>Vast bedrag: €{
                this.state.currentPerson.vastBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag: €{
                this.state.currentPerson.rondeBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Vast bedrag QR: €{
                this.state.currentPerson.vastBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag QR: €{
                this.state.currentPerson.rondeBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>

              <DialogContentText>Aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>Aanmaak datum: {this.state.currentPerson.create_time}</DialogContentText>
              <DialogContentText>Betaald: {
                (this.state.currentPerson.betaald == 0)?  'nee' : (
                  (this.state.currentPerson.betaald == 1)? 'contant' : 'pin')
              }</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
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
                  .then(async (e) => {
                    if (e.status !== 200) {
                      throw "error server code: " + e.status;
                    }
                    this.props.enqueueSnackbar('Persoon successvol verwijderd', {
                      variant: 'success',
                      autoHideDuration: 5000,
                    });
                    this.getData();
                    this.setState({ dialogOpen: false })
                  })
                  .catch(() => {
                    this.props.enqueueSnackbar('Persoon verwijderen mislukt', {
                      variant: 'error',
                      autoHideDuration: 5000,
                    });
                    this.getData();
                    this.setState({ dialogOpen: false });
                  });
              }} color="error" variant="contained" disabled={!!this.state.currentPerson.betaald}>
                Verwijderen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {/* add user dialog */}
        <Dialog open={this.state.addDialogOpen} onClose={() => this.setState({ addDialogOpen: false })} aria-labelledby="form-dialog-title">
          <form noValidate id="addUserForm" action="#" method="POST" onSubmit={e => {
            e.preventDefault(); // remove the redirect
            fetch(serverUrl + '/api/addUser/', {
              method: 'post',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
              body: "naam=" + encodeURIComponent($("#addUserForm [name='naam']").val().toString()) +
                "&huisnummer=" + $("#addUserForm [name='huisnummer']").val() +
                "&postcode=" + $("#addUserForm [name='postcode']").val() +
                "&telefoonnummer=" + $("#addUserForm [name='telefoonnummer']").val() +
                "&vastBedrag=" + $("#addUserForm [name='vastBedrag']").val().toString().replace(',', '.') +
                "&rondeBedrag=" + $("#addUserForm [name='rondeBedrag']").val().toString().replace(',', '.') +
                "&vastBedragQR=" + $("#addUserForm [name='vastBedragQR']").val().toString().replace(',', '.') +
                "&rondeBedragQR=" + $("#addUserForm [name='rondeBedragQR']").val().toString().replace(',', '.')

            })
              .then(response => {
                if (response.status !== 200) {
                  throw "error server code: " + response.status;
                }
                return response.json();
              })
              .then((a) => {
                this.props.enqueueSnackbar('Persoon toegevoegd met code: ' + a.code, {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
                itemData.push({
                  "id": itemData.length,
                  "naam": $("#addUserForm [name='naam']").val(),
                  "huisnummer": $("#addUserForm [name='huisnummer']").val(),
                  "postcode": $("#addUserForm [name='postcode']").val(),
                  "telefoonnummer": $("#addUserForm [name='telefoonnummer']").val(),
                  "vastBedrag": parseFloat($("#addUserForm [name='vastBedrag']").val().toString()),
                  "rondeBedrag": parseFloat($("#addUserForm [name='rondeBedrag']").val().toString()),
                  "vastBedragQR": parseFloat($("#addUserForm [name='vastBedragQR']").val().toString()),
                  "rondeBedragQR": parseFloat($("#addUserForm [name='rondeBedragQR']").val().toString()),
                  "rondes": 0,
                  "code": a.code,
                  "create_time": "onbekend",
                  "betaald": 0
                });
                localState.setState({ currentPerson: itemData.find(x => x.code == a.code) });
                this.setState({ addDialogOpen: false, paymentDialogOpen: true });

                renderedData = null;
                _hasLoaded = true;
                this.getData();


                // searching persons
                if (search != this.props.search && _hasLoaded && unfilteredPersons != undefined) {
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
                  </div>;
                  this.setState({ rendered: renderedData });
}
              })
              .catch(() => {
                this.setState({ addDialogOpen: false });
                this.props.enqueueSnackbar('Persoon toevoegen mislukt', {
                  variant: 'error',
                  autoHideDuration: 5000,
                });
              });
          } // send the request and close dialog
          }>
            <DialogTitle id="form-dialog-title">Nieuwe deelnemer toevoegen</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vul hieronder de gegevens in van de deelnemer.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Naam"
                type="text"
                name="naam"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Postcode"
                type="text"
                name="postcode"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Huisnummer"
                type="text"
                name="huisnummer"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Telefoonnummer"
                type="text"
                name="telefoonnummer"
                fullWidth
              />
              <TextField
                margin="dense"
                label="Vast bedrag"
                type="number"
                name="vastBedrag"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Bedrag per ronde"
                type="number"
                name="rondeBedrag"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Vast bedrag (QR)"
                type="number"
                name="vastBedragQR"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Bedrag per ronde (QR)"
                type="number"
                name="rondeBedragQR"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ addDialogOpen: false })} color="primary">
                Annuleren
              </Button>
              <Button color="secondary" type="submit" variant="contained">
                Opslaan
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* edit user dialog */}
        {this.state.editDialogOpen ? <Dialog open={this.state.editDialogOpen} onClose={() => this.setState({ editDialogOpen: false })} aria-labelledby="form-dialog-title">
          <form noValidate id="editUserForm" action="#" method="POST" onSubmit={e => {
            e.preventDefault(); // remove the redirect
            fetch(serverUrl + '/api/editUser/', {
              method: 'post',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
              body: "naam=" + encodeURIComponent($("#editUserForm [name='naam']").val().toString()) +
                "&huisnummer=" + $("#editUserForm [name='huisnummer']").val() +
                "&postcode=" + $("#editUserForm [name='postcode']").val() +
                "&telefoonnummer=" + $("#editUserForm [name='telefoonnummer']").val() +
                "&vastBedrag=" + $("#editUserForm [name='vastBedrag']").val().toString().replace(',', '.') +
                "&rondeBedrag=" + $("#editUserForm [name='rondeBedrag']").val().toString().replace(',', '.') +
                "&vastBedragQR=" + $("#editUserForm [name='vastBedragQR']").val().toString().replace(',', '.') +
                "&rondeBedragQR=" + $("#editUserForm [name='rondeBedragQR']").val().toString().replace(',', '.') +
                "&id=" + this.state.currentPerson.id
            })
              .then(response => {
                if (response.status !== 200) {
                  throw "error server code: " + response.status;
                }
                this.setState({ editDialogOpen: false, dialogOpen: false });
                this.props.enqueueSnackbar('Persoon successvol bijgewerkt', {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
                this.props.loaded(false);
              })
              .catch((e) => {
                console.log(e);
                this.getData();
                this.setState({ editDialogOpen: false, dialogOpen: false });
                this.props.enqueueSnackbar('Persoon bijwerken mislukt', {
                  variant: 'error',
                  autoHideDuration: 5000,
                });
              });
          } // send the request and close dialog
          }>
            <DialogTitle id="form-dialog-title">Gegevens bijwerken</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vul hieronder de gegevens in van de deelnemer.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Naam"
                type="text"
                name="naam"
                defaultValue={this.state.currentPerson.naam}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Postcode"
                type="text"
                name="postcode"
                defaultValue={this.state.currentPerson.postcode}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Huisnummer"
                type="text"
                name="huisnummer"
                defaultValue={this.state.currentPerson.huisnummer}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Telefoonnummer"
                type="text"
                name="telefoonnummer"
                defaultValue={this.state.currentPerson.telefoonnummer}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Vast bedrag"
                type="number"
                name="vastBedrag"
                defaultValue={this.state.currentPerson.vastBedrag}
                disabled={(this.state.currentPerson.betaald!=0)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Bedrag per ronde"
                type="number"
                name="rondeBedrag"
                defaultValue={this.state.currentPerson.rondeBedrag}
                disabled={(this.state.currentPerson.betaald!=0)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Vast bedrag (QR)"
                type="number"
                name="vastBedragQR"
                defaultValue={this.state.currentPerson.vastBedragQR}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              <TextField
                margin="dense"
                label="Bedrag per ronde (QR)"
                type="number"
                name="rondeBedragQR"
                defaultValue={this.state.currentPerson.rondeBedragQR}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ editDialogOpen: false })} color="primary">
                Annuleren
              </Button>
              <Button color="secondary" type="submit" variant="contained">
                Opslaan
              </Button>
            </DialogActions>
          </form>
        </Dialog> : null}

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
                // dialog for paying in cash
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
                          itemData[itemData.findIndex(x => x.code === this.state.currentPerson.code)].betaald = 1;
                          this.setState({ paymentDialogOpen: false });
                        }
                        this.props.enqueueSnackbar('Betalen gelukt', {
                          variant: 'success',
                          autoHideDuration: 5000,
                        });
                        this.props.loaded(false);
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

                const person = localState.state.currentPerson;
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
                    itemData[itemData.findIndex(x => x.code === this.state.currentPerson.code)].betaald = 2;
                    this.setState({ paymentDialogOpen: false });
                  }
                }
                ).catch(() => {
                  this.props.enqueueSnackbar('Betalen zetten mislukt', {
                    variant: 'error',
                    autoHideDuration: 5000,
                  });
                });
                const person = localState.state.currentPerson;
                const amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2);
                window.location.href = 'sumupmerchant://pay/1.0?amount=' + amount
                + '&total=' + amount
                + '&affiliate-key=' + Config.sumup.affiliateKey
                + '&currency=' + Config.sumup.currency
                + '&title=' + Config.sumup.title
                + '&callback=' + Config.server.url + '/#Registratie';
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
