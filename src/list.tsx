import React = require('react');
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

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
      persons: [],
    };
  }
  componentDidMount() {
    const that = this;

    console.log(true);
    fetch('http://localhost:4322/')
    .then(response => {response.json(); console.log(response)})
    .then(data => {that.setState({ persons: data });console.log(data)});
    console.log(that.state.persons);// werkt nog niet :(
  }
  render() {
    const { persons } = this.state;
    console.log(persons);
    return (
      <div>
           {/* <FixedSizeList height={300} itemSize={46} itemCount={2}>
             {persons.map(person =>
               <ListItem button key={toString(person.id)}>
                 <ListItemText primary={toString(person.naam)} />
               </ListItem>
             )}
          </FixedSizeList> */}
      </div>);
    }
}
