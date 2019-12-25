import React = require('react');
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// Header
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// Drawer
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

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
      marginTop: 110
    },
    drawerSubTitle: {
      marginLeft: 16,
      marginBottom: 11
    }
  }),
);

export default function ButtonAppBar(props) {
  // Vars
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    left: false
  });

  // Functions
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, ['left']: open });
  }

  // Render
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            { props.title }
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={state.left} onClose={toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <Typography variant="h6" className={classes.drawerTitle}>Winterloop</Typography>
            <Typography variant="body2" className={classes.drawerSubTitle}>Administratie</Typography>
            <Divider />
            <ListItem button key="Registratie">
              <ListItemIcon><CreateIcon /></ListItemIcon>
              <ListItemText primary="Registratie"/>
            </ListItem>
            <ListItem button key="Stempels">
              <ListItemIcon><PollIcon /></ListItemIcon>
              <ListItemText primary="Stempels"/>
            </ListItem>
            <ListItem button key="Transacties">
              <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
              <ListItemText primary="Transacties"/>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}