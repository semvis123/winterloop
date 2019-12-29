import React = require('react');
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
import { fullScreenDialog } from './index';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);
export default class VirtualizedList extends React.Component {

  constructor(props) {
    super(props);
    const { index, style } = props;
    this.state = {
      persons: null,
      dialog: false,
      currentPerson: null
    };


  }
  getData(){
    const that = this;
     fetch('http://localhost:4322/')
    .then(response => {var a = response.json();return a})
    .then(data => {that.setState({ persons: data })});
  }
  componentDidMount() {
    this.getData();
  }

  render() {
    const { persons } = this.state;


    return (
      <div>
           {this.state.persons? (<List>
             {persons.map((person,i) =>
               <ListItem button key={i} onClick={e=>this.setState({dialog:true, currentPerson: persons[i]})}>
                 <ListItemText id={person.id} primary={person.naam} secondary={person.code} />
               </ListItem>

             )}
          </List>):<h4></h4>/* loader */}
          {this.state.dialog?(<Dialog fullScreen={fullScreenDialog} open={this.state.dialog} onClose={e => this.setState({dialog: false})} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.currentPerson["naam"]}</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
              <Button onClick={e => this.setState({dialog: false})} color="primary">
                Annuleren
              </Button>
              <Button onClick={e => this.setState({dialog: false})} color="primary">
                Opslaan
              </Button>
            </DialogActions>
          </Dialog>):null}
      </div>);

  }
}
