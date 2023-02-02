import React = require('react');
import Typography from '@mui/material/Typography';
import * as Config from '../configuration.json';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ListItem } from '@mui/material';
import { PersonObjectInterface } from './index.d';


// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

// Static vars
// Deze worden niet verwijdert als het component herlaad
let _hasLoaded: boolean = false;
let _hasFailed: boolean = false;
let renderedData: React.ReactNode;
let localState: any;
const style: any = {
  title: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    textAlign: 'center',
  },
  text: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  value: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    float: 'right',
  },
  card: {
    marginTop: 10,
    maxWidth: 650,
    margin: '0 auto',
    borderWidth: 10
  },
  cardContainer: {
    marginTop: 30,
  },
}
export default class Status extends React.Component {
  state: {
    totalRound: number,
    avgRound: number,
    totalValue: number,
    avgTotalValue: number,
    roundValue: number,
    avgRoundValue: number,
    fixedValue: number,
    avgFixedValue: number,

    roundValueNormal: number,
    avgRoundValueNormal: number,
    fixedValueNormal: number,
    avgFixedValueNormal: number,

    roundValueQR: number,
    avgRoundValueQR: number,
    fixedValueQR: number,
    avgFixedValueQR: number,


    persons: number,
    rendered?: React.ReactNode
  };
  _isMounted: any;
  constructor(props) {
    super(props);
    this.state = {
      totalRound: 0,
      avgRound: 0,
      totalValue: 0,
      avgTotalValue: 0,
      roundValue: 0,
      avgRoundValue: 0,
      fixedValue: 0,
      avgFixedValue: 0,
      persons: 0,

      roundValueNormal: 0,
      avgRoundValueNormal: 0,
      fixedValueNormal: 0,
      avgFixedValueNormal: 0,

      roundValueQR: 0,
      avgRoundValueQR: 0,
      fixedValueQR: 0,
      avgFixedValueQR: 0,
    };
  }
  getData() {
    // Haal de data op van de database
    this._isMounted ? fetch(serverUrl + '/api/getUsers/')
      .then(response => response.json())
      .then(data => {
        // calculate values
        let totalRound = 0;
        let avgRound = 0;
        let totalValue = 0;
        let avgTotalValue = 0;
        let roundValue = 0;
        let avgRoundValue = 0;
        let fixedValue = 0;
        let avgFixedValue = 0;


        let roundValueNormal = 0;
        let avgRoundValueNormal = 0;
        let fixedValueNormal = 0;
        let avgFixedValueNormal = 0;

        let roundValueQR = 0;
        let avgRoundValueQR = 0;
        let fixedValueQR = 0;
        let avgFixedValueQR = 0;


        let persons = 0;
        data.forEach((person: PersonObjectInterface) => {
          totalRound += person.rondes;
          avgRound += person.rondes;
          roundValue += person.rondeBedrag * person.rondes + person.rondeBedragQR * person.rondes;
          avgRoundValue += person.rondeBedrag * person.rondes + person.rondeBedragQR * person.rondes;
          fixedValue += person.vastBedrag + person.vastBedragQR;
          avgFixedValue += person.vastBedrag + person.vastBedragQR;

          roundValueNormal += person.rondeBedrag * person.rondes;
          avgRoundValueNormal += person.rondeBedrag * person.rondes;
          roundValueQR += person.rondeBedragQR * person.rondes;
          avgRoundValueQR += person.rondeBedragQR * person.rondes;

          fixedValueNormal += person.vastBedrag;
          avgFixedValueNormal += person.vastBedrag;
          fixedValueQR += person.vastBedragQR;
          avgFixedValueQR += person.vastBedragQR;

          totalValue += person.rondes * person.rondeBedrag + person.vastBedrag + person.rondes * person.rondeBedragQR + person.vastBedragQR;
          avgTotalValue += person.rondes * person.rondeBedrag + person.vastBedrag + person.rondes * person.rondeBedragQR + person.vastBedragQR;
          persons++;
        });
        avgRound /= persons;
        avgTotalValue /= persons;
        avgRoundValue /= persons;
        avgFixedValue /= persons;
        avgRoundValueNormal /= persons;
        avgRoundValueQR /= persons;
        avgFixedValueNormal /= persons;
        avgFixedValueQR /= persons;


        this._isMounted ? localState.setState({
          totalRound,
          avgRound,
          totalValue,
          avgTotalValue,
          roundValue,
          avgRoundValue,
          fixedValue,
          avgFixedValue,
          persons,

          roundValueNormal,
          avgRoundValueNormal,
          fixedValueNormal,
          avgFixedValueNormal,

          roundValueQR,
          avgRoundValueQR,
          fixedValueQR,
          avgFixedValueQR,
        }) : null;
        _hasLoaded = true;
      })
      .catch(() => {
        this._isMounted ? localState.setState(
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
                "vastBedragQR": 0,
                "rondeBedragQR": 0,
                "rondes": 0,
                "code": '000000',
                "create_time": "2019-12-27T15:16:48.000Z",
                "betaald": 0
              }
            ], listClickDisabled: true
          }) : null
        _hasFailed = true;
      }) : null;

  }
  componentDidMount() {
    this._isMounted = true;
    localState = this;
    setTimeout(() => { this.getData() }, 0);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const currencyFormatter = Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    })
    const formatMoney = (amount) => currencyFormatter.format(Number.isNaN(amount) ? 0 : amount)
    
    renderedData = (
      <Card sx={style.card} raised={true}>
        <CardContent>
          <ListItem divider>
            <Typography style={style.title} gutterBottom variant="h5"><b>Statistieken</b></Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst</b>
              <span style={style.value}>{
                formatMoney(this.state.totalValue)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van rondes</b>
            <span style={style.value}>{
                formatMoney(this.state.roundValue)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van vaste bedragen</b>
              <span style={style.value}>{
                formatMoney(this.state.fixedValue)
              }</span>
            </Typography>
          </ListItem>




          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst (normaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.fixedValueNormal + this.state.roundValueNormal)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van rondes (normaal)</b>
            <span style={style.value}>{
                formatMoney(this.state.roundValueNormal)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van vaste bedragen (normaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.fixedValueNormal)
              }</span>
            </Typography>
          </ListItem>



          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst (QR)</b>
              <span style={style.value}>{
                formatMoney(this.state.fixedValueQR + this.state.roundValueQR)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van rondes (QR)</b>
            <span style={style.value}>{
                formatMoney(this.state.roundValueQR)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van vaste bedragen (QR)</b>
              <span style={style.value}>{
                formatMoney(this.state.fixedValueQR)
              }</span>
            </Typography>
          </ListItem>






          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst</b>
              <span style={style.value}>{
                formatMoney(this.state.avgTotalValue)
              }</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van rondes (normaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgRoundValueNormal)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van vaste bedragen (normaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgFixedValueNormal)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van rondes (QR)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgRoundValueQR)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van vaste bedragen (QR)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgFixedValueQR)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van rondes (Totaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgRoundValue)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van vaste bedragen (Totaal)</b>
              <span style={style.value}>{
                formatMoney(this.state.avgFixedValue)
              }
              </span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Aantal lopers</b>
              <span style={style.value}>{this.state.persons}</span>
            </Typography>
          </ListItem>
          <ListItem divider>
            <Typography style={style.text} gutterBottom><b>Gemiddeld aantal rondes</b>
              <span style={style.value}>{
                (this.state.avgRound.toFixed(2) == "NaN") ? '0,00' :
                  this.state.avgRound.toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }</span>
            </Typography>
          </ListItem>
        </CardContent>
      </Card>)
    
    return (<div style={style.cardContainer}>
      {renderedData}
    </div>);
  }
}
