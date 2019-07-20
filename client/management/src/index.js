import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  typography : {
    fontFamily: '"Noto Sans KR", serif',
  }
})


ReactDOM.render(<BrowserRouter><MuiThemeProvider theme={theme}> <App /> </MuiThemeProvider></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
