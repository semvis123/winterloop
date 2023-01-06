import React, { useState, useEffect } from 'React';
// eslint-disable-next-line no-unused-vars
import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

// Create style
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    }
  })
);

// Export component
export default function Main(props) {
  // Import style
  const ReactClasses = useStyle(props);

  // Global vars
  this._isMounted = false;

  // Declare states and set default states
  const [state, setState] = useState({});

  // Declare effects
  useEffect(() => {
    // Make sure object is mounted
    this._isMounted = true;

    // Cleanup effect
    return function Cleanup() {
      // Make sure object is unmounted
      this._isMounted = false;
    }
  })

  // Render
  return <div className={ReactClasses.root}></div>;
}