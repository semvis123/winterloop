import { createTheme } from '@mui/material/styles';
import $ from 'jquery';

$('div[data-type="main"]').css({
  background: (localStorage.getItem('dark') == 'true') ? '#424242' : '#fff'
});

/*creeer een thema*/
export default createTheme({
  palette: {
    mode: (localStorage.getItem('dark') == 'true') ? 'dark' : 'light',
    primary: {
      main: '#3268B1'
    },
    secondary: {
      main: '#FFF200'
    },
    background: {
      paper: (localStorage.getItem('dark') == 'true') ? '#424242' : '#fff'
    },
    text: {
      primary: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
      secondary: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.54)' : 'rgba(0, 0, 0, 0.54)',
      disabled: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
      // hint: (localStorage.getItem('dark') == 'true') ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)'
    }
  }
});
