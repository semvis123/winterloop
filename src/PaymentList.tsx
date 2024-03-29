import React = require('react');
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
import { Typography } from '@mui/material';
import { withSnackbar } from 'notistack';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import type { PaymentListInterface, PaymentListStateInterface, PersonObjectInterface } from './index.d';

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
const styles: any = {
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
      <ListItemButton style={style} divider key={index} onClick={() => !localState.state.listClickDisabled ? localState.setState({ dialogOpen: true, currentPerson: itemData[index] }) : null}>
        <ListItemText key="code" primary={itemData[index].naam} secondary={itemData[index].code} />
        <ListItemText key="payedParent" primary={
          <Typography key="payed" align="center" style={styles.betaald}>{
            (itemData[index].betaald == 0) ? '' : ((itemData[index].betaald == 1) ? 'CONTANT BETAALD' : 'BETAALD MET PIN')
          }</Typography>
        } />
        <ListItemText primary={
          <Typography align="right">€ {
            (itemData[index].rondes * itemData[index].rondeBedrag + itemData[index].vastBedrag)
              .toFixed(2)
              .replace('.', ',')
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
          }</Typography>
        } />
      </ListItemButton>
    );
  }

  getData() {
    // Haal de data op van de database
    fetch(serverUrl + '/api/getUsers/')
      .then(response => {
        if (response.status !== 200) {
          throw "error server code: " + response.status;
        }
        return response.json();
       }
      )
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
        if (localState._isMounted) {
          localState.setState({ rendered: renderedData, listClickDisabled: true });
        }
        _hasFailed = true;
      })
  }

  componentDidMount() {
    this._isMounted = true;
    localState = this;
    if (!_hasLoaded && !_hasFailed || !this.props.shouldload) {
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
      </div>
      this.setState({ rendered: renderedData });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    console.log(this);
    return (
      <div>
        {this.state.rendered || <LinearProgress />} {/*loader moet nog gecenterd worden */}

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
              <DialogContentText>Vast bedrag (QR): €{
                this.state.currentPerson.vastBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Ronde bedrag (QR): €{
                this.state.currentPerson.rondeBedragQR.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
              </DialogContentText>
              <DialogContentText>Aantal rondes: {this.state.currentPerson.rondes}</DialogContentText>
              <DialogContentText>Te betalen: €{
                (this.state.currentPerson.vastBedrag + (this.state.currentPerson.rondeBedrag * this.state.currentPerson.rondes))
                  .toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }</DialogContentText>
              <DialogContentText>Code: {this.state.currentPerson.code}</DialogContentText>
              <DialogContentText>Betaald: {
                (this.state.currentPerson.betaald == 0) ? 'nee' : ((this.state.currentPerson.betaald == 1) ? 'contant' : 'pin')
              }</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
                Annuleren
                </Button>
              <Button onClick={() => {
                this.setState({ paymentDialogOpen: true, currentNameSetRound: '', personEdit: '' })
              }} color="secondary" disabled={(this.state.currentPerson.betaald != 0)} variant="contained">
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
                          itemData[itemData.indexOf(this.state.currentPerson)].betaald = 1;
                          this.setState({ paymentDialogOpen: false });
                          this.props.loaded(false);
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
                    }} color="secondary" variant="contained">
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
              }} color="secondary" variant="contained">
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
                    itemData[itemData.indexOf(this.state.currentPerson)].betaald = 2;
                    this.setState({ paymentDialogOpen: false });
                    this.props.loaded(false);
                  }
                }
                ).catch(() => {
                  this.props.enqueueSnackbar('Betalen mislukt', {
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
                + '&callback=' + Config.server.url + '/#Transacties';
                this.props.enqueueSnackbar('Betalen gelukt', {
                  variant: 'success',
                  autoHideDuration: 5000,
                });
              }} color="secondary" variant="contained">
                Sumup
                </Button>
            </DialogActions>
          </Dialog>

        ) : null}

      </div>
    );

  }
});
