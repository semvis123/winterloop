import React = require('react');
import { createStyles, makeStyles, Theme, withStyles, withTheme  } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { fullScreenDialog,useStyles } from './index';
import BedumerTheme from './theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ThemeProvider } from '@material-ui/core/styles';

/*
  Dit is de lijst voor alle personen
*/
const style = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
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
    },
    settingsList: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    text: {
      color: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
    }
  }),
);


class PersonList extends React.Component {

  constructor(props) {
    super(props);
    const { index, style } = props;
    this.state = {
      persons: null,
      dialog: false,
      currentPerson: null,
      listClickDisabled: false
    };

  }
  getData(){
    // Haal de data op van de database
    const that = this;
    fetch('http://localhost:4322'+'/api/getUsers/') // change this to yourip:4322
     .then(response => {var a = response.json();return a})
     .then(data => {that.setState({ persons: data })})
     .catch(error => {
      that.setState({ persons: [{"id":1,"naam":"Kan niet verbinden met database.","huisnummer":"0","postcode":"0000AA","telefoonnummer":"0000000000","vastBedrag":0,"rondeBedrag":0,"rondes":0,"code":'00000',"create_time":"2019-12-27T15:16:48.000Z"}]], listClickDisabled: true })
    });
  }
  componentDidMount() {
    this.getData();
  }

  render() {
    const { classes } = this.props;
    const { persons } = this.state;
    return (
      <div>
           {this.state.persons? (<List className={classes.root}>
             {persons.map((person,i) =>
               <ListItem divider button key={i} onClick={e=>!this.state.listClickDisabled?this.setState({dialog:true, currentPerson: persons[i]}): null}>
                 <ListItemText id={person.id} primary={person.naam} secondary={person.code} />
               </ListItem>

             )}
          </List>):<CircularProgress color="secondary" />} {/*loader moet nog gecenterd worden */}
          {this.state.dialog?(<Dialog fullScreen={fullScreenDialog} open={this.state.dialog} onClose={e => this.setState({dialog: false})} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.currentPerson["naam"]}</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
              <Button onClick={e => this.setState({dialog: false})} color="primary">
                Annuleren
              </Button>
              <Button onClick={e => this.setState({dialog: false})} color="secondary">
                Verwijderen
              </Button>
            </DialogActions>
          </Dialog>):null}
      </div>);

  }
}
export default withStyles(style)(PersonList);
