import React = require('react');
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ from 'jquery';
import { withSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Zoom, Fab, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

import * as Config from '../configuration.json';
import theme from './theme';

// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

// Define interfaces

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
  betaald: boolean;
}

interface PersonListStateInterface {
  paymentDialogOpen: boolean;
  persons?: React.ReactNode,
  dialogOpen: boolean;
  currentPerson: PersonObjectInterface;
  listClickDisabled: boolean;
  addDialogOpen: boolean;
  editDialogOpen: any;
  data?: any;
}

// Static vars
// Deze worden niet verwijdert als het component herlaad
let _hasLoaded: boolean = false;
let _hasFailed: boolean = false;
let renderedData: React.ReactNode;
let localState: any;
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
  },
}


// Dit is de lijst voor alle personen
export default withSnackbar(class PersonList extends React.Component {
  // Define interfaces
  // To keep TypeScript happy
  state: PersonListStateInterface;

  props: {
    enqueueSnackbar: any;
    closeSnackbar: any;
  }

  // Global vars
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      persons: null,
      dialogOpen: false,
      currentPerson: null,
      listClickDisabled: false,
      addDialogOpen: false,
      editDialogOpen: false,
      paymentDialogOpen: false
    };

    if (_hasLoaded && !_hasFailed) {
      this.state = {
        ...this.state,
        persons: renderedData,
      }
    }
  }
  renderItem({ index, style }) {
    return (
      <ListItem style={style} divider button key={index} onClick={() => !localState.state.listClickDisabled ? localState.setState({ dialogOpen: true, currentPerson: itemData[index] }) : null}>
        <ListItemText id={itemData[index].id.toString()} primary={itemData[index].naam} secondary={itemData[index].code} />
      </ListItem>
    )
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => {
        if (response.status !== 200) {
          throw "error server code: " + response.status;
        }
        var a = response.json();
        return a;
      }).then(data => {
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

        // Update component when it is mounted
        localState.setState({
          persons: renderedData,
          listClickDisabled: false
        });

      }).catch((e) => {
        console.log(e);
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
          persons: renderedData,
          listClickDisabled: true
        }) : null;

        _hasFailed = true;
      });
  }

  componentDidMount() {
    this._isMounted = true;
    localState = this;
    if (!_hasLoaded && !_hasFailed) {
      _hasLoaded = true;
      setTimeout(() => { this.getData() }, 0);
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

        {this.state.persons ? (this.state.persons) : <CircularProgress color="secondary" />} {/* Moet een skeleton worden */}
        {this.state.dialogOpen ? (
          <Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              <IconButton aria-label="edit" style={style.editButton} onClick={() => {
                this.setState({
                  editDialogOpen: true
                });
              }}>
                <EditIcon />
              </IconButton>
              {this.state.currentPerson.naam}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>id: {this.state.currentPerson.id}</DialogContentText>
              <DialogContentText>postcode: {this.state.currentPerson.postcode}</DialogContentText>
              <DialogContentText>huisnummer: {this.state.currentPerson.huisnummer}</DialogContentText>
              <DialogContentText>telefoonnummer: {this.state.currentPerson.telefoonnummer}</DialogContentText>
              <DialogContentText>vast bedrag: €{
                this.state.currentPerson.vastBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>ronde bedrag: €{
                this.state.currentPerson.rondeBedrag.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>aanmaak datum: {this.state.currentPerson.create_time}</DialogContentText>
              <DialogContentText>betaald: {(this.state.currentPerson.betaald) ? 'ja' : 'nee'}</DialogContentText>
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
              }} color="secondary">
                Verwijderen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {/* add user dialog */}
        <Dialog open={this.state.addDialogOpen} onClose={() => this.setState({ addDialogOpen: false })} aria-labelledby="form-dialog-title">
          <form id="addUserForm" action="#" method="POST" onSubmit={e => {
            e.preventDefault(); // remove the redirect
            fetch(serverUrl + '/api/addUser/', {
              method: 'post',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
              body: "naam=" + $("#addUserForm [name='naam']").val() +
                "&huisnummer=" + $("#addUserForm [name='huisnummer']").val() +
                "&postcode=" + $("#addUserForm [name='postcode']").val() +
                "&telefoonnummer=" + $("#addUserForm [name='telefoonnummer']").val() +
                "&vastBedrag=" + $("#addUserForm [name='vastBedrag']").val() +
                "&rondeBedrag=" + $("#addUserForm [name='rondeBedrag']").val()
            })
              .then(response => {
                if (response.status !== 200) {
                  throw "error server code: " + response.status;
                }
                var a = response.json();
                return a
              })
              .then((a) => {
                this.setState({ addDialogOpen: false });
                this.props.enqueueSnackbar('Persoon toegevoegd met code: ' + a.code, {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
                this.getData();
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
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ addDialogOpen: false })} color="primary">
                Annuleren
              </Button>
              <Button onClick={() => this.setState({ addDialogOpen: false })} color="primary" type="submit">
                Opslaan
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* edit user dialog */}
        {this.state.editDialogOpen ? <Dialog open={this.state.editDialogOpen} onClose={() => this.setState({ editDialogOpen: false })} aria-labelledby="form-dialog-title">
          <form id="editUserForm" action="#" method="POST" onSubmit={e => {
            e.preventDefault(); // remove the redirect
            fetch(serverUrl + '/api/editUser/', {
              method: 'post',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
              body: "naam=" + $("#editUserForm [name='naam']").val() +
                "&huisnummer=" + $("#editUserForm [name='huisnummer']").val() +
                "&postcode=" + $("#editUserForm [name='postcode']").val() +
                "&telefoonnummer=" + $("#editUserForm [name='telefoonnummer']").val() +
                "&vastBedrag=" + $("#editUserForm [name='vastBedrag']").val() +
                "&rondeBedrag=" + $("#editUserForm [name='rondeBedrag']").val() +
                "&id=" + this.state.currentPerson.id
            })
              .then(response => {
                if (response.status !== 200) {
                  throw "error server code: " + response.status;
                }
                this.getData();
                this.setState({ editDialogOpen: false, dialogOpen: false });
                this.props.enqueueSnackbar('Persoon successvol bijgewerkt', {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
                this.getData();
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
              <Button color="primary" type="submit">
                Opslaan
              </Button>
            </DialogActions>
          </form>
        </Dialog> : null}

        {/* paynent dialog */}
        {this.state.paymentDialogOpen ? (
          <Dialog open={this.state.paymentDialogOpen} onClose={() => this.setState({ paymentDialogOpen: false, personEdit: '' })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Betalen</DialogTitle>
            <DialogContent>
              <DialogContentText>Wilt u contant of met Sumup betalen?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ paymentDialogOpen: false, personEdit: '' })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {

                const action = key => (
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
                  body: "code=" + this.state.currentPerson.code + "&payed=1"
                }).then((e) => {
                  if (e.status !== 200) {
                    throw e.status;
                  } else {
                    this.setState({ paymentDialogOpen: false });
                  }
                }
                ).catch(() => {
                  this.props.enqueueSnackbar('Betalen mislukt', {
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
