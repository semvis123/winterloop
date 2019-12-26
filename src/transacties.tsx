import React = require('react');
import BedumerTheme from './theme';
import Fab from '@material-ui/core/Fab';
import PaymentIcon from '@material-ui/icons/Payment';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 26,
    }
  }),
);

export default function registratie(props) {
  const classes = useStyles(props);

  return (
    <ThemeProvider theme={BedumerTheme}>
      <Fab aria-label="Add" className={classes.fab} color="secondary">
        <PaymentIcon/>
      </Fab>
    </ThemeProvider>
  );
}