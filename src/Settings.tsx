import {
  ListSubheader,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  ListItemText,
  IconButton,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import React from "react";
import { withSnackbar } from 'notistack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import * as XLSX from 'xlsx';
import * as Config from '../configuration.json';
import StorageIcon from '@mui/icons-material/Storage';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ListItemButton } from "@mui/material";

const serverUrl = Config.server.url + ':' + Config.server.port;

// Interfaces
interface state {

}

interface props {
  classes?: any;
  enqueueSnackbar: any;
  themeState: boolean;
  setThemeState: Function;
}

interface PersonObjectInterface {
  betaald: number;
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

// Static vars
// Won't be deleted when component updates

// Component
export default withStyles({
  root: {
    flexGrow: 1,
    color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
  },
})(withSnackbar(class Settings extends React.Component<props> {
  // Set intefaces
  props: props;
  state: state;

  // Global vars
  _isMounted:boolean = false;

  // When created
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Renderer
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>Thema</ListSubheader>}>
          <ListItemButton onClick={() => {
            const darkState = !this.props.themeState;
            this.props.setThemeState(darkState);
            localStorage.setItem('dark', (darkState) ? 'true' : 'false');
            location.reload();
          }}>
            <ListItemIcon>
              <Brightness4Icon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-dark" primary="Donkere modus" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={this.props.themeState}
                inputProps={{ 'aria-labelledby': 'switch-list-label-dark' }}
              />
            </ListItemSecondaryAction>
          </ListItemButton>
        </List>

        <List subheader={<ListSubheader>Database</ListSubheader>}>
            <ListItemButton onClick={() => {
              fetch(serverUrl + '/api/getUsers/') // change this to yourip:4322
                .then(response => response.json())
                .then(data => {
                  const persons = [["Id", "Naam", "Huisnummer", "Postcode", "Telefoonnummer", "Vast bedrag", "Ronde bedrag", "Rondes", "Aanmaak datum", "Code", "Totaalbedrag", "Betaald"]];
                  data.forEach((person: PersonObjectInterface) => {
                    const amount = (person.rondeBedrag * person.rondes + person.vastBedrag).toFixed(2);
                    const userArray = [
                      person.id.toString(),
                      person.naam,
                      person.huisnummer,
                      person.postcode,
                      person.telefoonnummer,
                      person.vastBedrag.toString(),
                      person.rondeBedrag.toString(),
                      person.rondes.toString(),
                      person.create_time,
                      person.code,
                      amount,
                      String(person.betaald)
                    ];
                    persons.push(userArray);
                  })
                  const wb = XLSX.utils.book_new();
                  const wsAll = XLSX.utils.aoa_to_sheet(persons);
                  XLSX.utils.book_append_sheet(wb, wsAll, "Personen");
                  XLSX.writeFile(wb, "export.xlsx");
                });
            }}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText id="switch-list-label-dark" primary="Database Exporteren naar Excel" />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="download"
                  size="large">
                  <GetAppIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton onClick={() => {
              const confirmation = confirm("Weet je zeker dat je de database wilt legen?");
              if (!confirmation) {
                return;
              }
              fetch(serverUrl + '/api/emptyDB/', {
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
              }).then((e) => {
                if (e.status !== 200) {
                  console.log(e);
                }
                else {
                  alert("database successvol geleegd.");
                  //success
                }
              });
            }}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText id="switch-list-label-dark" primary="Database legen" />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  size="large">
                  <DeleteForeverIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
      </div>
    );
  }
}));