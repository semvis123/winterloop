/* eslint-disable no-unused-vars */
import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { createStyles, makeStyles, Theme, ThemeProvider, fade } from '@material-ui/core/styles';
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
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import InputBase from '@material-ui/core/InputBase';
import { SnackbarProvider } from 'notistack';
import CountingList from './CountingList';
import PersonList from './PersonList';
import PaymentList from './PaymentList';
import Status from './Status';
import Settings from './Settings';


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
  const classes = useStyles(BedumerTheme);
  
  // States
  const [drawerState, setDrawer] = React.useState(false);
  const [pageValue, setPage] = React.useState(0);
  const [themeState, setTheme] = React.useState({
    dark: (localStorage.getItem('dark') == 'true') ? true : false
  });
  const [historyLoaded, setHistory] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const [loadedData, setLoadedData] = React.useState(false);

  // Setup localstorage
  if (localStorage.getItem('dark') == undefined) { localStorage.setItem('dark', 'false') }

  const loadedDataFunc = (bool: boolean = true) => {
    setLoadedData(bool);
  }

  // Page list
  const pages: pageObject = [
    {
      name: 'Registratie',
      icon: <CreateIcon />,
      appBar: <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Zoeken…"
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
          <PersonList search={searchValue} loaded={loadedDataFunc} shouldload={loadedData} />
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
          placeholder="Zoeken…"
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
          <CountingList search={searchValue} loaded={loadedDataFunc} shouldload={loadedData} />
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
          placeholder="Zoeken…"
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
        <PaymentList search={searchValue} loaded={loadedDataFunc} shouldload={loadedData} />
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
      content: <Settings
        themeState={themeState.dark}
        setThemeState={(e) => {setTheme(e)}}></Settings>
    },
  ]

  // Setting up history
  if (history.state == null) {
    history.replaceState(
      { page: 0 },
      pages[0].name,
      '#' + pages[0].name
    );
    document.title = pages[0].name;
  }

  if (!historyLoaded) {
    document.title = pages[history.state.page].name;
    setPage(history.state.page);
    setHistory(true);
  }

  // Add function for history change
  $(window).on('popstate', function() {
    setPage(history.state.page);
    window.scrollTo(0, 0);
    document.title = pages[history.state.page].name;
  });

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
                  setLoadedData(false);
                  history.pushState(
                    { page: index },
                    data.name,
                    "#" + data.name
                  );
                  document.title = data.name;
                  window.scrollTo(0, 0);
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
            {(pageValue == index) ? data.content : null}
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
