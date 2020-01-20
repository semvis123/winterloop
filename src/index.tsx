/* eslint-disable no-unused-vars */
import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { createStyles, makeStyles, Theme, ThemeProvider, useTheme, fade } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BedumerTheme from './theme';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BedumerLogo from './logo.js';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import StorageIcon from '@material-ui/icons/Storage';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InputBase from '@material-ui/core/InputBase';
import { withSnackbar, useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import { SnackbarProvider } from 'notistack';
import CountingList from './CountingList';
import PersonList from './PersonList';
import PaymentList from './PaymentList';
import * as Config from '../configuration.json';
import Status from './Status';
const serverUrl = Config.server.url + ':' + Config.server.port;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    },
    appbarTitle: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    drawerTitle: {
      marginLeft: 16,
      marginTop: 10
    },
    drawerSubTitle: {
      marginLeft: 16,
      marginBottom: 11
    },
    logo: {
      margin: 16,
      width: 218,
      boxSizing: 'content-box'
    },
    fab: {
      position: 'fixed',
      bottom: 16,
      right: 26,
    },
    settingsList: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    text: {
      color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    success: { color: 'white' },
    error: { color: 'white' },
    warning: { color: 'white' },
    info: { color: 'white' },
  }),
);


interface PersonObjectInterface {
  betaald: boolean;
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

interface pageObject {
  [index: number]: {
    name: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    appBar?: React.ReactNode;
    fab?: {
      name: string;
      icon: React.ReactNode;
      action: any;
    }
  }
  map: any;
}

function AppReact() {
  const theme = useTheme();
  const classes = useStyles(BedumerTheme);
  // States
  const [drawerState, setDrawer] = React.useState(false);
  const [pageValue, setPage] = React.useState(0);
  const [dialogState, setDialog] = React.useState({
    0: false
  });
  const [themeState, setTheme] = React.useState({
    dark: (localStorage.getItem('dark') == 'true') ? true : false
  })
  const [historyLoaded, setHistory] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  //snackbar inside this function
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Setup localstorage
  if (localStorage.getItem('dark') == undefined) { localStorage.setItem('dark', 'false') }

  // Page list
  const pages: pageObject = [
    {
      name: 'Registatie',
      icon: <CreateIcon />,
      content:
        <Typography component="div" className={classes.root}>
          <PersonList />
        </Typography>
    },
    {
      name: 'Rondes',
      icon: <PollIcon />,
      appBar: <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={(event: any) => {
            console.log(event.target.value);
            setSearchValue(event.target.value);
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>,
      content:
        <Typography component="div" className={classes.root}>
          <CountingList search={searchValue} />
        </Typography>
    },
    {
      name: 'Transacties',
      icon: <AccountBalanceWalletIcon />,
      appBar: <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={(event: any) => {
            console.log(event.target.value);
            setSearchValue(event.target.value);
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>,
      content: <Typography component="div" className={classes.root}>
        <PaymentList search={searchValue} />
      </Typography>
    },
    {
      name: 'Status',
      icon: <MonetizationOnIcon />,
      content: <Status />
    },
    {
      name: 'Instellingen',
      icon: <SettingsIcon />,
      content: <Typography component="div" className={classes.root}>
        <List subheader={<ListSubheader>Thema</ListSubheader>}>
          <ListItem button onClick={() => {
            var darkState = !themeState.dark;
            setTheme({ dark: darkState });
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
                onChange={() => {
                  var darkState = !themeState.dark;
                  setTheme({ dark: darkState });
                  localStorage.setItem('dark', (darkState) ? 'true' : 'false');
                  location.reload();
                }}
                checked={themeState.dark}
                inputProps={{ 'aria-labelledby': 'switch-list-label-dark' }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <List subheader={<ListSubheader>Database</ListSubheader>}>
          <ListItem button onClick={() => {
            fetch(serverUrl + '/api/getUsers/') // change this to yourip:4322
              .then(response => { var a = response.json(); return a })
              .then(data => {
                let persons = [["Id", "Naam", "Huisnummer", "Postcode", "Telefoonnummer", "Vast bedrag", "Ronde bedrag", "Rondes", "Aanmaak datum", "Code", "Totaalbedrag", "Betaald"]];
                data.forEach((person: PersonObjectInterface) => {
                  let amount = (person.rondeBedrag * person.rondes + person.vastBedrag ).toFixed(2);
                  let userArray = [
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
                    String(Boolean(person.betaald)? 1: 0)
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
              <IconButton edge="end" aria-label="download" onClick={() => {
                fetch(serverUrl + '/api/getUsers/')
                  .then(response => { var a = response.json(); return a })
                  .then(data => {
                    let persons = [["Id", "Naam", "Huisnummer", "Postcode", "Telefoonnummer", "Vast bedrag", "Ronde bedrag", "Rondes", "Aanmaak datum", "Code", "Totaalbedrag", "Betaald"]];
                    data.forEach((person: PersonObjectInterface) => {
                      let amount = (person.rondeBedrag * person.rondes + person.vastBedrag ).toFixed(2);
                      let userArray = [
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
                        String(Boolean(person.betaald)? 1: 0)
                      ];
                      persons.push(userArray);
                    })
                    const wb = XLSX.utils.book_new();
                    const wsAll = XLSX.utils.aoa_to_sheet(persons);
                    XLSX.utils.book_append_sheet(wb, wsAll, "Personen");
                    XLSX.writeFile(wb, "export.xlsx");
                  });
              }}>
                <GetAppIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={() => {
            fetch(serverUrl + '/api/emptyDB/', {
              method: 'post',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
            }).then((e) => {
              if (e.status !== 200) {
                console.log(e);
                enqueueSnackbar("Database legen mislukt", {
                    variant: 'error',
                    autoHideDuration: 5000
                });
              }
              else {
                enqueueSnackbar("Database succesvol geleegd", {
                    variant: 'success',
                    autoHideDuration: 5000
                });
                //success
              }
            });
          }}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText id="switch-list-label-dark" primary="Database legen" />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => {
                fetch(serverUrl + '/api/emptyDB/', {
                  method: 'post',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
                }).then((e) => {
                  if (e.status !== 200) {
                    console.log(e);
                    enqueueSnackbar("Database legen mislukt", {
                        variant: 'error',
                        autoHideDuration: 5000
                    });
                  }
                  else {
                    enqueueSnackbar("Database succesvol geleegd", {
                        variant: 'success',
                        autoHideDuration: 5000
                    });
                    //success
                  }
                });
              }}>
                <DeleteForeverIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Typography>
    },
  ]

  // Setting up history
  if (history.state == null) {
    history.replaceState(
      { page: 0 },
      pages[0].name,
      '#' + pages[0].name
    );
  }

  if (!historyLoaded) {
    setPage(history.state.page);
    setHistory(true);
  }

  // Add function for history change
  $(window).on('popstate', function() {
    setPage(history.state.page);
  });

  // Other vars
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  // Page object
  function Page(props: {
    value: number;
    index: number;
    children?: React.ReactNode;
  }) {
    return (
      <Typography
        component="div"
        hidden={props.value !== props.index}
      >
        {props.children}
      </Typography>
    )
  }

  // Functions
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setDrawer(open);
  }

  return (
    <ThemeProvider theme={BedumerTheme}>
      <SnackbarProvider maxSnack={3} classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
    }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.appbarTitle}>
            {pages[pageValue].name}
          </Typography>
          {pages[pageValue].appBar}
        </Toolbar>
      </AppBar>
      {/* Menu */}
      <Drawer open={drawerState} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <img src={BedumerLogo} className={classes.logo} />
            <Typography variant="h6" className={classes.drawerTitle}>Winterloop</Typography>
            <Typography variant="body2" className={classes.drawerSubTitle}>Administratie</Typography>
            <Divider />
            {/* Menu list */}
            {pages.map((data, index) => (
              <ListItem button key={index} onClick={() => {
                setPage(index);
                history.pushState(
                  { page: index },
                  data.name,
                  "#" + data.name
                );
              }}>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText>{data.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      {/* Pages */}
      {pages.map((data, index) => (
        <Page value={pageValue} index={index} key={index}>
          {data.content}
        </Page>
      ))}
    </SnackbarProvider>
    </ThemeProvider>
  )
}

ReactDOM.render(
    <AppReact />,
  $('div[data-type="main"]')[0]
);

// https://material-ui.com/getting-started/usage/
