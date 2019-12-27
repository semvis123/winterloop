import React = require('react');
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
// import * as mysql from 'mysql';
//
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'nodejs',
//   password : 'SQL123',
//   database : 'winterloop'
// });
//
// connection.connect();
//
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
//
// connection.end();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  );
}

export default function VirtualizedList(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <FixedSizeList height={300} itemSize={46} itemCount={2020}>
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
