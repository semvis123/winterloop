import React = require('react');
import $ from 'jquery';
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
import { Typography } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

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
  betaald: boolean;
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
  rendered?: React.ReactNode;

  dialogOpen: boolean;
  currentPerson: PersonObjectInterface;
  listClickDisabled: boolean;
  paymentDialogOpen: boolean;
  codes: {
    [index: number]: number;
  }
  currentNameSetRound: string;
  setRoundButtonDisabled: boolean;
  personEdit: string;
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
let styles: any = {
  betaald: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
};
// Dit is de lijst voor de rondes
export default withSnackbar(class PaymentList extends React.Component<PaymentListInterface> {
  // Define interfaces
  // To keep TypeScript happy
  state: PaymentListStateInterface;

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
      paymentDialogOpen: false,
      codeError: false,
      codes: [],
      currentNameSetRound: "",
      setRoundButtonDisabled: true,
      personEdit: ""
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
          <Typography align="center" style={styles.betaald}>{Boolean(itemData[index].betaald) ? 'BETAALD' : ''}</Typography>
        } />
        <ListItemText primary={
          <Typography align="right">€ {
            (itemData[index].rondes * itemData[index].rondeBedrag + itemData[index].vastBedrag)
              .toFixed(2)
              .replace('.', ',')
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
          }</Typography>
        } />
      </ListItem>
    )
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
      .then(data => {
        if (localState._isMounted) {
          localState.setState({ persons: data, listClickDisabled: false });
          unfilteredPersons = data;
          itemData = data;
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
      })
      .catch((e) => {
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
            "code": '000000',
            "create_time": "2019-12-27T15:16:48.000Z",
            "betaald": 0
          }
        ]
        itemData = data;
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
      })
  }

  componentDidMount() {
    this._isMounted = true;
    localState = this;
    if (!_hasLoaded && !_hasFailed || !this.props.shouldload) {
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
        {this.state.rendered ? (this.state.rendered) : <CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}

        {/* dialog for person information */}
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
              <DialogContentText>Te betalen: €{
                (this.state.currentPerson.vastBedrag + (this.state.currentPerson.rondeBedrag * this.state.currentPerson.rondes))
                  .toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
              <DialogContentText>Betaald: {Boolean(this.state.currentPerson.betaald) ? 'ja' : 'nee'}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                this.setState({ paymentDialogOpen: true, currentNameSetRound: '', personEdit: '' })
              }} color="secondary" disabled={Boolean(this.state.currentPerson.betaald)}>
                Betalen
                </Button>
            </DialogActions>
          </Dialog>
        ) : null}


        {this.state.paymentDialogOpen ? (
          <Dialog open={this.state.paymentDialogOpen} onClose={() => this.setState({ paymentDialogOpen: false, currentNameSetRound: '', personEdit: '' })} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Betalen</DialogTitle>
            <DialogContent>
              <DialogContentText>Wilt u contant of met Sumup betalen?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ paymentDialogOpen: false, currentNameSetRound: '', personEdit: '' })} color="primary">
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
                          itemData[itemData.indexOf(this.state.currentPerson)].betaald = true;
                          this.setState({ paymentDialogOpen: false });
                          this.forceUpdate();
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
                    itemData[itemData.indexOf(this.state.currentPerson)].betaald = true;
                    this.setState({ paymentDialogOpen: false });
                    this.forceUpdate();
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
