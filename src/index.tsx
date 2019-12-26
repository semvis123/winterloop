import React = require('react');
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style.scss';
import Header from './header';

// Import icons
import CreateIcon from '@material-ui/icons/Create';
import PollIcon from '@material-ui/icons/Poll';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

// Import pages
import RegistratiePage from './registratie';
import StempelsPage from './stempels';
import TransactiesPage from './transacties';

const pages = [
  {
    name: 'Registratie',
    icon: <CreateIcon />,
    page: <RegistratiePage />
  },
  {
    name: 'Stempels',
    icon: <PollIcon />,
    page: <StempelsPage />
  },
  {
    name: 'Transacties',
    icon: <AccountBalanceWalletIcon />,
    page: <TransactiesPage />
  }
]

ReactDOM.render(
  <Header pages={pages} index={0}/>,
  $('div[data-type="header"]')[0]
);

// Render page
ReactDOM.render(
  pages[0].page,
  $('div[data-type="main"]')[0]
);


// https://material-ui.com/getting-started/usage/