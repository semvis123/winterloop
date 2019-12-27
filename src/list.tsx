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
function api<T>: Promise<T> {
  return fetch("http://localhost:4322/")
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })
}

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={toString(api())} />
    </ListItem>
  );
}

export default function VirtualizedList(props) {
  const classes = useStyles(props);

  return (
      <div className={classes.root}>
        <FixedSizeList height={300} itemSize={46} itemCount={2}>
          {renderRow}
        </FixedSizeList>
      </div>
    );
}
