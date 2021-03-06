import React = require('react');
import Typography from '@material-ui/core/Typography';
import * as Config from '../configuration.json';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


// Grab server url from configuration file
const serverUrl = Config.server.url + ':' + Config.server.port;

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

// Static vars
// Deze worden niet verwijdert als het component herlaad
let _hasLoaded: boolean = false;
let _hasFailed: boolean = false;
let renderedData: React.ReactNode;
let localState: any;
let style: any = {
  title: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    textAlign: 'center',
  },
  text: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
  },
  value: {
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    float: 'right',
  },
  card: {
    marginTop: 10,
    maxWidth: 500,
    margin: '0 auto',
    borderWidth: 10
  }
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
      persons: 0
    };

    if (_hasLoaded && !_hasFailed) {
      this.state = {
        ...this.state,
        rendered: renderedData,
      }
    }
  }
  getData() {
    // Haal de data op van de database
    this._isMounted ? fetch(serverUrl + '/api/getUsers/')
      .then(response => { var a = response.json(); return a })
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
        let persons = 0;
        data.forEach((person: PersonObjectInterface) => {
          totalRound += person.rondes;
          avgRound += person.rondes;
          roundValue += person.rondeBedrag * person.rondes;
          avgRoundValue += person.rondeBedrag * person.rondes;
          fixedValue += person.vastBedrag;
          avgFixedValue += person.vastBedrag;
          totalValue += person.rondes * person.rondeBedrag + person.vastBedrag;
          avgTotalValue += person.rondes * person.rondeBedrag + person.vastBedrag;
          persons++;
        });
        avgRound /= persons;
        avgTotalValue /= persons;
        avgRoundValue /= persons;
        avgFixedValue /= persons;
        this._isMounted ? localState.setState({
          totalRound: totalRound,
          avgRound: avgRound,
          totalValue: totalValue,
          avgTotalValue: avgTotalValue,
          roundValue: roundValue,
          avgRoundValue: avgRoundValue,
          fixedValue: fixedValue,
          avgFixedValue: avgFixedValue,
          persons: persons
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
    if (!_hasLoaded && !_hasFailed) {
      setTimeout(() => { this.getData() }, 0);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    if (renderedData == null || !_hasLoaded) {
      renderedData = (
        <Card style={style.card} raised={true}>
          <CardContent>
            <Typography style={style.title} gutterBottom variant="h5"><b>Opbrengsten</b></Typography>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst</b>
              <span style={style.value}>€ {
                this.state.totalValue.toFixed(2) // always two decimal digits
                  .replace('.', ',') // replace decimal point character with ,
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')// use . as a separator
              }</span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van rondes</b>
              <span style={style.value}>€ {
                this.state.roundValue.toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }
              </span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Totale opbrengst van vaste bedragen</b>
              <span style={style.value}>€ {
                this.state.fixedValue.toFixed(2)
                  .replace('.', ',')
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }
              </span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst</b>
              <span style={style.value}>€ {
                (this.state.avgTotalValue.toFixed(2) == "NaN") ? '0,00' :
                  this.state.avgTotalValue.toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }
              </span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van rondes</b>
              <span style={style.value}>€ {
                (this.state.avgRoundValue.toFixed(2) == "NaN") ? '0,00' :
                  this.state.avgRoundValue.toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }
              </span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Gemiddelde opbrengst van vaste bedragen</b>
              <span style={style.value}>€ {
                (this.state.avgFixedValue.toFixed(2) == "NaN") ? '0,00' :
                  this.state.avgFixedValue.toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

              }
              </span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Aantal lopers</b>
              <span style={style.value}>{this.state.persons}</span>
            </Typography>
            <Typography style={style.text} gutterBottom><b>Gemiddeld aantal rondes</b>
              <span style={style.value}>{
                (this.state.avgRound.toFixed(2) == "NaN") ? '0,00' :
                  this.state.avgRound.toFixed(2)
                    .replace('.', ',')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
              }</span>
            </Typography>
          </CardContent>
        </Card>)
    }
    return (<div>
      {renderedData}
    </div>);
  }
}
