import React from "react";
import $ from 'jquery';
import './style.scss';
import CreateIcon from '@mui/icons-material/Create';
import PollIcon from '@mui/icons-material/Poll';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Theme, alpha } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import BedumerTheme from './theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BedumerLogo from './logo.js';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InputBase from '@mui/material/InputBase';
import CountingList from './CountingList';
import PersonList from './PersonList';
import PaymentList from './PaymentList';
import Status from './Status';
import Settings from './Settings';
import { SnackbarProvider } from "notistack";
import type { pageObject } from "./index.d";

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
      boxSizing: 'content-box',
      backgroundColor: (localStorage.getItem('dark') == 'true') ? '#000000' : '#ffffff',
    },
    logoAppBar: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },    
        margin: 16,
        width: 218,
        boxSizing: 'content-box',
        backgroundColor: (localStorage.getItem('dark') == 'true') ? '#000000' : '#ffffff',      
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
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 10,
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


export default function Main() {
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


    return <>
            <SnackbarProvider maxSnack={3} classes={{
          variantSuccess: classes.success,
          variantError: classes.error,
          variantWarning: classes.warning,
          variantInfo: classes.info,
        }}>
              {/* Header */}
              <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                size="large">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.appbarTitle}>
                {pages[pageValue].name}
              </Typography>

              <img src={BedumerLogo} className={classes.logoAppBar} />

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
                  <ListItemButton key={index} onClick={() => {
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
                  </ListItemButton>
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
    </>
}