import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { createStyles, makeStyles, Theme, ThemeProvider, useTheme } from '@material-ui/core/styles';
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
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';

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

interface pageObject {
  [index: number]: {
    name: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    fab?: {
      name: string;
      icon: React.ReactNode;
      action: any;
    }
  }
  map: any;
}

function AppReact(props) {
  const theme = useTheme();
  const classes = useStyles(props);

  // States
  const [drawerState, setDrawer] = React.useState(false);
  const [pageValue, setPage] = React.useState(0);
  const [dialogState, setDialog] = React.useState({
    0: false
  });

  // Page list
  const pages:pageObject = [
    {
      name: 'Registatie',
      icon: <CreateIcon/>,
      content: <Typography variant="h6">Hello World</Typography>
    },
    {
      name: 'Stempels',
      icon: <PollIcon/>,
      content: <Typography variant="h6">Hello World</Typography>
    },
    {
      name: 'Transacties',
      icon: <AccountBalanceWalletIcon/>,
      content: <Typography variant="h6">Hello World</Typography>
    },
    {
      name: 'Instellingen',
      icon: <SettingsIcon/>,
      content: <Typography variant="h6">Instellingen</Typography>
    },
  ]

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

  return(
    <ThemeProvider theme={BedumerTheme}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {pages[pageValue].name}
          </Typography>
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
            <img src={BedumerLogo} className={classes.logo}/>
            <Typography variant="h6" className={classes.drawerTitle}>Winterloop</Typography>
            <Typography variant="body2" className={classes.drawerSubTitle}>Administratie</Typography>
            <Divider />
            {/* Menu list */}
            {pages.map((data, index) => (
              <ListItem button key={index} onClick={e => setPage(index)}>
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
      {/* FAB */}
      <Zoom
        in={pageValue === 0}
      >
        <Fab color="secondary" className={classes.fab} onClick={e => setDialog({0: true})}>
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
      {/* Dialogs */}
      <Dialog fullScreen={fullScreenDialog} open={dialogState[0]} onClose={e => setDialog({0: false})} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nieuwe wandelaar toevoegen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vul hieronder de gegevens in van de wandelaar.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Naam"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Huisnummer"
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Postcode"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Telefoonnummer"
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Vast bedrag"
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Bedrag per ronde"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setDialog({0: false})} color="primary">
            Annuleren
          </Button>
          <Button onClick={e => setDialog({0: false})} color="primary">
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <AppReact/>,
  $('div[data-type="main"]')[0]
);

// https://material-ui.com/getting-started/usage/
