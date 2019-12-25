import React = require('react');
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 26,
    }
  }),
);

export default function FabBtn(props) {
  const classes = useStyles(props);

  return (
    <Fab aria-label="Add" className={classes.fab} color="primary">
      <AddIcon/>
    </Fab>
  );
}