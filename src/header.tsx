import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import BedumerTheme from './theme';

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
import BedumerLogo from './logo.js';

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
    }
  }),
);

export default function ButtonAppBar(props) {
  // Vars
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    left: false
  });
  const pages = props.pages;
  

  // Functions
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, ['left']: open });
  }

  function drawerBtnEvent(e, n) {
    // Update header to correct title
    ReactDOM.render(
      <ButtonAppBar pages={pages} index={n}/>,
      $('div[data-type="header"]')[0]
    );
    
    // Render page
    ReactDOM.render(
      pages[n].page,
      $('div[data-type="main"]')[0]
    );
  }

  // Render
  return (
    <ThemeProvider theme={BedumerTheme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              { props.pages[props.index].name }
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
              <img src={BedumerLogo} className={classes.logo}/>
              <Typography variant="h6" className={classes.drawerTitle}>Winterloop</Typography>
              <Typography variant="body2" className={classes.drawerSubTitle}>Administratie</Typography>
              <Divider />
              {pages.map((data, index) => (
                <ListItem button key={data.name} onClick={e => drawerBtnEvent(e, index)}>
                  <ListItemIcon>{data.icon}</ListItemIcon>
                  <ListItemText primary={data.name} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}