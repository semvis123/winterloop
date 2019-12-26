import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
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
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
      position: 'absolute',
      bottom: 16,
      right: 26,
    }
  }),
);

function AppReact(props) {
  const classes = useStyles(props);
  let [drawerOpen, setState] = React.useState(false);
  const [pageValue, setValue] = React.useState(0);
  const pageList = ['Registratie','Stempels','Transacties'];

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

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState(open);
  }

  return(
    <ThemeProvider theme={BedumerTheme}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {pageList[pageValue]}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Menu */}
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <img src={BedumerLogo} className={classes.logo}/>
            <Typography variant="h6" className={classes.drawerTitle}>Winterloop</Typography>
            <Typography variant="body2" className={classes.drawerSubTitle}>Administratie</Typography>
            <Divider />
            {/* Menu list */}
            <ListItem button key="Registratie" onClick={e => setValue(0)}>
              <ListItemIcon><CreateIcon/></ListItemIcon>
              <ListItemText primary="Registratie" />
            </ListItem>
            <ListItem button key="Stempels" onClick={e => setValue(1)}>
              <ListItemIcon><PollIcon/></ListItemIcon>
              <ListItemText primary="Stempels" />
            </ListItem>
            <ListItem button key="Transacties" onClick={e => setValue(2)}>
              <ListItemIcon><AccountBalanceWalletIcon/></ListItemIcon>
              <ListItemText primary="Transacties" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      {/* Pages */}
      <Page value={pageValue} index={0}>First Page</Page>
      <Page value={pageValue} index={1}>Second Page</Page>
      <Page value={pageValue} index={2}>Last Page</Page>
      {/* FAB */}
      <Zoom
        in={pageValue === 0}
      >
        <Fab color="secondary" className={classes.fab}>
          <AddIcon/>
        </Fab>
      </Zoom>
      <Zoom
        in={pageValue === 1}
      >
        <Fab color="secondary" className={classes.fab}>
          <SearchIcon/>
        </Fab>
      </Zoom>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <AppReact/>,
  $('div[data-type="main"]')[0]
);

// https://material-ui.com/getting-started/usage/