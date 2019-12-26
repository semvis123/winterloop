import React = require('react');
import BedumerTheme from './theme';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
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
      <Fab aria-label="Search" className={classes.fab} color="secondary">
        <SearchIcon/>
      </Fab>
    </ThemeProvider>
  );
}